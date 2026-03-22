import { useState } from 'react';
import useLocationStore from '../store/useLocationStore';

export default function StatusBar() {
  const [statusInput, setStatusInput] = useState('');
  const gpsActive = useLocationStore((s) => s.gpsActive);
  const showCheckin = useLocationStore((s) => s.showCheckin);
  const filterZone = useLocationStore((s) => s.filterZone);
  const toggleGps = useLocationStore((s) => s.toggleGps);
  const toggleCheckin = useLocationStore((s) => s.toggleCheckin);
  const updateStatus = useLocationStore((s) => s.updateStatus);
  const setFilterZone = useLocationStore((s) => s.setFilterZone);

  const handleStatusUpdate = () => {
    if (!statusInput.trim()) return;
    updateStatus(statusInput.trim());
    setStatusInput('');
  };

  return (
    <div className="shrink-0 bg-bg-bar border-b border-border px-4 py-2 flex items-center gap-2 flex-wrap">
      <button
        onClick={toggleGps}
        className={`px-2.5 py-1 text-[11px] rounded-md border font-mono cursor-pointer flex items-center gap-1 transition-colors
          ${gpsActive
            ? 'bg-teal/15 border-teal text-teal'
            : 'bg-white/5 border-border-light text-text-muted'}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full inline-block
          ${gpsActive ? 'bg-teal shadow-[0_0_8px_#4ECDC4]' : 'bg-text-ghost'}`} />
        GPS {gpsActive ? 'ON' : 'OFF'}
      </button>

      <button
        onClick={toggleCheckin}
        className={`px-2.5 py-1 text-[11px] rounded-md border font-mono cursor-pointer transition-colors
          ${showCheckin
            ? 'bg-coral/15 border-coral text-coral'
            : 'bg-white/5 border-border-light text-text-muted'}`}
      >
        {showCheckin ? 'TAP A ZONE \u25BC' : '\u{1F4CD} CHECK IN'}
      </button>

      <div className="flex-1 flex gap-1.5 min-w-[200px]">
        <input
          value={statusInput}
          onChange={(e) => setStatusInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStatusUpdate()}
          placeholder="Update your status..."
          className="flex-1 bg-white/5 border border-border-light rounded-md text-text-muted
            px-2.5 py-1 text-[11px] font-mono outline-none focus:border-teal transition-colors
            placeholder:text-text-ghost"
        />
        <button
          onClick={handleStatusUpdate}
          className="bg-border-light border-none rounded-md text-teal px-2.5 py-1 text-[11px] cursor-pointer font-mono"
        >{'\u21B5'}</button>
      </div>

      {filterZone && (
        <button
          onClick={() => setFilterZone(null)}
          className="bg-coral/10 border border-coral/25 rounded-md text-coral px-2.5 py-1 text-[10px] cursor-pointer font-mono"
        >{'\u2715'} {filterZone}</button>
      )}
    </div>
  );
}
