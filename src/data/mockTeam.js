import { COLORS } from './colors';

export const INITIAL_TEAM = [
  { id: 1, name: "Steve", color: COLORS[0], zone: "C1", status: "Checking out Q-SYS", avatar: "S", lastUpdate: Date.now() },
  { id: 2, name: "Mike", color: COLORS[1], zone: "N2", status: "At Crestron booth", avatar: "M", lastUpdate: Date.now() - 120000 },
  { id: 3, name: "Jessica", color: COLORS[2], zone: "C3", status: "Meeting with Extron", avatar: "J", lastUpdate: Date.now() - 300000 },
  { id: 4, name: "Dan", color: COLORS[3], zone: "N1.1", status: "Audio demos", avatar: "D", lastUpdate: Date.now() - 60000 },
  { id: 5, name: "Sarah", color: COLORS[4], zone: "C-LOBBY", status: "Grabbing coffee", avatar: "S", lastUpdate: Date.now() - 600000 },
  { id: 6, name: "Tom", color: COLORS[5], zone: "N3", status: "Biamp presentation", avatar: "T", lastUpdate: Date.now() - 180000 },
  { id: 7, name: "Rachel", color: COLORS[6], zone: "C2", status: "Shure wireless demo", avatar: "R", lastUpdate: Date.now() - 420000 },
  { id: 8, name: "Chris", color: COLORS[7], zone: "N-LOBBY", status: "On a call", avatar: "C", lastUpdate: Date.now() - 90000 },
  { id: 9, name: "Amy", color: COLORS[8], zone: "C4", status: "Digital signage area", avatar: "A", lastUpdate: Date.now() - 240000 },
  { id: 10, name: "Brian", color: COLORS[9], zone: "N4", status: "Networking section", avatar: "B", lastUpdate: Date.now() - 360000 },
  { id: 11, name: "Lisa", color: COLORS[10], zone: "C4.1", status: "Control systems", avatar: "L", lastUpdate: Date.now() - 150000 },
  { id: 12, name: "James", color: COLORS[11], zone: "N1", status: "LED wall demos", avatar: "J", lastUpdate: Date.now() - 500000 },
];
