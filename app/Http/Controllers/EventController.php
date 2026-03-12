<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $events = Event::query()
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            })
            ->orderByDesc('start_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('events/index', [
            'eventList' => $events->through(fn(Event $event) => [
                'id' => $event->id,
                'title' => $event->title,
                'location' => $event->location,
                'description' => $event->description,
                'start_at' => $event->start_at
                    ? Carbon::parse($event->start_at)->format('Y-m-d\TH:i')
                    : null,
                'end_at' => $event->end_at
                    ? Carbon::parse($event->end_at)->format('Y-m-d\TH:i')
                    : null,
                'created_by' => $event->created_by,
            ]),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_at' => ['required', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at'],
        ]);

        Event::create([
            ...$validated,
            'created_by' => $request->user()?->id,
            'start_at' => Carbon::parse($validated['start_at'])->toDateTimeString(),
            'end_at' => $validated['end_at']
                ? Carbon::parse($validated['end_at'])->toDateTimeString()
                : null,
        ]);

        return redirect()->back()->with('success', 'Event created successfully');
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_at' => ['required', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at'],
        ]);

        $event->update([
            ...$validated,
            'start_at' => Carbon::parse($validated['start_at'])->toDateTimeString(),
            'end_at' => $validated['end_at']
                ? Carbon::parse($validated['end_at'])->toDateTimeString()
                : null,
        ]);

        return redirect()->back()->with('success', 'Event updated successfully');
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->route('events.index')->with('success', 'Event deleted successfully');
    }
}
