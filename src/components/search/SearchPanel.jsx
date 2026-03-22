import { useState, useMemo } from 'react';
import { BOOTHS, CATEGORIES } from '../../data/booths';
import useLocationStore from '../../store/useLocationStore';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const checkInToZone = useLocationStore((s) => s.checkInToZone);
  const setView = useLocationStore((s) => s.setView);
  const setFilterZone = useLocationStore((s) => s.setFilterZone);

  const results = useMemo(() => {
    let filtered = BOOTHS;
    if (activeCategory) {
      filtered = filtered.filter((b) => b.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        b.booth.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [query, activeCategory]);

  const handleNavigate = (booth) => {
    setFilterZone(booth.zone);
    setView('map');
  };

  const handleCheckIn = (booth) => {
    checkInToZone(booth.zone);
    setView('map');
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Search bar */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exhibitors, booths, categories..."
          autoFocus
          className="w-full bg-white/5 border border-border-light rounded-lg text-white
            px-3 py-2.5 text-sm font-mono outline-none
            focus:border-teal transition-colors placeholder:text-text-ghost"
        />
      </div>

      {/* Category filters */}
      <div className="px-3 pb-2 flex gap-1.5 flex-wrap shrink-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`px-2 py-0.5 text-[10px] rounded-full font-mono cursor-pointer transition-colors border
              ${activeCategory === cat
                ? 'bg-teal/15 border-teal text-teal'
                : 'bg-transparent border-border-light text-text-dim hover:text-text-muted'}`}
          >{cat}</button>
        ))}
      </div>

      {/* Results count */}
      <div className="px-3 pb-1 text-[10px] text-text-dim shrink-0">
        {results.length} exhibitor{results.length !== 1 ? 's' : ''} found
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-auto px-3 pb-3">
        {results.map((booth) => (
          <div key={booth.id}
            className="bg-bg-card border border-border rounded-lg p-3 mb-1.5 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-text truncate">{booth.name}</div>
              <div className="text-[11px] text-text-muted mt-0.5">
                <span className="text-teal font-semibold">{booth.booth}</span>
                {' · '}{booth.zone}{' · '}
                <span className="text-text-dim">{booth.category}</span>
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => handleNavigate(booth)}
                className="px-2 py-1 text-[10px] rounded-md bg-border-light text-text-muted
                  cursor-pointer font-mono hover:text-white transition-colors"
                title="Show on map"
              >{'\u{1F5FA}'}</button>
              <button
                onClick={() => handleCheckIn(booth)}
                className="px-2 py-1 text-[10px] rounded-md bg-teal/15 border border-teal/30 text-teal
                  cursor-pointer font-mono hover:bg-teal/25 transition-colors"
                title="I'm here"
              >I'm here</button>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="text-center text-text-dim text-sm mt-8">
            No exhibitors match your search
          </div>
        )}
      </div>
    </div>
  );
}
