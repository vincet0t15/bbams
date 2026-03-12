<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StaffController extends Controller
{
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
            'users' => User::whereDoesntHave('staff')
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'username']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', 'unique:staff,user_id'],
            'employee_no' => ['nullable', 'string', 'max:50', 'unique:staff,employee_no'],
            'department' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:100'],
        ]);

        Staff::create($validated);

        return back()->with('success', 'Staff created successfully');
    }

    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', 'unique:staff,user_id,'.$staff->id],
            'employee_no' => ['nullable', 'string', 'max:50', 'unique:staff,employee_no,'.$staff->id],
            'department' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:100'],
        ]);

        $staff->update($validated);

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
