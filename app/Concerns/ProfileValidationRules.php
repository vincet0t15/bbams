<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255', 'required_without:last_name'],
            'last_name' => ['nullable', 'string', 'max:255', 'required_without:name'],
            'first_name' => ['nullable', 'string', 'max:255', 'required_without:name'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'extension_name' => ['nullable', 'string', 'max:50'],
            'username' => $this->usernameRules($userId),
            'email' => $this->emailRules($userId),
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    protected function usernameRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    protected function buildFullNameFromInput(array $input): string
    {
        $last = trim((string) ($input['last_name'] ?? ''));
        $first = trim((string) ($input['first_name'] ?? ''));
        $middle = trim((string) ($input['middle_name'] ?? ''));
        $ext = trim((string) ($input['extension_name'] ?? ''));

        if ($last !== '' || $first !== '') {
            $parts = [];
            if ($last !== '') {
                $parts[] = $last.',';
            }
            if ($first !== '') {
                $parts[] = $first;
            }
            if ($middle !== '') {
                $parts[] = $middle;
            }
            if ($ext !== '') {
                $parts[] = $ext;
            }

            return trim(implode(' ', $parts));
        }

        return (string) ($input['name'] ?? '');
    }
}
