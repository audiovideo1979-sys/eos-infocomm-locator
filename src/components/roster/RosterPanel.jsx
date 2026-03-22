import { useState } from 'react';
import useLocationStore from '../../store/useLocationStore';
import { sendPing, sendBroadcast } from '../../hooks/useNotifications';
import RosterCard from './RosterCard';
import AddMemberForm from './AddMemberForm';

export default function RosterPanel() {
  const members = useLocationStore((s) => s.members);
  const currentUser = useLocationStore((s) => s.currentUser);
  const teamCode = useLocationStore((s) => s.teamCode);
  const isFirebaseConnected = useLocationStore((s) => s.isFirebaseConnected);
  const filterZone = useLocationStore((s) => s.filterZone);
  const showAddMember = useLocationStore((s) => s.showAddMember);
  const toggleAddMember = useLocationStore((s) => s.toggleAddMember);
  const selectMember = useLocationStore((s) => s.selectMember);
  const setView = useLocationStore((s) => s.setView);

  const [broadcastText, setBroadcastText] = useState('');
  const [showBroadcast, setShowBroadcast] = useState(false);

  const filtered = filterZone ? members.filter((m) => m.zone === filterZone) : members;
  const sorted = [...filtered].sort((a, b) => b.lastUpdate - a.lastUpdate);

  const handleCardClick = (member) => {
    selectMember(member.id);
    setView('map');
  };

  const handlePing = (member) => {
    if (isFirebaseConnected && teamCode && currentUser) {
      sendPing(teamCode, currentUser.name, member.name);
    }
  };

  const handleBroadcast = () => {
    if (!broadcastText.trim() || !isFirebaseConnected || !teamCode || !currentUser) return;
    sendBroadcast(teamCode, currentUser.name, broadcastText.trim());
    setBroadcastText('');
    setShowBroadcast(false);
  };

  return (
    <div className="flex-1 overflow-auto p-3">
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs text-text-dim">{members.length} TEAM MEMBERS</div>
        <div className="flex gap-1.5">
          {isFirebaseConnected && (
            <button
              onClick={() => setShowBroadcast(!showBroadcast)}
              className="bg-coral/10 border border-coral/25 rounded-md text-coral px-2.5 py-1 text-[11px] cursor-pointer font-mono hover:bg-coral/20 transition-colors"
            >{'\u{1F4E2}'} BROADCAST</button>
          )}
          <button
            onClick={toggleAddMember}
            className="bg-teal/10 border border-teal/25 rounded-md text-teal px-2.5 py-1 text-[11px] cursor-pointer font-mono hover:bg-teal/20 transition-colors"
          >+ ADD</button>
        </div>
      </div>

      {showBroadcast && (
        <div className="bg-bg-card border border-coral/25 rounded-lg p-3 mb-3 flex gap-2">
          <input
            value={broadcastText}
            onChange={(e) => setBroadcastText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
            placeholder="Message to entire team..."
            autoFocus
            className="flex-1 bg-white/5 border border-border-light rounded-md text-white px-2.5 py-1.5
              text-xs font-mono outline-none focus:border-coral transition-colors placeholder:text-text-ghost"
          />
          <button
            onClick={handleBroadcast}
            disabled={!broadcastText.trim()}
            className="bg-coral text-bg font-bold px-3.5 py-1.5 rounded-md text-[11px] cursor-pointer
              disabled:opacity-30 disabled:cursor-not-allowed"
          >SEND</button>
          <button
            onClick={() => setShowBroadcast(false)}
            className="text-text-dim hover:text-white text-sm cursor-pointer px-1"
          >{'\u2715'}</button>
        </div>
      )}

      {showAddMember && <AddMemberForm />}

      {sorted.map((member) => (
        <RosterCard
          key={member.id}
          member={member}
          isCurrentUser={member.id === currentUser?.id}
          onClick={() => handleCardClick(member)}
          onPing={isFirebaseConnected ? handlePing : null}
        />
      ))}
    </div>
  );
}
