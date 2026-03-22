import { HALLS } from '../../data/halls';

// Renders the real floor plan image as the map background.
// `selectedHall` is 'central' | 'north'
export default function HallLayer({ selectedHall }) {
  const hall = HALLS.find((h) => h.id === selectedHall);
  if (!hall) return null;

  return (
    <image
      href={hall.image}
      x={0}
      y={0}
      width={1265}
      height={680}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
