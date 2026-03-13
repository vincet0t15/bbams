<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AttendanceLogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $eventId = $request->input('event_id');
        $date = $request->input('date');
        $role = $request->input('role');

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
                $query->whereHas('user.roles', fn ($q) => $q->where('name', $role));
            })
            ->when($eventId, fn ($q) => $q->where('event_id', $eventId))
            ->when($date, fn ($q) => $q->whereDate('date_time', $date))
            ->orderByDesc('date_time')
            ->paginate(10)
            ->withQueryString();

        $eventTitleColumn = Schema::hasColumn('events', 'title') ? 'title' : 'name';
        $eventStartColumn = Schema::hasColumn('events', 'start_at') ? 'start_at' : 'date_from';

        $events = Event::query()
            ->orderByDesc($eventStartColumn)
            ->get(['id', $eventTitleColumn])
            ->map(fn (Event $event) => [
                'id' => $event->id,
                'title' => $event->getAttribute($eventTitleColumn),
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
                        1 => 'Time In',
                        2 => 'Time Out',
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
            'filters' => $request->only(['search', 'event_id', 'date', 'role']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'event_id' => ['required', 'exists:events,id'],
            'date_time' => ['nullable', 'date'],
            'check_type' => ['required', 'integer', 'in:1,2'],
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
