import { useState, useEffect, useCallback } from 'react';
import useLocationStore from './store/useLocationStore';
import useFirebaseSync from './hooks/useFirebaseSync';
import useGeolocation from './hooks/useGeolocation';
import useNotifications from './hooks/useNotifications';
import JoinScreen from './components/JoinScreen';
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import Footer from './components/Footer';
import MapView from './components/map/MapView';
import RosterPanel from './components/roster/RosterPanel';
import SearchPanel from './components/search/SearchPanel';
import ScheduleView from './components/schedule/ScheduleView';
import IOSInstallPrompt from './components/IOSInstallPrompt';
import Toast from './components/Toast';

function MainView({ view, pulse }) {
  switch (view) {
    case 'map': return <MapView pulse={pulse} />;
    case 'roster': return <RosterPanel />;
    case 'search': return <SearchPanel />;
    case 'schedule': return <ScheduleView />;
    default: return <MapView pulse={pulse} />;
  }
}

export default function App() {
  const hasJoined = useLocationStore((s) => s.hasJoined);
  const view = useLocationStore((s) => s.view);
  const currentUser = useLocationStore((s) => s.currentUser);
  const [pulse, setPulse] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Real-time Firebase sync (no-op if not connected)
  useFirebaseSync();

  // GPS geolocation (only active when gpsActive=true)
  useGeolocation();

  // Notification listener
  const handleNotification = useCallback((notif) => {
    // Don't show notifications from ourselves
    if (notif.from === currentUser?.name) return;
    setToasts((prev) => [...prev, { id: Date.now(), ...notif }]);
  }, [currentUser?.name]);

  useNotifications(handleNotification);

  useEffect(() => {
    const i = setInterval(() => setPulse((p) => p + 1), 2000);
    return () => clearInterval(i);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (!hasJoined) {
    return <JoinScreen />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg font-mono">
      <Header />
      {(view === 'map' || view === 'roster') && <StatusBar />}
      <div className="flex-1 flex overflow-hidden">
        <MainView view={view} pulse={pulse} />
      </div>
      <Footer />
      <IOSInstallPrompt />
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  );
}
