<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search');

        $accounts = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('users/index', [
            'userList' => $accounts,
            'filters' => $request->only(['search']),
        ]);
    }
}
