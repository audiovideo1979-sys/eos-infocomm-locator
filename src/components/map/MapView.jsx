import { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useLocationStore from '../../store/useLocationStore';
import { ZONES } from '../../data/zones';

const HALL_CONFIG = {
  central: { label: 'Central Hall', tileDir: '/tiles/central-hall' },
  north:   { label: 'North Hall',   tileDir: '/tiles/north-hall' },
};

// Image dimensions at max zoom (z=5): 32×32 tiles of 256px = 8192×8192
// Source cropped images are ~9700×4400 (north) / ~9800×4700 (central).
// Scaled to fit 8192×8192: scale = min(8192/9750, 8192/4550) ≈ 0.8402
// scaled_w ≈ 8192, scaled_h ≈ 3823 → offset_y ≈ (8192 - 3823) / 2 ≈ 2185
const IMG_W = 8192;
const IMG_H = 8192;
const CONTENT_Y_OFFSET = 2185;
const CONTENT_H = 3823;

// Zone centers as fractions of the original 7590×4080 image
// (reusing the zone coordinates from zones.js which are in 1265×680 space)
// Scale: 1265 → 7590 = 6x, 680 → 4080 = 6x
function zoneToLatLng(zone) {
  // Zone coords are in 1265×680 space. Map to 4096×4096 tile space.
  const scaleX = IMG_W / 1265;
  const scaleY = CONTENT_H / 680;
  const px = (zone.x + zone.w / 2) * scaleX;
  const py = CONTENT_Y_OFFSET + (zone.y + zone.h / 2) * scaleY;
  // Leaflet CRS.Simple: lat = -y, lng = x (in pixels)
  return [-py / 32, px / 32]; // divide by 2^5 to get zoom-0 coords
}

function hallOfZone(zoneId) {
  if (!zoneId) return null;
  const z = ZONES.find((z) => z.id === zoneId);
  return z ? z.hall : null;
}

export default function MapView() {
  const members = useLocationStore((s) => s.members);
  const currentUser = useLocationStore((s) => s.currentUser);
  const selectedMemberId = useLocationStore((s) => s.selectedMemberId);
  const filterZone = useLocationStore((s) => s.filterZone);
  const showCheckin = useLocationStore((s) => s.showCheckin);
  const selectMember = useLocationStore((s) => s.selectMember);
  const setFilterZone = useLocationStore((s) => s.setFilterZone);
  const checkInToZone = useLocationStore((s) => s.checkInToZone);

  const [selectedHall, setSelectedHall] = useState('central');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const effectiveHall = hallOfZone(filterZone) || selectedHall;

  const hallMembers = useMemo(
    () => members.filter((m) => hallOfZone(m.zone) === effectiveHall),
    [members, effectiveHall]
  );

  const hallZones = ZONES.filter((z) => z.hall === effectiveHall);

  const memberCounts = useMemo(() => {
    const counts = {};
    for (const m of hallMembers) {
      counts[m.zone] = (counts[m.zone] || 0) + 1;
    }
    return counts;
  }, [hallMembers]);

  // Initialize / reinitialize Leaflet map when hall changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Destroy previous map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const config = HALL_CONFIG[effectiveHall];
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 5,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      attributionControl: false,
    });

    // Tile layer — our custom tiles: /tiles/{hall}/{z}/{x}_{y}.jpg
    L.tileLayer(`${config.tileDir}/{z}/{x}_{y}.jpg`, {
      minZoom: 0,
      maxZoom: 5,
      tileSize: 256,
      noWrap: true,
      bounds: [[-IMG_H / 32, 0], [0, IMG_W / 32]],
    }).addTo(map);

    // Set initial view to show the full content area
    const southWest = [-(CONTENT_Y_OFFSET + CONTENT_H) / 32, 0];
    const northEast = [-CONTENT_Y_OFFSET / 32, IMG_W / 32];
    map.fitBounds([southWest, northEast]);

    // Add zone overlays
    for (const zone of hallZones) {
      const [lat, lng] = zoneToLatLng(zone);
      const scaleX = IMG_W / 1265 / 32;
      const scaleY = CONTENT_H / 680 / 32;
      const bounds = [
        [-(CONTENT_Y_OFFSET / 32 + (zone.y + zone.h) * scaleY), zone.x * scaleX],
        [-(CONTENT_Y_OFFSET / 32 + zone.y * scaleY), (zone.x + zone.w) * scaleX],
      ];
      const rect = L.rectangle(bounds, {
        color: 'rgba(78,205,196,0.4)',
        weight: 1,
        fillOpacity: 0,
        dashArray: '4 4',
        interactive: true,
      }).addTo(map);

      rect.bindTooltip(zone.label, {
        permanent: true,
        direction: 'center',
        className: 'zone-label',
      });

      rect.on('click', () => {
        if (showCheckin) {
          checkInToZone(zone.id);
        } else {
          setFilterZone(filterZone === zone.id ? null : zone.id);
        }
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [effectiveHall]);

  // Update member markers when members change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add member markers
    for (const member of hallMembers) {
      const zone = ZONES.find((z) => z.id === member.zone);
      if (!zone) continue;

      // Spread members within a zone
      const sameZone = hallMembers.filter((m) => m.zone === member.zone);
      const idx = sameZone.indexOf(member);
      const count = sameZone.length;
      const angle = count <= 1 ? 0 : (idx / count) * Math.PI * 2 - Math.PI / 2;
      const radius = count <= 1 ? 0 : Math.min(0.8, 0.3 + count * 0.1);

      const [baseLat, baseLng] = zoneToLatLng(zone);
      const lat = baseLat + Math.sin(angle) * radius;
      const lng = baseLng + Math.cos(angle) * radius;

      const isSelected = member.id === selectedMemberId;
      const isCurrentUser = member.id === currentUser?.id;

      const marker = L.circleMarker([lat, lng], {
        radius: isSelected ? 14 : 10,
        fillColor: member.color,
        color: isSelected ? '#fff' : isCurrentUser ? member.color : 'transparent',
        weight: isSelected ? 3 : isCurrentUser ? 2 : 0,
        fillOpacity: 0.95,
      }).addTo(map);

      // Avatar label
      marker.bindTooltip(member.avatar, {
        permanent: true,
        direction: 'center',
        className: 'member-avatar-label',
      });

      marker.on('click', () => {
        selectMember(selectedMemberId === member.id ? null : member.id);
      });

      markersRef.current.push(marker);
    }
  }, [hallMembers, selectedMemberId, currentUser?.id]);

  const switchHall = (hallId) => {
    setSelectedHall(hallId);
    setFilterZone(null);
  };

  const handleZoneClick = (zoneId) => {
    if (showCheckin) {
      checkInToZone(zoneId);
    } else {
      setFilterZone(filterZone === zoneId ? null : zoneId);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Hall selector tabs */}
      <div className="flex shrink-0 border-b border-border px-3 pt-2">
        {Object.entries(HALL_CONFIG).map(([id, cfg]) => (
          <button
            key={id}
            onClick={() => switchHall(id)}
            className={`px-4 py-1.5 text-[11px] font-mono font-semibold tracking-widest
              border-b-2 transition-colors cursor-pointer mr-2
              ${effectiveHall === id
                ? 'border-teal text-teal'
                : 'border-transparent text-text-dim hover:text-text-muted'}`}
          >{cfg.label.toUpperCase()}</button>
        ))}
      </div>

      {/* Leaflet map */}
      <div ref={mapRef} className="flex-1" style={{ background: '#f5f5f5' }} />

      {/* Zone quick-nav bar */}
      <div className="shrink-0 border-t border-border px-3 py-2 flex gap-1.5 flex-wrap items-center">
        <span className="text-[10px] text-text-dim font-mono mr-1">ZONES:</span>
        {hallZones.map((zone) => {
          const count = memberCounts[zone.id] || 0;
          const isActive = filterZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              className={`px-2 py-0.5 text-[10px] rounded-full font-mono cursor-pointer
                transition-colors border flex items-center gap-1
                ${isActive
                  ? 'bg-teal/15 border-teal text-teal'
                  : showCheckin
                    ? 'bg-transparent border-red-500/30 text-red-400 hover:border-red-500/60'
                    : 'bg-transparent border-border-light text-text-dim hover:text-text-muted'}`}
            >
              {zone.label}
              {count > 0 && (
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold
                  ${isActive ? 'bg-teal text-bg' : 'bg-teal/80 text-bg'}`}
                >{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
