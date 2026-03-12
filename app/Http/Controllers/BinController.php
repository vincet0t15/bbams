<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class BinController extends Controller
{
    public function index(Request $request)
    {
        $courses = Course::onlyTrashed()
            ->with('deletedBy')
            ->latest('deleted_at')
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'name' => $course->name,
                'deleted_at' => $course->deleted_at
                    ? Carbon::parse($course->deleted_at)->toDateTimeString()
                    : null,
                'deleted_by' => $course->deletedBy?->name,
            ]);

        $events = Event::onlyTrashed()
            ->with('deletedBy')
            ->latest('deleted_at')
            ->get()
            ->map(fn (Event $event) => [
                'id' => $event->id,
                'title' => $event->name,
                'deleted_at' => $event->deleted_at
                    ? Carbon::parse($event->deleted_at)->toDateTimeString()
                    : null,
                'deleted_by' => $event->deletedBy?->name,
            ]);

        return Inertia::render('bin/index', [
            'courses' => $courses,
            'events' => $events,
        ]);
    }

    public function restoreCourse(int $course)
    {
        $model = Course::onlyTrashed()->findOrFail($course);
        $model->restore();

        return back()->with('success', 'Course restored successfully.');
    }

    public function forceDeleteCourse(int $course)
    {
        $model = Course::onlyTrashed()->findOrFail($course);
        $model->forceDelete();

        return back()->with('success', 'Course permanently deleted.');
    }

    public function restoreEvent(int $event)
    {
        $model = Event::onlyTrashed()->findOrFail($event);
        $model->restore();

        return back()->with('success', 'Event restored successfully.');
    }

    public function forceDeleteEvent(int $event)
    {
        $model = Event::onlyTrashed()->findOrFail($event);
        $model->forceDelete();

        return back()->with('success', 'Event permanently deleted.');
    }
}
