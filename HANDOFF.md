# EOS InfoComm Locator — Handoff

## Last Session: 2026-03-22
- **Machine:** PC
- **Summary:** Attempted map improvements — captured real floor plan images via Playwright, replaced 60 exhibitors with 770 from official Excel export, tried multiple map approaches (SVG backgrounds, Leaflet tiles, iframe proxy). None delivered satisfactory results. Project shelved.

## Last Version
@5 — Leaflet tile map (shelved)

## Files Modified (This Session)
- `src/data/booths.js` — 770 exhibitors from official Excel export
- `src/components/search/SearchPanel.jsx` — guard against missing category
- `src/components/map/MapView.jsx` — multiple rewrites (SVG → Leaflet tiles → iframe → back to Leaflet)
- `src/data/halls.js` — image path fields added
- `src/data/zones.js` — coordinates updated for single-hall viewBox
- `src/components/map/HallLayer.jsx` — SVG image background
- `src/components/map/ZoneLayer.jsx` — hall filtering
- `public/infocomm-*.png` — real floor plan captures (light + dark, both halls)
- `public/tiles/` — sliced tile pyramids for Leaflet
- `vite.config.js` — proxy config added/removed
- `package.json` — added leaflet dependency

## Current State
- Project shelved — pushed to GitHub as WIP
- Core app works (roster, search, schedule, Firebase sync)
- Map is functional but unsatisfying — raster tiles too blurry at deep zoom
- 770 exhibitors loaded from official InfoComm 2026 data

## Pending (If Ever Resumed)
- [ ] Simplify map to clean zone diagram (no floor plan image)
- [ ] Or find vector tile source for crisp zoom
- [ ] Firebase Hosting deploy
- [ ] PWA install testing on mobile

## Known Issues
- Leaflet tile map blurry at deep zoom (raster limitation)
- iframe proxy approach failed (MapYourShow sub-resources won't proxy)
- Categories array empty (Excel export had no category column)

## Key Decisions
- Shelved — map quality not meeting expectations
- Real floor plan approach abandoned in favor of potential simple zone diagram
