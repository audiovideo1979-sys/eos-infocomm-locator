import { useEffect, useRef, useCallback } from 'react';
import useLocationStore from '../store/useLocationStore';
import { gpsToZone } from '../utils/gpsZoneMapping';

const GPS_UPDATE_INTERVAL = 15000; // 15 seconds throttle

/**
 * Browser Geolocation hook.
 * Watches GPS position when gpsActive=true, maps coords to a zone,
 * and calls checkInToZone when the zone changes.
 */
export default function useGeolocation() {
  const gpsActive = useLocationStore((s) => s.gpsActive);
  const checkInToZone = useLocationStore((s) => s.checkInToZone);
  const setGpsPosition = useLocationStore((s) => s.setGpsPosition);
  const watchIdRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const lastZoneRef = useRef(null);

  const handlePosition = useCallback((position) => {
    const now = Date.now();
    if (now - lastUpdateRef.current < GPS_UPDATE_INTERVAL) return;
    lastUpdateRef.current = now;

    const { latitude, longitude, accuracy } = position.coords;
    setGpsPosition({ lat: latitude, lng: longitude, accuracy });

    const zone = gpsToZone(latitude, longitude);
    if (zone && zone !== lastZoneRef.current) {
      lastZoneRef.current = zone;
      checkInToZone(zone);
    }
  }, [checkInToZone, setGpsPosition]);

  const handleError = useCallback((error) => {
    console.warn('Geolocation error:', error.message);
    // GPS failed — user stays in manual mode, no action needed
  }, []);

  useEffect(() => {
    if (!gpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [gpsActive, handlePosition, handleError]);
}
