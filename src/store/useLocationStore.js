import { create } from 'zustand';
import { INITIAL_TEAM } from '../data/mockTeam';
import { COLORS } from '../data/colors';
import { pushMemberUpdate } from '../hooks/useFirebaseSync';

const STORAGE_KEY = 'eos-locator-session';

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(name, teamCode, uid) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, teamCode, uid }));
}

const saved = loadSession();

// Check if Firebase is configured (not placeholder)
const isFirebaseConfigured = () => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return key && key !== 'PLACEHOLDER';
};

const useLocationStore = create((set, get) => ({
  // Auth / identity
  currentUser: saved && !isFirebaseConfigured()
    ? { id: 1, name: saved.name, color: COLORS[0], avatar: saved.name[0].toUpperCase() }
    : null,
  teamCode: saved?.teamCode || null,
  hasJoined: saved && !isFirebaseConfigured() ? true : false,

  // Firebase state
  isFirebaseConnected: false,
  uid: saved?.uid || null,

  // GPS state
  gpsPosition: null, // { lat, lng, accuracy }

  // Team
  members: saved && !isFirebaseConfigured() ? INITIAL_TEAM.map((m) =>
    m.id === 1 ? { ...m, name: saved.name, avatar: saved.name[0].toUpperCase() } : m
  ) : [],

  // UI state
  view: 'map',
  selectedMemberId: null,
  filterZone: null,
  showCheckin: false,
  gpsActive: false,
  showAddMember: false,

  // ─── Actions ───

  // Local-only join (Phase 1 fallback when Firebase not configured)
  join: (name, teamCode) => {
    const user = { id: 1, name, color: COLORS[0], avatar: name[0].toUpperCase() };
    saveSession(name, teamCode, 1);
    set({
      currentUser: user,
      teamCode,
      hasJoined: true,
      members: INITIAL_TEAM.map((m) =>
        m.id === 1 ? { ...m, name, avatar: name[0].toUpperCase() } : m
      ),
    });
  },

  // Firebase join (Phase 2)
  joinWithFirebase: (uid, name, teamCode, color, avatar) => {
    saveSession(name, teamCode, uid);
    set({
      currentUser: { id: uid, name, color, avatar },
      teamCode,
      uid,
      hasJoined: true,
      isFirebaseConnected: true,
    });
  },

  // Restore session from Firebase auth
  restoreSession: (uid) => {
    if (!saved || saved.uid !== uid) return false;
    set({
      currentUser: { id: uid, name: saved.name, color: COLORS[0], avatar: saved.name[0].toUpperCase() },
      teamCode: saved.teamCode,
      uid,
      hasJoined: true,
      isFirebaseConnected: true,
    });
    return true;
  },

  // Receive members array from Firebase listener
  setMembersFromFirebase: (members) => {
    set({ members });
  },

  setFirebaseConnected: (connected) => set({ isFirebaseConnected: connected }),

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      currentUser: null,
      teamCode: null,
      uid: null,
      hasJoined: false,
      isFirebaseConnected: false,
      members: [],
      view: 'map',
      selectedMemberId: null,
      filterZone: null,
      showCheckin: false,
      gpsActive: false,
      gpsPosition: null,
    });
  },

  checkInToZone: (zoneId) => {
    const { currentUser, isFirebaseConnected, teamCode, uid } = get();
    if (!currentUser) return;

    if (isFirebaseConnected && teamCode && uid) {
      // Firebase mode: push to server, listener will update local state
      pushMemberUpdate(teamCode, uid, { zone: zoneId });
    } else {
      // Local mode: update state directly
      set((state) => ({
        members: state.members.map((m) =>
          m.id === currentUser.id ? { ...m, zone: zoneId, lastUpdate: Date.now() } : m
        ),
      }));
    }
    set({ showCheckin: false });
  },

  updateStatus: (status) => {
    const { currentUser, isFirebaseConnected, teamCode, uid } = get();
    if (!currentUser || !status.trim()) return;

    if (isFirebaseConnected && teamCode && uid) {
      pushMemberUpdate(teamCode, uid, { status });
    } else {
      set((state) => ({
        members: state.members.map((m) =>
          m.id === currentUser.id ? { ...m, status, lastUpdate: Date.now() } : m
        ),
      }));
    }
  },

  setGpsPosition: (pos) => set({ gpsPosition: pos }),

  addMember: (name) => {
    if (!name.trim()) return;
    // addMember only works in local mode — in Firebase mode, new users join via JoinScreen
    set((state) => {
      const ids = state.members.map((m) => typeof m.id === 'number' ? m.id : 0);
      const newId = Math.max(...ids, 0) + 1;
      return {
        members: [...state.members, {
          id: newId,
          name: name.trim(),
          color: COLORS[newId % COLORS.length],
          zone: "C-LOBBY",
          status: "Just arrived",
          avatar: name.trim()[0].toUpperCase(),
          lastUpdate: Date.now(),
        }],
        showAddMember: false,
      };
    });
  },

  selectMember: (id) => set({ selectedMemberId: id }),
  setView: (view) => set({ view }),
  setFilterZone: (zoneId) => set({ filterZone: zoneId }),
  toggleCheckin: () => set((s) => ({ showCheckin: !s.showCheckin })),
  toggleGps: () => set((s) => ({ gpsActive: !s.gpsActive })),
  toggleAddMember: () => set((s) => ({ showAddMember: !s.showAddMember })),
}));

export default useLocationStore;
