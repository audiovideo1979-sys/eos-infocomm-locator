import { useEffect, useRef } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebase/config';
import useLocationStore from '../store/useLocationStore';

/**
 * Real-time sync hook: listens to /teams/{teamCode}/members in Firebase
 * and pushes local changes back to Firebase.
 */
export default function useFirebaseSync() {
  const teamCode = useLocationStore((s) => s.teamCode);
  const currentUser = useLocationStore((s) => s.currentUser);
  const setMembersFromFirebase = useLocationStore((s) => s.setMembersFromFirebase);
  const isFirebaseConnected = useLocationStore((s) => s.isFirebaseConnected);
  const unsubRef = useRef(null);

  // Subscribe to team members in Firebase
  useEffect(() => {
    if (!teamCode || !isFirebaseConnected) return;

    const membersRef = ref(db, `teams/${teamCode}/members`);
    const unsub = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      // Convert Firebase object to array
      const members = Object.entries(data).map(([uid, member]) => ({
        id: uid,
        ...member,
      }));

      setMembersFromFirebase(members);
    });

    unsubRef.current = unsub;
    return () => unsub();
  }, [teamCode, isFirebaseConnected, setMembersFromFirebase]);

  return null;
}

/**
 * Push a member field update to Firebase.
 * Called from store actions when the current user changes zone/status.
 */
export async function pushMemberUpdate(teamCode, uid, updates) {
  if (!teamCode || !uid) return;
  const memberRef = ref(db, `teams/${teamCode}/members/${uid}`);
  await update(memberRef, {
    ...updates,
    lastUpdate: Date.now(),
  });
}
