import useLocationStore from '../store/useLocationStore';

const tabs = [
  { id: 'map', label: 'MAP' },
  { id: 'roster', label: 'TEAM' },
  { id: 'search', label: 'SEARCH' },
  { id: 'schedule', label: 'SCHED' },
];

export default function Header() {
  const view = useLocationStore((s) => s.view);
  const setView = useLocationStore((s) => s.setView);

  return (
    <div className="shrink-0 border-b border-border px-4 py-3 flex items-center justify-between"
      style={{ background: 'linear-gradient(135deg, #0f0f18 0%, #141422 100%)' }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold"
          style={{ background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)' }}>
          📡
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-bold tracking-wide text-white">EOS TEAM LOCATOR</div>
          <div className="text-[10px] text-text-dim tracking-widest">INFOCOMM 2026 · LVCC · JUNE 17-19</div>
        </div>
      </div>
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`px-2.5 py-1.5 text-[11px] rounded-md border font-mono cursor-pointer transition-colors
              ${view === tab.id
                ? 'bg-border-light border-border-light text-teal'
                : 'bg-transparent border-border-light text-text-dim hover:text-text-muted'}`}
          >{tab.label}</button>
        ))}
      </div>
    </div>
  );
}
