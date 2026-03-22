import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from './config';
import { COLORS } from '../data/colors';

/**
 * Sign in anonymously and register the user under a team.
 * Returns { uid, name, color, avatar }
 */
export async function joinTeam(name, teamCode) {
  // Sign in anonymously (creates a persistent uid)
  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;

  // Pick a color based on uid hash
  const colorIndex = uid.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length;
  const color = COLORS[colorIndex];
  const avatar = name.trim()[0].toUpperCase();

  // Write member record to Firebase
  const memberRef = ref(db, `teams/${teamCode}/members/${uid}`);
  await set(memberRef, {
    name: name.trim(),
    color,
    avatar,
    zone: 'C-LOBBY',
    status: 'Just arrived',
    lastUpdate: Date.now(),
  });

  return { uid, name: name.trim(), color, avatar };
}

/**
 * Check if a team exists (has any members).
 */
export async function teamExists(teamCode) {
  const teamRef = ref(db, `teams/${teamCode}/members`);
  const snapshot = await get(teamRef);
  return snapshot.exists();
}

/**
 * Listen for auth state changes.
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user uid (or null if not signed in).
 */
export function getCurrentUid() {
  return auth.currentUser?.uid || null;
}
