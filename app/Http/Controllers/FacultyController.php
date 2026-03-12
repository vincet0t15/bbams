<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FacultyController extends Controller
{
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
            'users' => User::whereDoesntHave('faculty')
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'username']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', 'unique:faculties,user_id'],
            'employee_no' => ['nullable', 'string', 'max:50', 'unique:faculties,employee_no'],
            'department' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:100'],
        ]);

        Faculty::create($validated);

        return back()->with('success', 'Faculty created successfully');
    }

    public function update(Request $request, Faculty $faculty)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', 'unique:faculties,user_id,'.$faculty->id],
            'employee_no' => ['nullable', 'string', 'max:50', 'unique:faculties,employee_no,'.$faculty->id],
            'department' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:100'],
        ]);

        $faculty->update($validated);

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
