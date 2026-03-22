# EOS InfoComm Locator — Handoff

## Last Session: 2026-03-22
- **Machine:** Laptop
- **Summary:** Project initialized — React + Vite + Firebase PWA scaffolded. Core architecture in place: map view, roster, search, schedule, Zustand store, Firebase sync, geolocation, notifications.

## Last Version
@1 — Initial project scaffold

## Files Modified
- Initial commit — all files

## Current State
- Project scaffolded with full component structure
- Firebase config and auth in place
- Hall maps (Central + North, light/dark) added to public/
- PWA manifest and icons in place
- Core hooks: useFirebaseSync, useGeolocation, useNotifications
- Data files: booths, halls, zones, schedule, pois, colors

## Pending / Next Tasks
- [ ] Flesh out actual booth/exhibitor data in `src/data/booths.js`
- [ ] Implement map pin rendering in MapView
- [ ] Wire up Firebase RTDB for live location sharing
- [ ] Test PWA install flow on iOS and Android
- [ ] Set up Firebase Hosting and deploy

## Known Issues / Notes
- README.md is still the default Vite template — needs updating
- Firebase project credentials should be in env vars, not hardcoded

## Key Decisions
- PWA so team can install on phones without app store
- Firebase RTDB for real-time location updates (low latency)
- Zustand for lightweight client state
- Tailwind CSS 4 (Vite plugin variant)
- Hall maps as static images in public/ (Central Hall + North Hall)
