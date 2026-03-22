import { HALLS } from '../../data/halls';

export default function HallLayer() {
  return (
    <>
      {/* Connector between halls */}
      <rect x="430" y="130" width="30" height="60" rx="4" fill="#1a1a28" stroke="#252540" strokeWidth="1" />
      <text x="445" y="165" textAnchor="middle" fill="#444" fontSize="7" fontFamily="monospace">BRIDGE</text>

      {/* Hall outlines */}
      {HALLS.map((hall) => (
        <g key={hall.id}>
          <rect
            x={hall.x} y={hall.y} width={hall.w} height={hall.h}
            rx="8" fill={hall.id === "north" ? "url(#hallGradN)" : "url(#hallGradC)"}
            stroke="#252540" strokeWidth="1.5"
          />
          <text
            x={hall.x + hall.w / 2} y={hall.y - 10}
            textAnchor="middle" fill="#555" fontSize="11"
            fontFamily="monospace" fontWeight="700"
            letterSpacing="0.15em"
          >{hall.label.toUpperCase()}</text>
        </g>
      ))}
    </>
  );
}
