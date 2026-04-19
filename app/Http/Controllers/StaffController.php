<?php

namespace App\Http\Controllers;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class StaffController extends Controller
{
    use PasswordValidationRules, ProfileValidationRules;

    public function index(Request $request)
    {
        $search = $request->input('search');

        $staff = Staff::query()
            ->with('user')
            ->when($search, function ($query, $search) {
                $query->where('employee_no', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('username', 'like', "%{$search}%");
                    });
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Staff/Index', [
            'staffList' => $staff->through(function (Staff $s) {
                return [
                    'id' => $s->id,
                    'employee_no' => $s->employee_no,
                    'department' => $s->department,
                    'position' => $s->position,
                    'user' => [
                        'id' => $s->user?->id,
                        'name' => $s->user?->name,
                        'email' => $s->user?->email,
                        'username' => $s->user?->username,
                    ],
                ];
            }),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => $this->passwordRules(),
            'employee_no' => ['nullable', 'string', 'max:50', 'unique:staff,employee_no'],
            'department' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'extension_name' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($validated) {
            $fullName = trim(($validated['first_name'] ?? '').' '.($validated['middle_name'] ?? '').' '.($validated['last_name'] ?? ''));
            $user = User::create([
                'name' => $fullName ?: $validated['username'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'account_type' => 'staff',
                'is_active' => false,
            ]);

            if (Role::query()->where('name', 'user')->exists()) {
                $user->assignRole('user');
            }

            Staff::create([
                'user_id' => $user->id,
                'employee_no' => $validated['employee_no'] ?? null,
                'department' => $validated['department'] ?? null,
                'position' => $validated['position'] ?? null,
                'last_name' => $validated['last_name'] ?? null,
                'first_name' => $validated['first_name'] ?? null,
                'middle_name' => $validated['middle_name'] ?? null,
                'extension_name' => $validated['extension_name'] ?? null,
            ]);
        });

        return back()->with('success', 'Staff created successfully');
    }

    public function update(Request $request, Staff $staff)
    {
        $request->merge([
            'password' => $request->input('password') ?: null,
            'password_confirmation' => $request->input('password_confirmation') ?: null,
        ]);

        $validated = $request->validate([
            ...$this->profileRules($staff->user_id),
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
            'employee_no' => ['nullable', 'string', 'max:50', 'unique:staff,employee_no,'.$staff->id],
            'department' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:100'],
        ]);

        DB::transaction(function () use ($staff, $validated) {
            $fullName = $this->buildFullNameFromInput($validated);
            $staff->user->update([
                'name' => $fullName !== '' ? $fullName : ($validated['name'] ?? $staff->user->name),
                'last_name' => $validated['last_name'] ?? $staff->user->last_name,
                'first_name' => $validated['first_name'] ?? $staff->user->first_name,
                'middle_name' => $validated['middle_name'] ?? $staff->user->middle_name,
                'extension_name' => $validated['extension_name'] ?? $staff->user->extension_name,
                'username' => $validated['username'],
                'email' => $validated['email'],
            ]);

            if (! empty($validated['password'])) {
                $staff->user->update(['password' => $validated['password']]);
            }

            $staff->update([
                'employee_no' => $validated['employee_no'] ?? null,
                'department' => $validated['department'] ?? null,
                'position' => $validated['position'] ?? null,
            ]);
        });

        return back()->with('success', 'Staff updated successfully');
    }

    public function destroy(Staff $staff)
    {
        $staff->deleted_by = $staff->deleted_by ?? Auth::id();
        $staff->save();
        $staff->delete();

        return back()->with('success', 'Staff deleted successfully');
    }
}
