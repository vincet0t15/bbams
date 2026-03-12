<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'accounts.view',
            'accounts.manage',
            'courses.view',
            'courses.manage',
            'roles.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        $admin = Role::findOrCreate('admin');
        $staff = Role::findOrCreate('staff');
        $faculty = Role::findOrCreate('faculty');
        $student = Role::findOrCreate('student');
        $user = Role::findOrCreate('user');

        $admin->syncPermissions($permissions);
        $staff->syncPermissions([
            'accounts.view',
            'courses.view',
            'courses.manage',
        ]);
        $faculty->syncPermissions([
            'accounts.view',
            'courses.view',
            'courses.manage',
        ]);
        $user->syncPermissions([
            'courses.view',
        ]);
        $student->syncPermissions([
            'courses.view',
        ]);
    }
}
