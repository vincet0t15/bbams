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
            // Accounts
            'accounts.view',
            'accounts.create',
            'accounts.update',
            'accounts.delete',
            // Courses
            'courses.view',
            'courses.create',
            'courses.update',
            'courses.delete',
            // Year Levels
            'year-levels.view',
            'year-levels.create',
            'year-levels.update',
            'year-levels.delete',
            // Events
            'events.view',
            'events.create',
            'events.update',
            'events.delete',
            // Students
            'students.view',
            'students.create',
            'students.update',
            'students.delete',
            // Faculty
            'faculties.view',
            'faculties.create',
            'faculties.update',
            'faculties.delete',
            // Staff
            'staff.view',
            'staff.create',
            'staff.update',
            'staff.delete',
            // Attendance Logs
            'attendance-logs.view',
            'attendance-logs.create',
            // DTR (Daily Time Record)
            'dtr.view',
            'dtr.print',
            'dtr.print-batch',
            // Roles & Permissions
            'roles.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        $superAdmin = Role::findOrCreate('super_admin');
        $admin = Role::findOrCreate('admin');
        $staff = Role::findOrCreate('staff');
        $faculty = Role::findOrCreate('faculty');
        $student = Role::findOrCreate('student');
        $user = Role::findOrCreate('user');

        // super_admin gets everything
        $superAdmin->syncPermissions(Permission::all());

        // admin: view + create + update (no delete, no roles.manage)
        $admin->syncPermissions([
            // Accounts
            'accounts.view',
            'accounts.create',
            'accounts.update',
            // Courses
            'courses.view',
            'courses.create',
            'courses.update',
            // Year Levels
            'year-levels.view',
            'year-levels.create',
            'year-levels.update',
            // Events
            'events.view',
            'events.create',
            'events.update',
            // Students
            'students.view',
            'students.create',
            'students.update',
            // Faculty
            'faculties.view',
            'faculties.create',
            'faculties.update',
            // Staff
            'staff.view',
            'staff.create',
            'staff.update',
            // Attendance Logs
            'attendance-logs.view',
            'attendance-logs.create',
            // DTR
            'dtr.view',
            'dtr.print',
            'dtr.print-batch',
        ]);

        // staff/faculty: keep simple view + courses manage as before
        $staff->syncPermissions([
            'accounts.view',
            'courses.view',
            'courses.create',
            'courses.update',
            'attendance-logs.view',
            // DTR
            'dtr.view',
            'dtr.print',
        ]);
        $faculty->syncPermissions([
            'accounts.view',
            'courses.view',
            'courses.create',
            'courses.update',
            'attendance-logs.view',
            // DTR
            'dtr.view',
            'dtr.print',
        ]);
        // user / student: view-only
        $user->syncPermissions([
            'attendance-logs.view',
            'courses.view',
            'year-levels.view',
            'events.view',
            'students.view',
            'faculties.view',
            'staff.view',
            // DTR - view own only
            'dtr.view',
            'dtr.print',
        ]);
        $student->syncPermissions([
            'courses.view',
            'attendance-logs.view',
            // DTR - view own only
            'dtr.view',
            'dtr.print',
        ]);
    }
}
