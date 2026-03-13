<?php

namespace App\Http\Controllers;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Faculty;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class FacultyController extends Controller
{
    use PasswordValidationRules, ProfileValidationRules;

    public function index(Request $request)
    {
        $search = $request->input('search');

        $faculties = Faculty::query()
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

        return Inertia::render('Faculty/Index', [
            'facultyList' => $faculties->through(function (Faculty $f) {
                return [
                    'id' => $f->id,
                    'employee_no' => $f->employee_no,
                    'department' => $f->department,
                    'position' => $f->position,
                    'user' => [
                        'id' => $f->user?->id,
                        'name' => $f->user?->name,
                        'email' => $f->user?->email,
                        'username' => $f->user?->username,
                    ],
                ];
            }),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'employee_no' => ['nullable', 'string', 'max:50', 'unique:faculties,employee_no'],
            'department' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:100'],
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => $validated['password'],
            ]);

            $user->forceFill(['is_active' => true])->save();

            if (Role::query()->where('name', 'user')->exists()) {
                $user->assignRole('user');
            }

            Faculty::create([
                'user_id' => $user->id,
                'employee_no' => $validated['employee_no'] ?? null,
                'department' => $validated['department'] ?? null,
                'position' => $validated['position'] ?? null,
            ]);
        });

        return back()->with('success', 'Faculty created successfully');
    }

    public function update(Request $request, Faculty $faculty)
    {
        $request->merge([
            'password' => $request->input('password') ?: null,
            'password_confirmation' => $request->input('password_confirmation') ?: null,
        ]);

        $validated = $request->validate([
            ...$this->profileRules($faculty->user_id),
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
            'employee_no' => ['nullable', 'string', 'max:50', 'unique:faculties,employee_no,'.$faculty->id],
            'department' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:100'],
        ]);

        DB::transaction(function () use ($faculty, $validated) {
            $faculty->user->update([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
            ]);

            if (! empty($validated['password'])) {
                $faculty->user->update(['password' => $validated['password']]);
            }

            $faculty->update([
                'employee_no' => $validated['employee_no'] ?? null,
                'department' => $validated['department'] ?? null,
                'position' => $validated['position'] ?? null,
            ]);
        });

        return back()->with('success', 'Faculty updated successfully');
    }

    public function destroy(Faculty $faculty)
    {
        $faculty->deleted_by = $faculty->deleted_by ?? Auth::id();
        $faculty->save();
        $faculty->delete();

        return back()->with('success', 'Faculty deleted successfully');
    }
}
