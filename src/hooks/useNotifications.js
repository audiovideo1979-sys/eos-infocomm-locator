import { useEffect, useRef, useCallback } from 'react';
import { ref, onChildAdded, push, serverTimestamp, query, orderByChild, startAt } from 'firebase/database';
import { db } from '../firebase/config';
import useLocationStore from '../store/useLocationStore';

/**
 * Listens for new notifications in /teams/{code}/notifications
 * and surfaces them as toasts. Also provides send functions.
 */
export default function useNotifications(onNotification) {
  const teamCode = useLocationStore((s) => s.teamCode);
  const isFirebaseConnected = useLocationStore((s) => s.isFirebaseConnected);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!teamCode || !isFirebaseConnected) return;

    const notifRef = ref(db, `teams/${teamCode}/notifications`);
    // Only listen for notifications created after we connected
    const q = query(notifRef, orderByChild('timestamp'), startAt(startTime.current));

    const unsub = onChildAdded(q, (snapshot) => {
      const data = snapshot.val();
      if (data && onNotification) {
        onNotification(data);
      }
    });

    return () => unsub();
  }, [teamCode, isFirebaseConnected, onNotification]);
}

/**
 * Send a ping notification to a specific team member.
 */
export async function sendPing(teamCode, fromName, toName) {
  if (!teamCode) return;
  const notifRef = ref(db, `teams/${teamCode}/notifications`);
  await push(notifRef, {
    type: 'ping',
    from: fromName,
    to: toName,
    message: `${fromName} is looking for ${toName}`,
    timestamp: Date.now(),
  });
}

/**
 * Send a broadcast message to the whole team.
 */
export async function sendBroadcast(teamCode, fromName, message) {
  if (!teamCode) return;
  const notifRef = ref(db, `teams/${teamCode}/notifications`);
  await push(notifRef, {
    type: 'broadcast',
    from: fromName,
    message: `${fromName}: ${message}`,
    timestamp: Date.now(),
  });
}
