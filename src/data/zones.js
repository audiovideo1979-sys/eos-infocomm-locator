// Zone coordinates are in the per-hall viewBox (0 0 1265 680).
// These are first-pass approximations — tune by running the app and comparing
// zone outlines against the real floor plan image behind them.

export const ZONES = [
  // ── Central Hall ─────────────────────────────────────────────────────────
  // C4.1  booths C0–C4999  (small, upper-left — pre-hall / registration area)
  { id: 'C4.1',    label: 'C4.1',        hall: 'central', x: 30,  y: 30,  w: 220, h: 310 },
  // C1    booths C5000–C6999  (large left section)
  { id: 'C1',      label: 'C1',          hall: 'central', x: 270, y: 30,  w: 330, h: 310 },
  // C2    booths C7000–C7799  (center section)
  { id: 'C2',      label: 'C2',          hall: 'central', x: 620, y: 30,  w: 290, h: 310 },
  // C3    booths C7800–C8699  (right section)
  { id: 'C3',      label: 'C3',          hall: 'central', x: 930, y: 30,  w: 305, h: 310 },
  // C-LOBBY  Grand Lobby (lower-left, main entrance)
  { id: 'C-LOBBY', label: 'Grand Lobby', hall: 'central', x: 30,  y: 360, w: 440, h: 290 },
  // C4    booths C8700+  (lower-right)
  { id: 'C4',      label: 'C4',          hall: 'central', x: 490, y: 360, w: 745, h: 290 },

  // ── North Hall ────────────────────────────────────────────────────────────
  // N1    booths N0–N599  (small upper-left area)
  { id: 'N1',      label: 'N1',          hall: 'north',   x: 30,  y: 30,  w: 180, h: 290 },
  // N-LOBBY  Lobby (upper-center)
  { id: 'N-LOBBY', label: 'Lobby',       hall: 'north',   x: 230, y: 30,  w: 370, h: 290 },
  // N3    booths N7000–N7999  (upper-right)
  { id: 'N3',      label: 'N3',          hall: 'north',   x: 620, y: 30,  w: 615, h: 290 },
  // N2    booths N600–N6999  (large lower-left)
  { id: 'N2',      label: 'N2',          hall: 'north',   x: 30,  y: 340, w: 590, h: 310 },
  // N4    booths N8000+  (lower-right)
  { id: 'N4',      label: 'N4',          hall: 'north',   x: 640, y: 340, w: 595, h: 310 },
];
