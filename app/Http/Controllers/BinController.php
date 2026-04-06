<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Event;
use App\Models\Faculty;
use App\Models\Staff;
use App\Models\Student;
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

        $faculties = Faculty::onlyTrashed()
            ->with('user', 'deletedBy')
            ->latest('deleted_at')
            ->get()
            ->map(fn (Faculty $faculty) => [
                'id' => $faculty->id,
                'name' => $faculty->user?->name,
                'employee_no' => $faculty->employee_no,
                'deleted_at' => $faculty->deleted_at
                    ? Carbon::parse($faculty->deleted_at)->toDateTimeString()
                    : null,
                'deleted_by' => $faculty->deletedBy?->name,
            ]);

        $staffs = Staff::onlyTrashed()
            ->with('user', 'deletedBy')
            ->latest('deleted_at')
            ->get()
            ->map(fn (Staff $staff) => [
                'id' => $staff->id,
                'name' => $staff->user?->name,
                'employee_no' => $staff->employee_no,
                'deleted_at' => $staff->deleted_at
                    ? Carbon::parse($staff->deleted_at)->toDateTimeString()
                    : null,
                'deleted_by' => $staff->deletedBy?->name,
            ]);

        $students = Student::onlyTrashed()
            ->with('user', 'deletedBy')
            ->latest('deleted_at')
            ->get()
            ->map(fn (Student $student) => [
                'id' => $student->id,
                'name' => $student->user?->name,
                'student_no' => $student->student_no,
                'deleted_at' => $student->deleted_at
                    ? Carbon::parse($student->deleted_at)->toDateTimeString()
                    : null,
                'deleted_by' => $student->deletedBy?->name,
            ]);

        return Inertia::render('bin/index', [
            'courses' => $courses,
            'events' => $events,
            'faculties' => $faculties,
            'staffs' => $staffs,
            'students' => $students,
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

    public function restoreFaculty(int $faculty)
    {
        $model = Faculty::onlyTrashed()->findOrFail($faculty);
        $model->restore();

        return back()->with('success', 'Faculty restored successfully.');
    }

    public function forceDeleteFaculty(int $faculty)
    {
        $model = Faculty::onlyTrashed()->findOrFail($faculty);
        $model->forceDelete();

        return back()->with('success', 'Faculty permanently deleted.');
    }

    public function restoreStaff(int $staff)
    {
        $model = Staff::onlyTrashed()->findOrFail($staff);
        $model->restore();

        return back()->with('success', 'Staff restored successfully.');
    }

    public function forceDeleteStaff(int $staff)
    {
        $model = Staff::onlyTrashed()->findOrFail($staff);
        $model->forceDelete();

        return back()->with('success', 'Staff permanently deleted.');
    }

    public function restoreStudent(int $student)
    {
        $model = Student::onlyTrashed()->findOrFail($student);
        $model->restore();

        return back()->with('success', 'Student restored successfully.');
    }

    public function forceDeleteStudent(int $student)
    {
        $model = Student::onlyTrashed()->findOrFail($student);
        $model->forceDelete();

        return back()->with('success', 'Student permanently deleted.');
    }
}
