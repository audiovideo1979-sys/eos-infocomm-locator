import { useState } from 'react';
import useLocationStore from '../../store/useLocationStore';

export default function AddMemberForm() {
  const [name, setName] = useState('');
  const addMember = useLocationStore((s) => s.addMember);
  const toggleAddMember = useLocationStore((s) => s.toggleAddMember);

  const handleAdd = () => {
    if (!name.trim()) return;
    addMember(name.trim());
    setName('');
  };

  return (
    <div className="bg-bg-card border border-border-light rounded-lg p-3 mb-3 flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="Name..."
        autoFocus
        className="flex-1 bg-white/5 border border-border-light rounded-md text-text-muted px-2.5 py-1.5
          text-xs font-mono outline-none focus:border-teal transition-colors placeholder:text-text-ghost"
      />
      <button
        onClick={handleAdd}
        className="bg-teal border-none rounded-md text-bg px-3.5 py-1.5 text-[11px] cursor-pointer font-mono font-bold"
      >ADD</button>
      <button
        onClick={toggleAddMember}
        className="bg-transparent border border-border-light rounded-md text-text-dim px-2.5 py-1.5
          text-[11px] cursor-pointer font-mono hover:text-white"
      >{'\u2715'}</button>
    </div>
  );
}
