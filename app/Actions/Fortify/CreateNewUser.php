<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Models\Faculty;
use App\Models\Staff;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Spatie\Permission\Models\Role;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Log::info('Registration attempt', $input);

        Validator::make($input, [
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
            'account_type' => ['required', 'in:admin,student,faculty,staff'],
            'security_question' => ['required', 'string', 'max:255'],
            'security_answer' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'extension_name' => ['nullable', 'string', 'max:255'],
            'student_no' => ['nullable', 'string', 'max:255', 'unique:students'],
            'employee_no' => ['nullable', 'string', 'max:255', 'unique:faculties,employee_no', 'unique:staff,employee_no'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'year_level_id' => ['nullable', 'exists:year_levels,id'],
            'section' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
        ])->validate();

        Log::info('Validation passed, creating user');

        $user = User::create([
            'name' => $input['username'],
            'username' => $input['username'],
            'email' => $input['email'],
            'password' => $input['password'],
            'account_type' => $input['account_type'],
            'security_question' => $input['security_question'],
            'security_answer' => $input['security_answer'],
        ]);

        Log::info('User created', ['user_id' => $user->id]);

        $accountType = $input['account_type'];

        if ($accountType === 'student') {
            Student::create([
                'user_id' => $user->id,
                'student_no' => $input['student_no'] ?? null,
                'last_name' => $input['last_name'] ?? null,
                'first_name' => $input['first_name'] ?? null,
                'middle_name' => $input['middle_name'] ?? null,
                'extension_name' => $input['extension_name'] ?? null,
                'course_id' => $input['course_id'] ?? null,
                'year_level_id' => $input['year_level_id'] ?? null,
                'section' => $input['section'] ?? null,
            ]);
        } elseif ($accountType === 'faculty') {
            Faculty::create([
                'user_id' => $user->id,
                'employee_no' => $input['employee_no'] ?? null,
                'last_name' => $input['last_name'] ?? null,
                'first_name' => $input['first_name'] ?? null,
                'middle_name' => $input['middle_name'] ?? null,
                'extension_name' => $input['extension_name'] ?? null,
                'department' => $input['department'] ?? null,
                'position' => $input['position'] ?? null,
            ]);
        } elseif ($accountType === 'staff') {
            Staff::create([
                'user_id' => $user->id,
                'employee_no' => $input['employee_no'] ?? null,
                'last_name' => $input['last_name'] ?? null,
                'first_name' => $input['first_name'] ?? null,
                'middle_name' => $input['middle_name'] ?? null,
                'extension_name' => $input['extension_name'] ?? null,
                'department' => $input['department'] ?? null,
                'position' => $input['position'] ?? null,
            ]);
        }

        if (Role::query()->where('name', 'user')->exists()) {
            $user->assignRole('user');
        }

        return $user;
    }
}
