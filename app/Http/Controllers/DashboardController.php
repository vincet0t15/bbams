<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\Event;
use App\Models\Faculty;
use App\Models\Staff;
use App\Models\Student;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $students = Student::count();
        $faculties = Faculty::count();
        $staff = Staff::count();
        $events = Event::count();

        $todayStart = Carbon::today()->startOfDay();
        $todayEnd = Carbon::today()->endOfDay();
        $todayLogs = AttendanceLog::whereBetween('date_time', [$todayStart, $todayEnd])->get();
        $todayIn = $todayLogs->where('check_type', 1)->count();
        $todayOut = $todayLogs->where('check_type', 2)->count();

        $latestEvent = Event::orderByDesc('id')->first();

        return Inertia::render('dashboard', [
            'stats' => [
                'students' => $students,
                'faculties' => $faculties,
                'staff' => $staff,
                'events' => $events,
                'today_in' => $todayIn,
                'today_out' => $todayOut,
                'latest_event' => $latestEvent ? [
                    'id' => $latestEvent->id,
                    'title' => $latestEvent->title ?? $latestEvent->name ?? ('Event #'.$latestEvent->id),
                ] : null,
            ],
        ]);
    }
}
