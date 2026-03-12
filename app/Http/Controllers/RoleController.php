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
        return Inertia::render('roles/index', [
            'roles' => Role::query()
                ->with('permissions')
                ->orderBy('name')
                ->get()
                ->map(fn (Role $role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'permissions' => $role->permissions
                        ->sortBy('name')
                        ->values()
                        ->map(fn (Permission $permission) => [
                            'id' => $permission->id,
                            'name' => $permission->name,
                        ]),
                ]),
            'permissions' => Permission::query()
                ->orderBy('name')
                ->get()
                ->map(fn (Permission $permission) => [
                    'id' => $permission->id,
                    'name' => $permission->name,
                ]),
        ]);
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
            'name' => ['required', 'string', 'max:255', 'unique:roles,name,'.$role->id],
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
