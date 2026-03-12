<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserRoleController extends Controller
{
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'roles' => ['array'],
            'roles.*' => ['string', 'exists:roles,name'],
        ]);

        $roles = $validated['roles'] ?? [];
        $classRoles = ['student', 'faculty', 'staff'];
        $selectedClassRoles = array_values(array_intersect($roles, $classRoles));
        if (count($selectedClassRoles) > 1) {
            return back()->withErrors([
                'roles' => 'Select only one among student, faculty, or staff.',
            ]);
        }

        $user->syncRoles($roles);

        return back()->with('success', 'User roles updated successfully.');
    }
}
