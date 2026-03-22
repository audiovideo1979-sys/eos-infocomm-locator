import { ZONES } from '../data/zones';

export function getZoneCenter(zoneId) {
  const z = ZONES.find((z) => z.id === zoneId);
  if (!z) return { x: 632, y: 340 };
  return { x: z.x + z.w / 2, y: z.y + z.h / 2 };
}

export function getMemberPosition(member, allMembers) {
  const center = getZoneCenter(member.zone);
  const sameZone = allMembers.filter((m) => m.zone === member.zone);
  const idx = sameZone.findIndex((m) => m.id === member.id);
  const count = sameZone.length;
  if (count <= 1) return center;
  const angle = (idx / count) * Math.PI * 2 - Math.PI / 2;
  const radius = Math.min(22, 10 + count * 3);
  return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
}
