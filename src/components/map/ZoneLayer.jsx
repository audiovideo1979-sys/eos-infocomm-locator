import { ZONES } from '../../data/zones';

export default function ZoneLayer({ selectedHall, memberCounts, showCheckin, filterZone, onZoneClick }) {
  const zones = ZONES.filter((z) => z.hall === selectedHall);

  return (
    <>
      {zones.map((zone) => {
        const count = memberCounts[zone.id] || 0;
        const isActive = filterZone === zone.id;
        return (
          <g key={zone.id} onClick={() => onZoneClick(zone.id)}
            style={{ cursor: showCheckin ? 'crosshair' : 'pointer' }}>
            <rect
              x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="6"
              fill={isActive ? 'rgba(78,205,196,0.08)' : 'transparent'}
              stroke={isActive ? '#4ECDC4' : showCheckin ? '#FF6B6B44' : 'rgba(78,205,196,0.15)'}
              strokeWidth={isActive ? 2 : 0.5}
              strokeDasharray={isActive ? 'none' : '4 4'}
            />
            {count > 0 && (
              <g>
                <circle cx={zone.x + zone.w - 14} cy={zone.y + 14} r="10" fill="#4ECDC4" opacity="0.95" />
                <text
                  x={zone.x + zone.w - 14} y={zone.y + 18}
                  textAnchor="middle" fill="#0a0a0f"
                  fontSize="10" fontWeight="800" fontFamily="monospace"
                >{count}</text>
              </g>
            )}
          </g>
        );
      })}
    </>
  );
}
