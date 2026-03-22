import { useState } from 'react';
import { DEFAULT_SCHEDULE, EVENT_TYPES, SHOW_DAYS } from '../../data/schedule';
import EventCard from './EventCard';
import AddEventForm from './AddEventForm';

export default function ScheduleView() {
  const [activeDay, setActiveDay] = useState(SHOW_DAYS[0].date);
  const [events, setEvents] = useState(DEFAULT_SCHEDULE);
  const [showAddForm, setShowAddForm] = useState(false);

  const dayEvents = events
    .filter((e) => e.day === activeDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleAddEvent = (event) => {
    setEvents((prev) => [...prev, { ...event, id: `custom-${Date.now()}`, day: activeDay, members: [] }]);
    setShowAddForm(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Day tabs */}
      <div className="px-3 pt-3 pb-2 flex gap-2 shrink-0">
        {SHOW_DAYS.map((day) => (
          <button
            key={day.date}
            onClick={() => setActiveDay(day.date)}
            className={`flex-1 py-2 rounded-lg text-center font-mono cursor-pointer transition-colors border
              ${activeDay === day.date
                ? 'bg-teal/15 border-teal text-teal'
                : 'bg-bg-card border-border text-text-dim hover:text-text-muted'}`}
          >
            <div className="text-[11px] font-bold">{day.label}</div>
            <div className="text-[9px] mt-0.5 opacity-70">{day.dayName}</div>
          </button>
        ))}
      </div>

      {/* Add event button */}
      <div className="px-3 pb-2 flex justify-between items-center shrink-0">
        <div className="text-[10px] text-text-dim">
          {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-teal/10 border border-teal/25 rounded-md text-teal px-2.5 py-1
            text-[11px] cursor-pointer font-mono hover:bg-teal/20 transition-colors"
        >{showAddForm ? 'Cancel' : '+ ADD EVENT'}</button>
      </div>

      {showAddForm && (
        <div className="px-3 pb-2 shrink-0">
          <AddEventForm onAdd={handleAddEvent} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {/* Event list */}
      <div className="flex-1 overflow-auto px-3 pb-3">
        {dayEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDelete={event.id.startsWith('custom-') ? () => handleDeleteEvent(event.id) : null}
          />
        ))}
        {dayEvents.length === 0 && (
          <div className="text-center text-text-dim text-sm mt-8">
            No events scheduled for this day
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-3 py-2 border-t border-border flex gap-3 flex-wrap shrink-0">
        {Object.entries(EVENT_TYPES).map(([key, type]) => (
          <div key={key} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: type.color }} />
            <span className="text-[9px] text-text-dim">{type.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
