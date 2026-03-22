/**
 * GPS coordinate to zone mapping for LVCC.
 *
 * The Las Vegas Convention Center is oriented roughly east-west:
 * - North Hall is on the north side (higher latitude)
 * - Central Hall is on the south side (lower latitude)
 * - West Hall is to the west (lower longitude)
 *
 * LVCC approximate bounds:
 *   NW corner: 36.1320, -115.1560
 *   SE corner: 36.1280, -115.1470
 *
 * These are approximate zone polygons. Indoor GPS accuracy is 10-30m,
 * so zone-level precision is the realistic target.
 */

// Zone polygons defined as [lat, lng] bounding boxes
// Format: { north, south, east, west } (lat/lng bounds)
const ZONE_BOUNDS = {
  // North Hall zones (north side of building, higher latitude)
  'N1':      { north: 36.1318, south: 36.1310, west: -115.1558, east: -115.1540 },
  'N2':      { north: 36.1318, south: 36.1310, west: -115.1540, east: -115.1525 },
  'N3':      { north: 36.1318, south: 36.1310, west: -115.1525, east: -115.1510 },
  'N4':      { north: 36.1318, south: 36.1310, west: -115.1510, east: -115.1495 },
  'N1.1':    { north: 36.1310, south: 36.1302, west: -115.1558, east: -115.1525 },
  'N-LOBBY': { north: 36.1310, south: 36.1302, west: -115.1525, east: -115.1495 },

  // Central Hall zones (south side of building, lower latitude)
  'C1':      { north: 36.1300, south: 36.1292, west: -115.1558, east: -115.1540 },
  'C2':      { north: 36.1300, south: 36.1292, west: -115.1540, east: -115.1525 },
  'C3':      { north: 36.1300, south: 36.1292, west: -115.1525, east: -115.1510 },
  'C4':      { north: 36.1300, south: 36.1292, west: -115.1510, east: -115.1495 },
  'C4.1':    { north: 36.1292, south: 36.1284, west: -115.1558, east: -115.1525 },
  'C-LOBBY': { north: 36.1292, south: 36.1284, west: -115.1525, east: -115.1495 },
};

/**
 * Point-in-rectangle test for GPS coordinates.
 */
function isInBounds(lat, lng, bounds) {
  return lat >= bounds.south && lat <= bounds.north &&
         lng >= bounds.west && lng <= bounds.east;
}

/**
 * Map GPS coordinates to a zone ID.
 * Returns the zone ID string, or null if outside all zones.
 */
export function gpsToZone(lat, lng) {
  for (const [zoneId, bounds] of Object.entries(ZONE_BOUNDS)) {
    if (isInBounds(lat, lng, bounds)) {
      return zoneId;
    }
  }

  // Fallback: find nearest zone by center distance
  let nearest = null;
  let minDist = Infinity;
  for (const [zoneId, bounds] of Object.entries(ZONE_BOUNDS)) {
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;
    const dist = Math.sqrt(
      Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = zoneId;
    }
  }

  // Only return nearest if within ~100m (roughly 0.001 degrees)
  return minDist < 0.001 ? nearest : null;
}

/**
 * Get the GPS center of a zone (for map overlay alignment).
 */
export function getZoneGpsCenter(zoneId) {
  const bounds = ZONE_BOUNDS[zoneId];
  if (!bounds) return null;
  return {
    lat: (bounds.north + bounds.south) / 2,
    lng: (bounds.east + bounds.west) / 2,
  };
}
