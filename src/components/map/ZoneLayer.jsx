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
              fill={isActive ? 'rgba(78,205,196,0.12)' : showCheckin ? 'rgba(255,107,107,0.06)' : 'rgba(10,10,20,0.35)'}
              stroke={isActive ? '#4ECDC4' : showCheckin ? '#FF6B6B66' : 'rgba(78,205,196,0.25)'}
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray={showCheckin ? '6 3' : 'none'}
            />
            <text
              x={zone.x + zone.w / 2} y={zone.y + 20}
              textAnchor="middle"
              fill={isActive ? '#4ECDC4' : 'rgba(255,255,255,0.5)'}
              fontSize="13" fontFamily="monospace" fontWeight="700"
              letterSpacing="0.05em"
            >{zone.label}</text>
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
