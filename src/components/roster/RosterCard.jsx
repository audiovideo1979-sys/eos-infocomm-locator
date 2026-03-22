import { timeAgo } from '../../utils/time';

export default function RosterCard({ member, isCurrentUser, onClick, onPing }) {
  const handlePing = (e) => {
    e.stopPropagation();
    if (onPing) onPing(member);
  };

  const staleMinutes = (Date.now() - member.lastUpdate) / 60000;
  const isStale = staleMinutes > 10;

  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-3 mb-1.5 flex items-center gap-2.5 cursor-pointer transition-colors border
        ${isCurrentUser
          ? 'bg-teal/5 border-teal/15 hover:border-teal/30'
          : 'bg-bg-card border-border hover:border-border-light'}`}
    >
      <div className="relative shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
            ${isStale ? 'opacity-50' : ''}`}
          style={{ background: member.color }}
        >{member.avatar}</div>
        {isStale && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-bg-card flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-text-ghost" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`text-[13px] font-semibold ${isStale ? 'text-text-dim' : 'text-text'}`}>{member.name}</span>
          {isCurrentUser && (
            <span className="text-[8px] text-teal bg-teal/10 px-1.5 py-px rounded">YOU</span>
          )}
        </div>
        <div className="text-[11px] text-text-muted mt-0.5 truncate">
          {'\u{1F4CD}'} {member.zone} · {member.status}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!isCurrentUser && onPing && (
          <button
            onClick={handlePing}
            className="px-2 py-1 text-[10px] rounded-md bg-coral/10 border border-coral/25 text-coral
              cursor-pointer font-mono hover:bg-coral/20 transition-colors"
            title={`Ping ${member.name}`}
          >{'\u{1F4E1}'}</button>
        )}
        <div className="text-[9px] text-text-faint">
          {timeAgo(member.lastUpdate)}
        </div>
      </div>
    </div>
  );
}
