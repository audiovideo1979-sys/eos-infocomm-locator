import { useMemo } from 'react';
import useLocationStore from '../../store/useLocationStore';
import { getMemberPosition } from '../../utils/mapGeometry';
import usePanZoom from '../../hooks/usePanZoom';
import MapDefs from './MapDefs';
import HallLayer from './HallLayer';
import ZoneLayer from './ZoneLayer';
import POILayer from './POILayer';
import MemberPin from './MemberPin';
import MapControls from './MapControls';
import MemberPopup from './MemberPopup';

const FLOORPLAN_URLS = {
  central: 'https://infocomm26.mapyourshow.com/8_0/floorplan/?hallID=C&level=1',
  north: 'https://infocomm26.mapyourshow.com/8_0/floorplan/?hallID=E&level=1',
  overview: 'https://infocomm26.mapyourshow.com/8_0/floorplan/?hallID=N&level=1',
};

export default function MapView({ pulse }) {
  const members = useLocationStore((s) => s.members);
  const currentUser = useLocationStore((s) => s.currentUser);
  const selectedMemberId = useLocationStore((s) => s.selectedMemberId);
  const filterZone = useLocationStore((s) => s.filterZone);
  const showCheckin = useLocationStore((s) => s.showCheckin);
  const selectMember = useLocationStore((s) => s.selectMember);
  const setFilterZone = useLocationStore((s) => s.setFilterZone);
  const checkInToZone = useLocationStore((s) => s.checkInToZone);

  const { transform, isDragging, containerRef, handlers, zoomIn, zoomOut, reset } = usePanZoom();

  const selectedMember = members.find((m) => m.id === selectedMemberId) || null;

  const memberCounts = useMemo(() => {
    const counts = {};
    for (const m of members) {
      counts[m.zone] = (counts[m.zone] || 0) + 1;
    }
    return counts;
  }, [members]);

  const handleZoneClick = (zoneId) => {
    if (showCheckin) {
      checkInToZone(zoneId);
    } else {
      setFilterZone(filterZone === zoneId ? null : zoneId);
    }
  };

  const openFloorPlan = (hall = 'central') => {
    window.open(FLOORPLAN_URLS[hall], '_blank', 'noopener');
  };

  return (
    <div className="flex-1 overflow-hidden relative"
      ref={containerRef}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      {...handlers}
    >
      <svg
        viewBox="0 0 890 380"
        className="w-full h-full"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Background */}
        <rect width="890" height="380" fill="#0a0a0f" />
        <rect width="890" height="380" fill="url(#grid)" />

        <MapDefs />
        <HallLayer />
        <ZoneLayer
          memberCounts={memberCounts}
          showCheckin={showCheckin}
          filterZone={filterZone}
          onZoneClick={handleZoneClick}
        />
        <POILayer />

        {/* Team member pins */}
        {members.map((member) => {
          const pos = getMemberPosition(member, members);
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

      {/* Floor plan buttons */}
      <div className="absolute top-3 left-3 flex gap-1">
        <button
          onClick={() => openFloorPlan('central')}
          className="px-2 py-1.5 text-[10px] rounded-md border border-border-light
            bg-bg/90 text-text-dim font-mono cursor-pointer hover:text-teal hover:border-teal transition-colors backdrop-blur-sm"
        >CENTRAL HALL {'\u2197'}</button>
        <button
          onClick={() => openFloorPlan('north')}
          className="px-2 py-1.5 text-[10px] rounded-md border border-border-light
            bg-bg/90 text-text-dim font-mono cursor-pointer hover:text-teal hover:border-teal transition-colors backdrop-blur-sm"
        >NORTH HALL {'\u2197'}</button>
      </div>

      <MemberPopup
        member={selectedMember}
        isCurrentUser={selectedMember?.id === currentUser?.id}
        onClose={() => selectMember(null)}
      />
    </div>
  );
}
