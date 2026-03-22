import { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useLocationStore from '../../store/useLocationStore';
import { ZONES } from '../../data/zones';

const HALL_CONFIG = {
  central: {
    label: 'Central Hall',
    tileDir: '/tiles/central-hall',
    externalUrl: 'https://infocomm26.mapyourshow.com/8_0/floorplan/?hallID=C&level=1',
  },
  north: {
    label: 'North Hall',
    tileDir: '/tiles/north-hall',
    externalUrl: 'https://infocomm26.mapyourshow.com/8_0/floorplan/?hallID=E&level=1',
  },
};

// Tile space at z5: 32×32 tiles = 8192×8192px
// Source images ~9750×4550, scaled to fit → scale ≈ 0.84
// Content centered vertically within 8192×8192
const IMG_W = 8192;
const IMG_H = 8192;
const CONTENT_Y_OFFSET = 2185;
const CONTENT_H = 3823;
const DIV = 32; // 2^maxZoom

function zoneToLatLng(zone) {
  const scaleX = IMG_W / 1265;
  const scaleY = CONTENT_H / 680;
  const px = (zone.x + zone.w / 2) * scaleX;
  const py = CONTENT_Y_OFFSET + (zone.y + zone.h / 2) * scaleY;
  return [-py / DIV, px / DIV];
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

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current) return;
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

    L.tileLayer(`${config.tileDir}/{z}/{x}_{y}.jpg`, {
      minZoom: 0,
      maxZoom: 5,
      tileSize: 256,
      noWrap: true,
      bounds: [[-IMG_H / DIV, 0], [0, IMG_W / DIV]],
    }).addTo(map);

    const southWest = [-(CONTENT_Y_OFFSET + CONTENT_H) / DIV, 0];
    const northEast = [-CONTENT_Y_OFFSET / DIV, IMG_W / DIV];
    map.fitBounds([southWest, northEast]);

    // Zone overlays
    for (const zone of hallZones) {
      const scaleX = IMG_W / 1265 / DIV;
      const scaleY = CONTENT_H / 680 / DIV;
      const bounds = [
        [-(CONTENT_Y_OFFSET / DIV + (zone.y + zone.h) * scaleY), zone.x * scaleX],
        [-(CONTENT_Y_OFFSET / DIV + zone.y * scaleY), (zone.x + zone.w) * scaleX],
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
        if (showCheckin) checkInToZone(zone.id);
        else setFilterZone(filterZone === zone.id ? null : zone.id);
      });
    }

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [effectiveHall]);

  // Member markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    for (const member of hallMembers) {
      const zone = ZONES.find((z) => z.id === member.zone);
      if (!zone) continue;

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
    if (showCheckin) checkInToZone(zoneId);
    else setFilterZone(filterZone === zoneId ? null : zoneId);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Hall tabs + full-detail link */}
      <div className="flex shrink-0 border-b border-border px-3 pt-2 items-end">
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
        <a
          href={HALL_CONFIG[effectiveHall].externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto px-2 py-1 text-[10px] font-mono text-text-dim
            border border-border-light rounded hover:text-teal hover:border-teal
            transition-colors mb-1"
        >HD MAP {'\u2197'}</a>
      </div>

      {/* Leaflet map */}
      <div ref={mapRef} className="flex-1" style={{ background: '#f5f5f5' }} />

      {/* Zone bar */}
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
