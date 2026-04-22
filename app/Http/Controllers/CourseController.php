<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $courseList = Course::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Courses/Index', [
            'courseList' => $courseList,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return inertia('Courses/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        Course::create($request->only(['name', 'code', 'description']));

        return redirect()->route('courses.index')->with('success', 'Course created successfully');
    }

    public function update(Request $request, Course $course)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $course->update($request->only(['name', 'code', 'description']));

        return redirect()->back()->with('success', 'Course updated successfully');
    }

    public function destroy(Course $course)
    {
        $course->deleted_by = $course->deleted_by ?? Auth::id();
        $course->save();
        $course->delete();

        return redirect()->route('courses.index')->with('success', 'Course deleted successfully');
    }
}
