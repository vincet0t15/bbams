<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RolesAndPermissionsSeeder::class);

        $email = env('SUPER_ADMIN_EMAIL', 'superadmin@bbams.test');
        $username = env('SUPER_ADMIN_USERNAME', 'superadmin');
        $name = env('SUPER_ADMIN_NAME', 'Super Administrator');
        $password = env('SUPER_ADMIN_PASSWORD', 'superadmin');

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
            $user->syncRoles(['super_admin']);
        }
    }
}
