<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Student;
use App\Models\User;
use App\Models\YearLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $students = Student::query()
            ->with(['user', 'course', 'yearLevel'])
            ->when($search, function ($query, $search) {
                $query->where('student_no', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('username', 'like', "%{$search}%");
                    });
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Students/Index', [
            'studentList' => $students->through(function (Student $s) {
                return [
                    'id' => $s->id,
                    'student_no' => $s->student_no,
                    'section' => $s->section,
                    'user' => [
                        'id' => $s->user?->id,
                        'name' => $s->user?->name,
                        'email' => $s->user?->email,
                        'username' => $s->user?->username,
                    ],
                    'course' => $s->course ? [
                        'id' => $s->course->id,
                        'name' => $s->course->name,
                        'code' => $s->course->code,
                    ] : null,
                    'year_level' => $s->yearLevel ? [
                        'id' => $s->yearLevel->id,
                        'name' => $s->yearLevel->name,
                    ] : null,
                ];
            }),
            'filters' => $request->only(['search']),
            'users' => User::whereDoesntHave('student')
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'username']),
            'courses' => Course::orderBy('name')->get(['id', 'name', 'code']),
            'yearLevels' => YearLevel::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', 'unique:students,user_id'],
            'student_no' => ['nullable', 'string', 'max:50', 'unique:students,student_no'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'year_level_id' => ['nullable', 'exists:year_levels,id'],
            'section' => ['nullable', 'string', 'max:50'],
        ]);

        Student::create($validated);

        return back()->with('success', 'Student created successfully');
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', 'unique:students,user_id,'.$student->id],
            'student_no' => ['nullable', 'string', 'max:50', 'unique:students,student_no,'.$student->id],
            'course_id' => ['nullable', 'exists:courses,id'],
            'year_level_id' => ['nullable', 'exists:year_levels,id'],
            'section' => ['nullable', 'string', 'max:50'],
        ]);

        $student->update($validated);

        return back()->with('success', 'Student updated successfully');
    }

    public function destroy(Student $student)
    {
        $student->deleted_by = $student->deleted_by ?? Auth::id();
        $student->save();
        $student->delete();

        return back()->with('success', 'Student deleted successfully');
    }
}
