<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Spatie\Permission\Models\Role;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
            'account_type' => ['required', 'in:admin,student,faculty,staff'],
            'security_question' => ['required', 'string', 'max:255'],
            'security_answer' => ['required', 'string', 'max:255'],
        ])->validate();

        $user = User::create([
            'name' => $input['username'],
            'username' => $input['username'],
            'email' => $input['email'],
            'password' => $input['password'],
            'account_type' => $input['account_type'],
            'security_question' => $input['security_question'],
            'security_answer' => $input['security_answer'],
        ]);

        if (Role::query()->where('name', 'user')->exists()) {
            $user->assignRole('user');
        }

        return $user;
    }
}
