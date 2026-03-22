import { timeAgo } from '../../utils/time';

export default function MemberPopup({ member, isCurrentUser, onClose }) {
  if (!member) return null;

  return (
    <div className="absolute bottom-3 left-3 right-20 bg-bg-bar/95 border border-border-light rounded-xl p-3.5 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
          style={{ background: member.color }}
        >{member.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white">
            {member.name}
            {isCurrentUser && (
              <span className="text-[9px] text-teal ml-1.5">YOU</span>
            )}
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">
            {'\u{1F4CD}'} {member.zone} · {member.status}
          </div>
          <div className="text-[9px] text-text-faint mt-0.5">
            Updated {timeAgo(member.lastUpdate)}
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-text-faint text-lg cursor-pointer p-1 hover:text-white"
        >{'\u2715'}</button>
      </div>
    </div>
  );
}
