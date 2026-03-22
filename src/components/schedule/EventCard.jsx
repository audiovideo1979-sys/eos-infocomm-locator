import { EVENT_TYPES } from '../../data/schedule';

export default function EventCard({ event, onDelete }) {
  const type = EVENT_TYPES[event.type] || EVENT_TYPES.session;

  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 mb-1.5 flex gap-3">
      {/* Time column */}
      <div className="shrink-0 w-14 text-right">
        <div className="text-[13px] font-bold text-white">{event.time}</div>
        <div className="text-[9px] text-text-dim mt-0.5">{event.endTime}</div>
      </div>

      {/* Color bar */}
      <div className="w-0.5 rounded-full shrink-0" style={{ background: type.color }} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-text truncate">{event.title}</div>
        <div className="text-[11px] text-text-muted mt-0.5">
          {'\u{1F4CD}'} {event.location}
        </div>
        <div className="mt-1">
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono"
            style={{ background: type.color + '20', color: type.color }}>
            {type.label}
          </span>
        </div>
      </div>

      {/* Delete (custom events only) */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-text-ghost hover:text-coral text-sm cursor-pointer shrink-0 self-start"
          title="Remove event"
        >{'\u2715'}</button>
      )}
    </div>
  );
}
