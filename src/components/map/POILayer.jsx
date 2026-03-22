import { POI } from '../../data/pois';

export default function POILayer() {
  return (
    <>
      {POI.map((poi) => (
        <g key={poi.id}>
          <text x={poi.x} y={poi.y} textAnchor="middle" fontSize="14">{poi.icon}</text>
          <text x={poi.x} y={poi.y + 14} textAnchor="middle" fill="#444" fontSize="6" fontFamily="monospace">
            {poi.label}
          </text>
        </g>
      ))}
    </>
  );
}
