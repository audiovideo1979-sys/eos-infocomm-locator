import { useState } from 'react';
import useLocationStore from '../store/useLocationStore';
import { joinTeam } from '../firebase/auth';

const isFirebaseConfigured = () => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return key && key !== 'PLACEHOLDER';
};

export default function JoinScreen() {
  const [name, setName] = useState('');
  const [teamCode, setTeamCode] = useState('EOS2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const join = useLocationStore((s) => s.join);
  const joinWithFirebase = useLocationStore((s) => s.joinWithFirebase);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !teamCode.trim()) return;

    const cleanName = name.trim();
    const cleanCode = teamCode.trim().toUpperCase();

    if (isFirebaseConfigured()) {
      // Firebase mode
      setLoading(true);
      setError('');
      try {
        const user = await joinTeam(cleanName, cleanCode);
        joinWithFirebase(user.uid, user.name, cleanCode, user.color, user.avatar);
      } catch (err) {
        console.error('Join failed:', err);
        setError('Failed to join team. Check your connection.');
        setLoading(false);
      }
    } else {
      // Local mode (no Firebase)
      join(cleanName, cleanCode);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-bg">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)' }}>
            📡
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">EOS TEAM LOCATOR</h1>
          <p className="text-xs text-text-dim tracking-widest mt-1">INFOCOMM 2026 · LVCC · JUNE 17-19</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-muted mb-1.5 tracking-wide">YOUR NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              autoFocus
              disabled={loading}
              className="w-full bg-white/5 border border-border-light rounded-lg text-white
                px-3 py-2.5 text-sm font-mono outline-none
                focus:border-teal transition-colors placeholder:text-text-ghost
                disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5 tracking-wide">TEAM CODE</label>
            <input
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="e.g. EOS2026"
              disabled={loading}
              className="w-full bg-white/5 border border-border-light rounded-lg text-white
                px-3 py-2.5 text-sm font-mono outline-none uppercase
                focus:border-teal transition-colors placeholder:text-text-ghost
                disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-coral text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={!name.trim() || !teamCode.trim() || loading}
            className="w-full bg-teal text-bg font-bold py-2.5 rounded-lg text-sm
              hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? 'JOINING...' : 'JOIN TEAM'}
          </button>
        </form>

        <p className="text-center text-[10px] text-text-ghost mt-6">
          {isFirebaseConfigured() ? 'Live sync enabled' : 'Offline mode'} · EOS IT Solutions
        </p>
      </div>
    </div>
  );
}
