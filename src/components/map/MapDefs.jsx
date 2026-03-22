export default function MapDefs() {
  return (
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a1a28" strokeWidth="0.5" />
      </pattern>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="hallGradN" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a1a2e" />
        <stop offset="100%" stopColor="#12121f" />
      </linearGradient>
      <linearGradient id="hallGradC" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e1a2e" />
        <stop offset="100%" stopColor="#15121f" />
      </linearGradient>
      {/* Invert + darken filter for white-background floor plan images */}
      <filter id="floorplanFilter" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix"
          values="-0.3 0 0 0 0.25
                   0 -0.3 0 0 0.22
                   0 0 -0.3 0 0.35
                   0 0 0 1 0" />
      </filter>
    </defs>
  );
}
