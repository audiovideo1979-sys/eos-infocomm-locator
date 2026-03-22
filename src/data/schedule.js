// InfoComm 2026 default schedule data
// Pre-populated with key sessions; users can add custom events via the app

export const DEFAULT_SCHEDULE = [
  // Day 1 - June 17 (Tuesday)
  { id: "s1", title: "Show Floor Opens", time: "09:00", endTime: "17:00", day: "2026-06-17", location: "North & Central Halls", type: "show", members: [] },
  { id: "s2", title: "Opening Keynote", time: "08:00", endTime: "09:00", day: "2026-06-17", location: "W305", type: "session", members: [] },
  { id: "s3", title: "AV/IT Convergence Panel", time: "10:30", endTime: "11:30", day: "2026-06-17", location: "W304", type: "session", members: [] },
  { id: "s4", title: "Team Lunch", time: "12:00", endTime: "13:00", day: "2026-06-17", location: "Food Court (North)", type: "lunch", members: [] },
  { id: "s5", title: "Crestron Demo", time: "14:00", endTime: "15:00", day: "2026-06-17", location: "Booth C7300", type: "booth", members: [] },
  { id: "s6", title: "Q-SYS Training Session", time: "15:30", endTime: "16:30", day: "2026-06-17", location: "Booth C8737", type: "booth", members: [] },

  // Day 2 - June 18 (Wednesday)
  { id: "s7", title: "Show Floor Opens", time: "09:00", endTime: "17:00", day: "2026-06-18", location: "North & Central Halls", type: "show", members: [] },
  { id: "s8", title: "Dante Certification", time: "09:00", endTime: "12:00", day: "2026-06-18", location: "W310", type: "session", members: [] },
  { id: "s9", title: "Networking & UC Deep Dive", time: "10:00", endTime: "11:00", day: "2026-06-18", location: "W304", type: "session", members: [] },
  { id: "s10", title: "Team Sync Meeting", time: "12:30", endTime: "13:00", day: "2026-06-18", location: "Grand Lobby", type: "meeting", members: [] },
  { id: "s11", title: "Shure Wireless Workshop", time: "14:00", endTime: "15:30", day: "2026-06-18", location: "Booth C9018", type: "booth", members: [] },
  { id: "s12", title: "LED & Display Technology", time: "15:00", endTime: "16:00", day: "2026-06-18", location: "W305", type: "session", members: [] },

  // Day 3 - June 19 (Thursday)
  { id: "s13", title: "Show Floor Opens", time: "09:00", endTime: "15:00", day: "2026-06-19", location: "North & Central Halls", type: "show", members: [] },
  { id: "s14", title: "Control Systems Roundtable", time: "09:30", endTime: "10:30", day: "2026-06-19", location: "W304", type: "session", members: [] },
  { id: "s15", title: "Final Booth Visits", time: "10:30", endTime: "12:00", day: "2026-06-19", location: "Central Hall", type: "booth", members: [] },
  { id: "s16", title: "Team Debrief", time: "13:00", endTime: "14:00", day: "2026-06-19", location: "Grand Lobby", type: "meeting", members: [] },
];

export const EVENT_TYPES = {
  session: { label: "Session", color: "#45B7D1" },
  booth: { label: "Booth Visit", color: "#4ECDC4" },
  meeting: { label: "Team Meeting", color: "#FF6B6B" },
  lunch: { label: "Lunch/Break", color: "#FFEAA7" },
  show: { label: "Show Floor", color: "#96CEB4" },
};

export const SHOW_DAYS = [
  { date: "2026-06-17", label: "Day 1", dayName: "Tue Jun 17" },
  { date: "2026-06-18", label: "Day 2", dayName: "Wed Jun 18" },
  { date: "2026-06-19", label: "Day 3", dayName: "Thu Jun 19" },
];
