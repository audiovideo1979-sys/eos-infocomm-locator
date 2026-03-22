export default function MemberPin({ member, position, isSelected, isCurrentUser, pulse, onSelect }) {
  return (
    <g
      className="member-dot"
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      style={{ cursor: 'pointer' }}
    >
      {/* Pulse ring for current user */}
      {isCurrentUser && (
        <circle cx={position.x} cy={position.y} r="16"
          fill="none" stroke={member.color} strokeWidth="1.5"
          opacity={0.3 + 0.2 * Math.sin(pulse * 0.5)}
        />
      )}
      {/* Selection ring */}
      {isSelected && (
        <circle cx={position.x} cy={position.y} r="14"
          fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6"
        />
      )}
      {/* Avatar circle */}
      <circle cx={position.x} cy={position.y} r="10"
        fill={member.color} filter={isSelected ? 'url(#glow)' : 'none'}
      />
      <text x={position.x} y={position.y + 4}
        textAnchor="middle" fill="#fff"
        fontSize="9" fontWeight="700" fontFamily="monospace"
      >{member.avatar}</text>
    </g>
  );
}
