import useLocationStore from '../store/useLocationStore';

export default function Footer() {
  const currentUser = useLocationStore((s) => s.currentUser);
  const gpsActive = useLocationStore((s) => s.gpsActive);
  const gpsPosition = useLocationStore((s) => s.gpsPosition);
  const isFirebaseConnected = useLocationStore((s) => s.isFirebaseConnected);
  const members = useLocationStore((s) => s.members);

  const userMember = members.find((m) => m.id === currentUser?.id);
  const zone = userMember?.zone || '---';

  const modeText = gpsActive
    ? `GPS${gpsPosition ? ` ±${Math.round(gpsPosition.accuracy)}m` : ''}`
    : 'Manual';

  return (
    <div className="shrink-0 bg-bg-bar border-t border-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${gpsActive
          ? 'bg-teal shadow-[0_0_6px_#4ECDC4]'
          : 'bg-coral shadow-[0_0_6px_#FF6B6B]'}`} />
        <span className="text-[10px] text-text-dim">
          {currentUser?.name || 'Unknown'} · {zone} · {modeText}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {isFirebaseConnected && (
          <span className="text-[9px] text-teal">LIVE</span>
        )}
        <span className="text-[9px] text-text-ghost">
          EOS IT Solutions · InfoComm 2026
        </span>
      </div>
    </div>
  );
}
