<?php

namespace App\Http\Controllers;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Course;
use App\Models\Student;
use App\Models\User;
use App\Models\YearLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class StudentController extends Controller
{
    use PasswordValidationRules, ProfileValidationRules;

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
            'courses' => Course::orderBy('name')->get(['id', 'name', 'code']),
            'yearLevels' => YearLevel::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'student_no' => ['nullable', 'string', 'max:50', 'unique:students,student_no'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'year_level_id' => ['nullable', 'exists:year_levels,id'],
            'section' => ['nullable', 'string', 'max:50'],
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => $validated['password'],
            ]);

            $user->forceFill(['is_active' => true])->save();

            if (Role::query()->where('name', 'student')->exists()) {
                $user->assignRole('student');
            }

            Student::create([
                'user_id' => $user->id,
                'student_no' => $validated['student_no'] ?? null,
                'course_id' => $validated['course_id'] ?? null,
                'year_level_id' => $validated['year_level_id'] ?? null,
                'section' => $validated['section'] ?? null,
            ]);
        });

        return back()->with('success', 'Student created successfully');
    }

    public function update(Request $request, Student $student)
    {
        $request->merge([
            'password' => $request->input('password') ?: null,
            'password_confirmation' => $request->input('password_confirmation') ?: null,
        ]);

        $validated = $request->validate([
            ...$this->profileRules($student->user_id),
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
            'student_no' => ['nullable', 'string', 'max:50', 'unique:students,student_no,'.$student->id],
            'course_id' => ['nullable', 'exists:courses,id'],
            'year_level_id' => ['nullable', 'exists:year_levels,id'],
            'section' => ['nullable', 'string', 'max:50'],
        ]);

        DB::transaction(function () use ($student, $validated) {
            $student->user->update([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
            ]);

            if (! empty($validated['password'])) {
                $student->user->update(['password' => $validated['password']]);
            }

            $student->update([
                'student_no' => $validated['student_no'] ?? null,
                'course_id' => $validated['course_id'] ?? null,
                'year_level_id' => $validated['year_level_id'] ?? null,
                'section' => $validated['section'] ?? null,
            ]);
        });

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
