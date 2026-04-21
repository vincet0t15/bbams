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
        $courseId = $request->input('course_id');
        $yearLevelId = $request->input('year_level_id');

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
            ->when($courseId, fn($q) => $q->where('course_id', $courseId))
            ->when($yearLevelId, fn($q) => $q->where('year_level_id', $yearLevelId))
            ->orderBy('student_no', 'asc')
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
            'filters' => $request->only(['search', 'course_id', 'year_level_id']),
            'courses' => Course::orderBy('name')->get(['id', 'name', 'code']),
            'yearLevels' => YearLevel::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => $this->passwordRules(),
            'security_question' => ['nullable', 'string', 'max:255'],
            'security_answer' => ['nullable', 'string', 'max:255'],
            'student_no' => ['nullable', 'string', 'max:50', 'unique:students,student_no'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'year_level_id' => ['nullable', 'exists:year_levels,id'],
            'section' => ['nullable', 'string', 'max:50'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'extension_name' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($validated) {
            $fullName = trim(($validated['first_name'] ?? '') . ' ' . ($validated['middle_name'] ?? '') . ' ' . ($validated['last_name'] ?? ''));
            $user = User::create([
                'name' => $fullName ?: $validated['username'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'account_type' => 'student',
                'is_active' => false,
                'security_question' => $validated['security_question'] ?? null,
                'security_answer' => $validated['security_answer'] ?? null,
            ]);

            if (Role::query()->where('name', 'user')->exists()) {
                $user->assignRole('user');
            }

            Student::create([
                'user_id' => $user->id,
                'student_no' => $validated['student_no'] ?? null,
                'course_id' => $validated['course_id'] ?? null,
                'year_level_id' => $validated['year_level_id'] ?? null,
                'section' => $validated['section'] ?? null,
                'last_name' => $validated['last_name'] ?? null,
                'first_name' => $validated['first_name'] ?? null,
                'middle_name' => $validated['middle_name'] ?? null,
                'extension_name' => $validated['extension_name'] ?? null,
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
            'student_no' => ['nullable', 'string', 'max:50', 'unique:students,student_no,' . $student->id],
            'course_id' => ['nullable', 'exists:courses,id'],
            'year_level_id' => ['nullable', 'exists:year_levels,id'],
            'section' => ['nullable', 'string', 'max:50'],
        ]);

        DB::transaction(function () use ($student, $validated) {
            $fullName = $this->buildFullNameFromInput($validated);
            $student->user->update([
                'name' => $fullName !== '' ? $fullName : ($validated['name'] ?? $student->user->name),
                'last_name' => $validated['last_name'] ?? $student->user->last_name,
                'first_name' => $validated['first_name'] ?? $student->user->first_name,
                'middle_name' => $validated['middle_name'] ?? $student->user->middle_name,
                'extension_name' => $validated['extension_name'] ?? $student->user->extension_name,
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
