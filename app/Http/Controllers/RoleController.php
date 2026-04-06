<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        // Organize permissions by groups
        $permissions = Permission::query()->orderBy('name')->get();
        $groupedPermissions = $this->groupPermissions($permissions);

        return Inertia::render('roles/index', [
            'roles' => Role::query()
                ->with('permissions')
                ->orderBy('name')
                ->get()
                ->map(fn(Role $role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'description' => $role->description,
                    'permissions' => $role->permissions
                        ->sortBy('name')
                        ->values()
                        ->map(fn(Permission $permission) => [
                            'id' => $permission->id,
                            'name' => $permission->name,
                        ]),
                ]),
            'permissions' => $permissions->map(fn(Permission $permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
            ]),
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    private function groupPermissions($permissions)
    {
        $groups = [
            'Accounts' => [],
            'Courses' => [],
            'Year Levels' => [],
            'Events' => [],
            'Students' => [],
            'Faculty' => [],
            'Staff' => [],
            'Attendance Logs' => [],
            'DTR (Daily Time Record)' => [],
            'Roles & Permissions' => [],
        ];

        foreach ($permissions as $permission) {
            $name = $permission->name;

            if (str_starts_with($name, 'accounts.')) {
                $groups['Accounts'][] = ['id' => $permission->id, 'name' => $name];
            } elseif (str_starts_with($name, 'courses.')) {
                $groups['Courses'][] = ['id' => $permission->id, 'name' => $name];
            } elseif (str_starts_with($name, 'year-levels.')) {
                $groups['Year Levels'][] = ['id' => $permission->id, 'name' => $name];
            } elseif (str_starts_with($name, 'events.')) {
                $groups['Events'][] = ['id' => $permission->id, 'name' => $name];
            } elseif (str_starts_with($name, 'students.')) {
                $groups['Students'][] = ['id' => $permission->id, 'name' => $name];
            } elseif (str_starts_with($name, 'faculties.')) {
                $groups['Faculty'][] = ['id' => $permission->id, 'name' => $name];
            } elseif (str_starts_with($name, 'staff.')) {
                $groups['Staff'][] = ['id' => $permission->id, 'name' => $name];
            } elseif (str_starts_with($name, 'attendance-logs.')) {
                $groups['Attendance Logs'][] = ['id' => $permission->id, 'name' => $name];
            } elseif (str_starts_with($name, 'dtr.')) {
                $groups['DTR (Daily Time Record)'][] = ['id' => $permission->id, 'name' => $name];
            } elseif (str_starts_with($name, 'roles.') || str_starts_with($name, 'permissions.')) {
                $groups['Roles & Permissions'][] = ['id' => $permission->id, 'name' => $name];
            }
        }

        // Remove empty groups
        return array_filter($groups, fn($group) => !empty($group));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role = Role::create(['name' => $validated['name']]);

        $role->syncPermissions($validated['permissions'] ?? []);

        return back()->with('success', 'Role created successfully.');
    }

    public function update(Request $request, Role $role)
    {
        if ($role->name === 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name,' . $role->id],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return back()->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'admin') {
            abort(403);
        }

        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }
}
