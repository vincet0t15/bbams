<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RolesAndPermissionsSeeder::class);

        $email = env('ADMIN_EMAIL', 'admin@bbams.test');
        $username = env('ADMIN_USERNAME', 'admin');
        $name = env('ADMIN_NAME', 'Administrator');
        $password = env('ADMIN_PASSWORD', 'password');

        /** @var User $user */
        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'username' => $username,
                'password' => Hash::make($password),
                'email_verified_at' => Carbon::now(),
            ],
        );

        $user->forceFill(['is_active' => true])->save();

        if (method_exists($user, 'syncRoles')) {
            $user->syncRoles(['admin']);
        }
    }
}
