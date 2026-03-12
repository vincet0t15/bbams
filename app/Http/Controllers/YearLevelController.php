<?php

namespace App\Http\Controllers;

use App\Models\YearLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class YearLevelController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $yearLevels = YearLevel::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('YearLevels/Index', [
            'yearLevelList' => $yearLevels->through(function (YearLevel $yl) {
                return [
                    'id' => $yl->id,
                    'name' => $yl->name,
                    'description' => $yl->description,
                ];
            }),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        YearLevel::create($validated);

        return back()->with('success', 'Year level created successfully');
    }

    public function update(Request $request, YearLevel $yearLevel)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $yearLevel->update($validated);

        return back()->with('success', 'Year level updated successfully');
    }

    public function destroy(YearLevel $yearLevel)
    {
        $yearLevel->deleted_by = $yearLevel->deleted_by ?? Auth::id();
        $yearLevel->save();
        $yearLevel->delete();

        return back()->with('success', 'Year level deleted successfully');
    }
}
