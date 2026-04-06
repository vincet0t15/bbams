<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\Course;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function attendance(Request $request)
    {
        $search = $request->input('search');
        $eventId = $request->input('event_id');
        $role = $request->input('role');
        $courseId = $request->input('course_id');
        $start = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))->startOfDay()
            : now()->startOfMonth();
        $end = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))->endOfDay()
            : now()->endOfMonth();

        $eventTitleColumn = Schema::hasColumn('events', 'title') ? 'title' : 'name';
        $eventStartColumn = Schema::hasColumn('events', 'start_at') ? 'start_at' : 'date_from';

        $events = Event::query()
            ->orderByDesc($eventStartColumn)
            ->get(['id', $eventTitleColumn])
            ->map(fn(Event $e) => [
                'id' => $e->id,
                'title' => $e->getAttribute($eventTitleColumn),
            ]);

        $courses = Course::orderBy('name')->get(['id', 'name', 'code']);

        $logs = AttendanceLog::query()
            ->with(['user.roles', 'user.student', 'event'])
            ->when($search, function ($q, $search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            })
            ->when($eventId && $eventId !== 'all', fn($q) => $q->where('event_id', $eventId))
            ->when($role && $role !== 'all', function ($q) use ($role) {
                $q->whereHas('user.roles', fn($rq) => $rq->where('name', $role));
            })
            ->when($courseId && $courseId !== 'all', function ($q) use ($courseId) {
                $q->whereHas('user.student', fn($sq) => $sq->where('course_id', $courseId));
            })
            ->whereBetween('date_time', [$start, $end])
            ->orderByDesc('date_time')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Reports/Attendance', [
            'report' => $logs->through(function (AttendanceLog $log) use ($eventTitleColumn) {
                return [
                    'id' => $log->id,
                    'date_time' => $log->date_time ? Carbon::parse($log->date_time)->toDateTimeString() : null,
                    'check_type_label' => (int) $log->check_type === 1 ? 'IN' : 'OUT',
                    'user' => [
                        'id' => $log->user?->id,
                        'name' => $log->user?->name,
                        'username' => $log->user?->username,
                        'role' => $log->user?->getRoleNames()->first(),
                    ],
                    'event' => [
                        'id' => $log->event?->id,
                        'title' => $log->event?->getAttribute($eventTitleColumn),
                    ],
                ];
            }),
            'events' => $events,
            'courses' => $courses,
            'filters' => $request->only(['search', 'event_id', 'start_date', 'end_date', 'role', 'course_id']),
            'range' => [
                'start' => $start->toDateString(),
                'end' => $end->toDateString(),
            ],
        ]);
    }

    public function attendanceCount(Request $request)
    {
        $search = $request->input('search');
        $eventId = $request->input('event_id');
        $role = $request->input('role');
        $courseId = $request->input('course_id');
        $start = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))->startOfDay()
            : now()->startOfMonth();
        $end = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))->endOfDay()
            : now()->endOfMonth();

        $eventTitleColumn = Schema::hasColumn('events', 'title') ? 'title' : 'name';
        $eventStartColumn = Schema::hasColumn('events', 'start_at') ? 'start_at' : 'date_from';

        $events = Event::query()
            ->orderByDesc($eventStartColumn)
            ->get(['id', $eventTitleColumn])
            ->map(fn(Event $e) => [
                'id' => $e->id,
                'title' => $e->getAttribute($eventTitleColumn),
            ]);

        $courses = Course::orderBy('name')->get(['id', 'name', 'code']);

        // Get all logs for calculations
        $allLogs = AttendanceLog::query()
            ->with(['user.roles', 'user.student', 'event'])
            ->when($search, function ($q, $search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            })
            ->when($eventId && $eventId !== 'all', fn($q) => $q->where('event_id', $eventId))
            ->when($role && $role !== 'all', function ($q) use ($role) {
                $q->whereHas('user.roles', fn($rq) => $rq->where('name', $role));
            })
            ->when($courseId && $courseId !== 'all', function ($q) use ($courseId) {
                $q->whereHas('user.student', fn($sq) => $sq->where('course_id', $courseId));
            })
            ->whereBetween('date_time', [$start, $end])
            ->orderBy('date_time')
            ->get();

        // Group by user
        $grouped = $allLogs->groupBy('user_id')->map(function ($logs) use ($eventTitleColumn) {
            $user = $logs->first()->user;
            $presentDays = $logs->where('check_type', 1)->map(function (AttendanceLog $l) {
                return Carbon::parse($l->date_time)->toDateString();
            })->unique()->values();

            $totalIn = $logs->where('check_type', 1)->count();
            $totalOut = $logs->where('check_type', 2)->count();

            $events = $logs->map(function (AttendanceLog $l) use ($eventTitleColumn) {
                return $l->event?->getAttribute($eventTitleColumn);
            })->filter()->unique()->values();

            return [
                'user' => [
                    'id' => $user?->id,
                    'name' => $user?->name,
                    'username' => $user?->username,
                    'role' => $user?->getRoleNames()->first(),
                ],
                'total_in' => $totalIn,
                'total_out' => $totalOut,
                'days_present' => $presentDays->count(),
                'events' => $events,
            ];
        })->values();

        // Calculate summary statistics by role
        $summaryByRole = [
            'all' => [
                'total_users' => $grouped->count(),
                'total_in' => $grouped->sum('total_in'),
                'total_out' => $grouped->sum('total_out'),
                'total_days_present' => $grouped->sum('days_present'),
            ],
            'student' => [
                'total_users' => 0,
                'total_in' => 0,
                'total_out' => 0,
                'total_days_present' => 0,
            ],
            'faculty' => [
                'total_users' => 0,
                'total_in' => 0,
                'total_out' => 0,
                'total_days_present' => 0,
            ],
            'staff' => [
                'total_users' => 0,
                'total_in' => 0,
                'total_out' => 0,
                'total_days_present' => 0,
            ],
        ];

        foreach ($grouped as $row) {
            $userRole = $row['user']['role'];
            if (in_array($userRole, ['student', 'faculty', 'staff'])) {
                $summaryByRole[$userRole]['total_users']++;
                $summaryByRole[$userRole]['total_in'] += $row['total_in'];
                $summaryByRole[$userRole]['total_out'] += $row['total_out'];
                $summaryByRole[$userRole]['total_days_present'] += $row['days_present'];
            }
        }

        // Pagination
        $perPage = 10;
        $page = (int) $request->input('page', 1);
        $total = $grouped->count();
        $paged = $grouped->slice(($page - 1) * $perPage, $perPage)->values();

        $paginator = new LengthAwarePaginator(
            $paged,
            $total,
            $perPage,
            $page,
            [
                'path' => url()->current(),
                'pageName' => 'page',
            ]
        );
        $paginator->appends($request->query());

        return Inertia::render('Reports/AttendanceCount', [
            'report' => $paginator,
            'events' => $events,
            'courses' => $courses,
            'filters' => $request->only(['search', 'event_id', 'start_date', 'end_date', 'role', 'course_id']),
            'range' => [
                'start' => $start->toDateString(),
                'end' => $end->toDateString(),
            ],
            'summary' => $summaryByRole,
        ]);
    }
}
