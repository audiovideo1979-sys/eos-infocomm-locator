import { useMemo, useState, useEffect } from 'react';
import useLocationStore from '../../store/useLocationStore';
import { getMemberPosition } from '../../utils/mapGeometry';
import usePanZoom from '../../hooks/usePanZoom';
import { HALLS } from '../../data/halls';
import { ZONES } from '../../data/zones';
import MapDefs from './MapDefs';
import HallLayer from './HallLayer';
import ZoneLayer from './ZoneLayer';
import MemberPin from './MemberPin';
import MapControls from './MapControls';
import MemberPopup from './MemberPopup';

// Which hall prefix does this zone belong to?
function hallOfZone(zoneId) {
  if (!zoneId) return null;
  const z = ZONES.find((z) => z.id === zoneId);
  return z ? z.hall : null;
}

export default function MapView({ pulse }) {
  const members = useLocationStore((s) => s.members);
  const currentUser = useLocationStore((s) => s.currentUser);
  const selectedMemberId = useLocationStore((s) => s.selectedMemberId);
  const filterZone = useLocationStore((s) => s.filterZone);
  const showCheckin = useLocationStore((s) => s.showCheckin);
  const selectMember = useLocationStore((s) => s.selectMember);
  const setFilterZone = useLocationStore((s) => s.setFilterZone);
  const checkInToZone = useLocationStore((s) => s.checkInToZone);

  const [selectedHall, setSelectedHall] = useState('central');

  const { transform, isDragging, containerRef, handlers, zoomIn, zoomOut, reset } = usePanZoom();

  const selectedMember = members.find((m) => m.id === selectedMemberId) || null;

  // Auto-switch hall when filterZone changes or a member is selected
  useEffect(() => {
    const hall = hallOfZone(filterZone) || hallOfZone(selectedMember?.zone);
    if (hall) setSelectedHall(hall);
  }, [filterZone, selectedMember?.zone]);

  // Only show members whose zone belongs to the current hall
  const hallMembers = useMemo(
    () => members.filter((m) => hallOfZone(m.zone) === selectedHall),
    [members, selectedHall]
  );

  const memberCounts = useMemo(() => {
    const counts = {};
    for (const m of hallMembers) {
      counts[m.zone] = (counts[m.zone] || 0) + 1;
    }
    return counts;
  }, [hallMembers]);

  const handleZoneClick = (zoneId) => {
    if (showCheckin) {
      checkInToZone(zoneId);
    } else {
      setFilterZone(filterZone === zoneId ? null : zoneId);
    }
  };

  const switchHall = (hallId) => {
    setSelectedHall(hallId);
    setFilterZone(null);
    reset();
  };

  return (
    <div className="flex-1 overflow-hidden relative flex flex-col">
      {/* Hall selector tabs */}
      <div className="flex gap-0 shrink-0 border-b border-border px-3 pt-2">
        {HALLS.map((hall) => (
          <button
            key={hall.id}
            onClick={() => switchHall(hall.id)}
            className={`px-4 py-1.5 text-[11px] font-mono font-semibold tracking-widest
              border-b-2 transition-colors cursor-pointer mr-2
              ${selectedHall === hall.id
                ? 'border-teal text-teal'
                : 'border-transparent text-text-dim hover:text-text-muted'}`}
          >{hall.label.toUpperCase()}</button>
        ))}
      </div>

      {/* Map canvas */}
      <div
        className="flex-1 overflow-hidden relative"
        ref={containerRef}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        {...handlers}
      >
        <svg
          viewBox="0 0 1265 680"
          className="w-full h-full"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: 'center center',
          }}
        >
          <MapDefs />

          {/* Floor plan image */}
          <HallLayer selectedHall={selectedHall} />

          {/* Zone overlays */}
          <ZoneLayer
            selectedHall={selectedHall}
            memberCounts={memberCounts}
            showCheckin={showCheckin}
            filterZone={filterZone}
            onZoneClick={handleZoneClick}
          />

          {/* Team member pins — only for this hall */}
          {hallMembers.map((member) => {
            const pos = getMemberPosition(member, hallMembers);
            return (
              <MemberPin
                key={member.id}
                member={member}
                position={pos}
                isSelected={selectedMemberId === member.id}
                isCurrentUser={member.id === currentUser?.id}
                pulse={pulse}
                onSelect={() => selectMember(selectedMemberId === member.id ? null : member.id)}
              />
            );
          })}
        </svg>

        <MapControls onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={reset} />

        <MemberPopup
          member={selectedMember}
          isCurrentUser={selectedMember?.id === currentUser?.id}
          onClose={() => selectMember(null)}
        />
      </div>
    </div>
  );
}
