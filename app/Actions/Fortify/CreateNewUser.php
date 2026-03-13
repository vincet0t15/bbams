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
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $fullName = $this->buildFullNameFromInput($input);

        $user = User::create([
            'name' => $fullName !== '' ? $fullName : $input['name'],
            'last_name' => $input['last_name'] ?? null,
            'first_name' => $input['first_name'] ?? null,
            'middle_name' => $input['middle_name'] ?? null,
            'extension_name' => $input['extension_name'] ?? null,
            'username' => $input['username'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        if (Role::query()->where('name', 'user')->exists()) {
            $user->assignRole('user');
        }

        return $user;
    }
}
