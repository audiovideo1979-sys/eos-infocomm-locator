import { ZONES } from '../../data/zones';

export default function ZoneLayer({ memberCounts, showCheckin, filterZone, onZoneClick }) {
  return (
    <>
      {ZONES.map((zone) => {
        const count = memberCounts[zone.id] || 0;
        const isActive = filterZone === zone.id;
        return (
          <g key={zone.id} className="zone-rect" onClick={() => onZoneClick(zone.id)}
            style={{ cursor: showCheckin ? 'crosshair' : 'pointer' }}>
            <rect
              x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="4"
              fill={isActive ? 'rgba(78,205,196,0.08)' : showCheckin ? 'rgba(255,107,107,0.04)' : 'rgba(255,255,255,0.02)'}
              stroke={isActive ? '#4ECDC4' : showCheckin ? '#FF6B6B44' : '#252540'}
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray={showCheckin ? '4 2' : 'none'}
            />
            <text
              x={zone.x + zone.w / 2} y={zone.y + 14}
              textAnchor="middle" fill={isActive ? '#4ECDC4' : '#444'}
              fontSize="10" fontFamily="monospace" fontWeight="600"
            >{zone.label}</text>
            {count > 0 && (
              <g>
                <circle cx={zone.x + zone.w - 12} cy={zone.y + 12} r="8" fill="#4ECDC4" opacity="0.9" />
                <text
                  x={zone.x + zone.w - 12} y={zone.y + 15.5}
                  textAnchor="middle" fill="#0a0a0f"
                  fontSize="9" fontWeight="700" fontFamily="monospace"
                >{count}</text>
              </g>
            )}
          </g>
        );
      })}
    </>
  );
}
