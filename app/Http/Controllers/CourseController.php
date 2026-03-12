<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $courseList = Course::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Courses/Index', [
            'courseList' => $courseList,
            'filters' => [
                'search' => $search,
            ]
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
            'description' => 'required|string|max:255',
        ]);

        Course::create($request->all());

        return redirect()->route('courses.index')->with('success', 'Course created successfully');
    }

    public function update(Request $request, Course $course)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        $course->update($request->all());

        return redirect()->route('courses.index')->with('success', 'Course updated successfully');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('courses.index')->with('success', 'Course deleted successfully');
    }
}
