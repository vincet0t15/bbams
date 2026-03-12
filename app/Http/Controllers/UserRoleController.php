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

        $user->syncRoles($validated['roles'] ?? []);

        return back()->with('success', 'User roles updated successfully.');
    }
}
