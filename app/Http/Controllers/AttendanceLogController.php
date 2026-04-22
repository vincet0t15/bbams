<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\Course;
use App\Models\Event;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AttendanceLogController extends Controller
{
    protected function buildDtrPayload(User $user, ?int $eventId, CarbonInterface $start, CarbonInterface $end): array
    {
        $logs = AttendanceLog::query()
            ->where('user_id', $user->id)
            ->when($eventId, fn($q) => $q->where('event_id', $eventId))
            ->whereBetween('date_time', [$start, $end])
            ->orderBy('date_time')
            ->get();

        $grouped = $logs->groupBy(fn(AttendanceLog $l) => Carbon::parse($l->date_time)->toDateString());

        $records = [];
        $totalIn = 0;
        $totalOut = 0;

        foreach ($grouped as $day => $dayLogs) {
            $amIn = null;
            $amOut = null;
            $pmIn = null;
            $pmOut = null;

            $entries = [];

            foreach ($dayLogs as $l) {
                $dt = Carbon::parse($l->date_time);
                $type = (int) $l->check_type === 0 ? 'in' : 'out';
                $entries[] = [
                    'datetime' => $dt->toDateTimeString(),
                    'type' => $type,
                ];
                if ($type === 'in') {
                    $totalIn++;
                } elseif ($type === 'out') {
                    $totalOut++;
                }

                if ($dt->hour < 12) {
                    if ($type === 'in') {
                        $amIn = $amIn ? min($amIn, $dt) : $dt;
                    } else {
                        $amOut = $amOut ? max($amOut, $dt) : $dt;
                    }
                } else {
                    if ($type === 'in') {
                        $pmIn = $pmIn ? min($pmIn, $dt) : $dt;
                    } else {
                        $pmOut = $pmOut ? max($pmOut, $dt) : $dt;
                    }
                }
            }

            $records[] = [
                'date' => $day,
                'am_in' => $amIn?->format('H:i'),
                'am_out' => $amOut?->format('H:i'),
                'pm_in' => $pmIn?->format('H:i'),
                'pm_out' => $pmOut?->format('H:i'),
                'late_minutes' => 0,
                'logs' => $entries,
                'hasUnmatched' => false,
            ];
        }

        $prevStart = $start->copy()->subMonth()->startOfMonth();
        $prevEnd = $prevStart->copy()->endOfMonth();
        $prevLogs = AttendanceLog::query()
            ->where('user_id', $user->id)
            ->when($eventId, fn($q) => $q->where('event_id', $eventId))
            ->whereBetween('date_time', [$prevStart, $prevEnd])
            ->orderBy('date_time')
            ->get()
            ->map(function (AttendanceLog $l) {
                return [
                    'datetime' => Carbon::parse($l->date_time)->toDateTimeString(),
                    'type' => (int) $l->check_type === 0 ? 'in' : 'out',
                ];
            });

        return [
            'student_id' => $user->id,
            'student_name' => $user->name,
            'records' => $records,
            'forTheMonthOf' => $start->format('F Y'),
            'totalOut' => $totalOut,
            'totalIn' => $totalIn,
            'previousLogs' => $prevLogs,
            'PrevForTheMonth' => $prevStart->format('F Y'),
            'PrevTotalIn' => $prevLogs->where('type', 'in')->count(),
            'PreveTotalOut' => $prevLogs->where('type', 'out')->count(),
        ];
    }

    public function index(Request $request)
    {
        // If user is not admin, show only their own logs
        $user = Auth::user();
        if ($user && $user->account_type !== 'admin') {
            return $this->myLogs($request);
        }

        $search = $request->input('search');
        $eventId = $request->input('event_id');
        $date = $request->input('date');
        $role = $request->input('role');
        $courseId = $request->input('course_id');

        $logs = AttendanceLog::query()
            ->with(['user', 'event'])
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            })
            ->when($role && $role !== 'all', function ($query) use ($role) {
                // Allow filtering by account_type (primary) or role name (fallback)
                $query->whereHas('user', function ($q) use ($role) {
                    $q->where('account_type', $role)
                        ->orWhereHas('roles', fn($rq) => $rq->where('name', $role));
                });
            })
            ->when(
                $role === 'student' && $courseId && $courseId !== 'all',
                fn($query) => $query->whereHas('user.student', fn($q) => $q->where('course_id', $courseId)),
            )
            ->when($eventId, fn($q) => $q->where('event_id', $eventId))
            ->when($date, fn($q) => $q->whereDate('date_time', $date))
            ->orderByDesc('date_time')
            ->paginate(50)
            ->withQueryString();

        $eventTitleColumn = Schema::hasColumn('events', 'title') ? 'title' : 'name';
        $eventStartColumn = Schema::hasColumn('events', 'start_at') ? 'start_at' : 'date_from';

        $events = Event::query()
            ->orderByDesc($eventStartColumn)
            ->get(['id', $eventTitleColumn])
            ->map(fn(Event $event) => [
                'id' => $event->id,
                'title' => $event->getAttribute($eventTitleColumn),
            ]);

        $courses = Course::query()
            ->orderBy('name')
            ->get(['id', 'name', 'code'])
            ->map(fn(Course $course) => [
                'id' => $course->id,
                'name' => $course->name,
                'code' => $course->code,
            ]);

        return Inertia::render('AttendanceLogs/Index', [
            'logList' => $logs->through(function (AttendanceLog $log) use ($eventTitleColumn) {
                return [
                    'id' => $log->id,
                    'date_time' => $log->date_time
                        ? Carbon::parse($log->date_time)->format('Y-m-d H:i:s')
                        : null,
                    'check_type' => $log->check_type,
                    'check_type_label' => match ((int) $log->check_type) {
                        0 => 'Time In',
                        1 => 'Time Out',
                        default => '-',
                    },
                    'user' => [
                        'id' => $log->user?->id,
                        'name' => $log->user?->name,
                        'email' => $log->user?->email,
                        'username' => $log->user?->username,
                        'role' => $log->user
                            ? ($log->user->getRoleNames()->first() ?? null)
                            : null,
                    ],
                    'event' => [
                        'id' => $log->event?->id,
                        'title' => $log->event?->getAttribute($eventTitleColumn),
                    ],
                ];
            }),
            'events' => $events,
            'courses' => $courses,
            'filters' => $request->only(['search', 'event_id', 'date', 'role', 'course_id']),
        ]);
    }

    public function myLogs(Request $request)
    {
        $user = Auth::user();

        $logs = AttendanceLog::query()
            ->with(['event'])
            ->where('user_id', $user->id)
            ->when($request->input('event_id'), fn($q) => $q->where('event_id', $request->input('event_id')))
            ->when($request->input('date'), fn($q) => $q->whereDate('date_time', $request->input('date')))
            ->orderByDesc('date_time')
            ->paginate(50)
            ->withQueryString();

        $eventTitleColumn = Schema::hasColumn('events', 'title') ? 'title' : 'name';
        $eventStartColumn = Schema::hasColumn('events', 'start_at') ? 'start_at' : 'date_from';

        $events = Event::query()
            ->orderByDesc($eventStartColumn)
            ->get(['id', $eventTitleColumn])
            ->map(fn(Event $event) => [
                'id' => $event->id,
                'title' => $event->getAttribute($eventTitleColumn),
            ]);

        return Inertia::render('AttendanceLogs/MyLogs', [
            'logList' => $logs->through(function (AttendanceLog $log) use ($eventTitleColumn) {
                return [
                    'id' => $log->id,
                    'date_time' => $log->date_time
                        ? Carbon::parse($log->date_time)->format('Y-m-d H:i:s')
                        : null,
                    'check_type' => $log->check_type,
                    'check_type_label' => match ((int) $log->check_type) {
                        0 => 'Time In',
                        1 => 'Time Out',
                        default => '-',
                    },
                    'event' => [
                        'id' => $log->event?->id,
                        'title' => $log->event?->getAttribute($eventTitleColumn),
                    ],
                ];
            }),
            'events' => $events,
            'filters' => $request->only(['event_id', 'date']),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'account_type' => $user->account_type,
            ],
        ]);
    }

    public function myDtr(Request $request)
    {
        $user = Auth::user();
        $eventId = $request->input('event_id');

        $start = $request->input('month')
            ? Carbon::createFromFormat('Y-m', $request->input('month'))->startOfMonth()
            : now()->startOfMonth();
        $end = $start->copy()->endOfMonth();

        $dtrPayload = $this->buildDtrPayload($user, $eventId, $start, $end);

        $eventTitleColumn = Schema::hasColumn('events', 'title') ? 'title' : 'name';
        $eventStartColumn = Schema::hasColumn('events', 'start_at') ? 'start_at' : 'date_from';

        $events = Event::query()
            ->orderByDesc($eventStartColumn)
            ->get(['id', $eventTitleColumn])
            ->map(fn(Event $event) => [
                'id' => $event->id,
                'title' => $event->getAttribute($eventTitleColumn),
            ]);

        return Inertia::render('DTR/MyDTR', [
            'dtr' => $dtrPayload,
            'events' => $events,
            'filters' => $request->only(['event_id', 'month']),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'account_type' => $user->account_type,
            ],
        ]);
    }

    public function printDtr(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'event_id' => ['nullable', 'exists:events,id'],
            'month' => ['nullable', 'regex:/^\d{4}-\d{2}$/'],
            'date' => ['nullable', 'date'],
        ]);

        $user = User::findOrFail($validated['user_id']);
        $eventId = $validated['event_id'] ?? null;

        $start = isset($validated['month'])
            ? Carbon::createFromFormat('Y-m', $validated['month'])->startOfMonth()
            : (isset($validated['date'])
                ? Carbon::parse($validated['date'])->startOfMonth()
                : now()->startOfMonth());
        $end = $start->copy()->endOfMonth();

        $dtrPayload = $this->buildDtrPayload($user, $eventId, $start, $end);

        return Inertia::render('DTR/index', [
            'dtr' => [$dtrPayload],
        ]);
    }

    public function printDtrBatch(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => ['required', 'array'],
            'user_ids.*' => ['integer', 'exists:users,id'],
            'event_id' => ['nullable', 'exists:events,id'],
            'month' => ['nullable', 'regex:/^\d{4}-\d{2}$/'],
            'date' => ['nullable', 'date'],
        ]);

        $eventId = $validated['event_id'] ?? null;
        $start = isset($validated['month'])
            ? Carbon::createFromFormat('Y-m', $validated['month'])->startOfMonth()
            : (isset($validated['date'])
                ? Carbon::parse($validated['date'])->startOfMonth()
                : now()->startOfMonth());
        $end = $start->copy()->endOfMonth();

        $users = User::whereIn('id', $validated['user_ids'])->get();
        $dtr = [];
        foreach ($users as $user) {
            $dtr[] = $this->buildDtrPayload($user, $eventId, $start, $end);
        }

        return Inertia::render('DTR/index', [
            'dtr' => $dtr,
        ]);
    }

    public function dtr(Request $request)
    {
        $search = $request->input('search');
        $role = $request->input('role');
        $month = $request->input('month');
        $eventId = $request->input('event_id');

        // compute month range if provided
        $start = $month ? Carbon::createFromFormat('Y-m', $month)->startOfMonth() : null;
        $end = $start ? $start->copy()->endOfMonth() : null;

        $users = User::query()
            ->with('roles')
            ->whereDoesntHave('roles', fn($q) => $q->where('name', 'super_admin'))
            // If a specific role filter is provided, match by account_type first,
            // falling back to Spatie role name when needed.
            ->when($role && $role !== 'all', fn($q) => $q->where(function ($sq) use ($role) {
                $sq->where('account_type', $role)
                    ->orWhereHas('roles', fn($rq) => $rq->where('name', $role));
            }))
            // If no specific role (or role=all), include users who are student/faculty/staff
            ->when(! $role || $role === 'all', fn($q) => $q->where(function ($sq) {
                $sq->whereIn('account_type', ['student', 'faculty', 'staff'])
                    ->orWhereHas('student', fn($r) => $r->whereNull('deleted_at'))
                    ->orWhereHas('faculty', fn($r) => $r->whereNull('deleted_at'))
                    ->orWhereHas('staff', fn($r) => $r->whereNull('deleted_at'));
            }))
            // If month (and optionally event) provided, restrict to users who have attendance logs in that range
            ->when($start && $end, fn($q) => $q->whereHas('attendanceLogs', function ($alq) use ($start, $end, $eventId) {
                $alq->whereBetween('date_time', [$start, $end]);
                if ($eventId) {
                    $alq->where('event_id', $eventId);
                }
            }))
            ->when($search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(50)
            ->withQueryString();

        $eventTitleColumn = Schema::hasColumn('events', 'title') ? 'title' : 'name';
        $eventStartColumn = Schema::hasColumn('events', 'start_at') ? 'start_at' : 'date_from';
        $events = Event::query()
            ->orderByDesc($eventStartColumn)
            ->get(['id', $eventTitleColumn])
            ->map(fn(Event $event) => [
                'id' => $event->id,
                'title' => $event->getAttribute($eventTitleColumn),
            ]);

        $defaultMonth = $request->input('month') ?? now()->format('Y-m');

        return Inertia::render('DTR/Select', [
            'userList' => $users->through(function (User $u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'username' => $u->username,
                    'role' => $u->getRoleNames()->first() ?? null,
                ];
            }),
            'events' => $events,
            'filters' => $request->only(['search', 'role', 'event_id', 'month']),
            'defaultMonth' => $defaultMonth,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'event_id' => ['required', 'exists:events,id'],
            'date_time' => ['nullable', 'date'],
            'check_type' => ['required', 'integer', 'in:0,1'],
        ]);

        $dateTime = Carbon::parse($validated['date_time'] ?? now());

        $alreadyLogged = AttendanceLog::query()
            ->where('user_id', $validated['user_id'])
            ->where('event_id', $validated['event_id'])
            ->where('check_type', $validated['check_type'])
            ->whereBetween('date_time', [
                $dateTime->copy()->startOfDay(),
                $dateTime->copy()->endOfDay(),
            ])
            ->exists();

        if ($alreadyLogged) {
            return back()->withErrors([
                'date_time' => 'Already logged for this user today.',
            ]);
        }

        AttendanceLog::create([
            'user_id' => $validated['user_id'],
            'event_id' => $validated['event_id'],
            'date_time' => $dateTime,
            'check_type' => $validated['check_type'],
        ]);

        return back()->with('success', 'Attendance log saved.');
    }
}
