import { useState } from 'react';
import { EVENT_TYPES } from '../../data/schedule';

export default function AddEventForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('booth');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), time, endTime, location: location.trim() || 'TBD', type });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-bg-card border border-border-light rounded-lg p-3 space-y-2.5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event title..."
        autoFocus
        className="w-full bg-white/5 border border-border-light rounded-md text-white
          px-2.5 py-1.5 text-xs font-mono outline-none focus:border-teal placeholder:text-text-ghost"
      />
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[9px] text-text-dim block mb-0.5">START</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="w-full bg-white/5 border border-border-light rounded-md text-white
              px-2 py-1 text-xs font-mono outline-none focus:border-teal" />
        </div>
        <div className="flex-1">
          <label className="text-[9px] text-text-dim block mb-0.5">END</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
            className="w-full bg-white/5 border border-border-light rounded-md text-white
              px-2 py-1 text-xs font-mono outline-none focus:border-teal" />
        </div>
      </div>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location (room or booth)..."
        className="w-full bg-white/5 border border-border-light rounded-md text-white
          px-2.5 py-1.5 text-xs font-mono outline-none focus:border-teal placeholder:text-text-ghost"
      />
      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(EVENT_TYPES).map(([key, t]) => (
          <button
            key={key}
            type="button"
            onClick={() => setType(key)}
            className={`px-2 py-0.5 text-[10px] rounded-full font-mono cursor-pointer transition-colors border
              ${type === key
                ? 'border-current'
                : 'border-transparent opacity-50 hover:opacity-75'}`}
            style={{ color: t.color }}
          >{t.label}</button>
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={!title.trim()}
          className="bg-teal text-bg font-bold py-1.5 px-4 rounded-md text-[11px]
            hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
          ADD
        </button>
        <button type="button" onClick={onCancel}
          className="bg-transparent border border-border-light text-text-dim py-1.5 px-4
            rounded-md text-[11px] cursor-pointer hover:text-white">
          Cancel
        </button>
      </div>
    </form>
  );
}
