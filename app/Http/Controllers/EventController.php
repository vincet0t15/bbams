<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $events = Event::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            })
            ->orderByDesc('date_from')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('events/index', [
            'eventList' => $events->through(fn (Event $event) => [
                'id' => $event->id,
                'title' => $event->name,
                'location' => $event->location,
                'description' => $event->description,
                'start_at' => $event->date_from
                    ? Carbon::parse($event->date_from)->format('Y-m-d\TH:i')
                    : null,
                'end_at' => $event->date_to
                    ? Carbon::parse($event->date_to)->format('Y-m-d\TH:i')
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
            'end_at' => ['required', 'date', 'after_or_equal:start_at'],
        ]);

        Event::create([
            'name' => $validated['title'],
            'location' => $validated['location'] ?? null,
            'description' => $validated['description'] ?? null,
            'created_by' => $request->user()?->id,
            'date_from' => Carbon::parse($validated['start_at'])->toDateTimeString(),
            'date_to' => Carbon::parse($validated['end_at'])->toDateTimeString(),
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
            'end_at' => ['required', 'date', 'after_or_equal:start_at'],
        ]);

        $event->update([
            'name' => $validated['title'],
            'location' => $validated['location'] ?? null,
            'description' => $validated['description'] ?? null,
            'date_from' => Carbon::parse($validated['start_at'])->toDateTimeString(),
            'date_to' => Carbon::parse($validated['end_at'])->toDateTimeString(),
        ]);

        return redirect()->back()->with('success', 'Event updated successfully');
    }

    public function destroy(Event $event)
    {
        $event->deleted_by = $event->deleted_by ?? Auth::id();
        $event->save();
        $event->delete();

        return redirect()->route('events.index')->with('success', 'Event deleted successfully');
    }
}
