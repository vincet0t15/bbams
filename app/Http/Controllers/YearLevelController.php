<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\YearLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class YearLevelController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $courseId = $request->input('course_id');

        $yearLevels = YearLevel::query()
            ->with('course')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($courseId, function ($query, $courseId) {
                $query->where('course_id', $courseId);
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
                    'course' => [
                        'id' => $yl->course?->id,
                        'name' => $yl->course?->name,
                        'code' => $yl->course?->code,
                    ],
                ];
            }),
            'courses' => Course::orderBy('name')->get(['id', 'name', 'code']),
            'filters' => $request->only(['search', 'course_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        YearLevel::create($validated);

        return back()->with('success', 'Year level created successfully');
    }

    public function update(Request $request, YearLevel $yearLevel)
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
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
