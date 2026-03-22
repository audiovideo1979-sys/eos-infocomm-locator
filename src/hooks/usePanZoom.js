import { useState, useCallback, useRef, useEffect } from 'react';

export default function usePanZoom() {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef(null);
  const containerRef = useRef(null);

  // Attach wheel listener as non-passive via ref to allow preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setTransform((prev) => ({
        ...prev,
        scale: Math.max(0.5, Math.min(3, prev.scale * delta)),
      }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.zone-rect') || e.target.closest('.member-dot')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  }, [transform.x, transform.y]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1) {
      if (e.target.closest('.zone-rect') || e.target.closest('.member-dot')) return;
      setIsDragging(true);
      dragStart.current = {
        x: e.touches[0].clientX - transform.x,
        y: e.touches[0].clientY - transform.y,
      };
    }
  }, [transform.x, transform.y]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDist.current !== null) {
        const ratio = dist / lastTouchDist.current;
        setTransform((prev) => ({
          ...prev,
          scale: Math.max(0.5, Math.min(3, prev.scale * ratio)),
        }));
      }
      lastTouchDist.current = dist;
    } else if (isDragging && e.touches.length === 1) {
      setTransform((prev) => ({
        ...prev,
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      }));
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    lastTouchDist.current = null;
  }, []);

  const zoomIn = useCallback(() => {
    setTransform((p) => ({ ...p, scale: Math.min(3, p.scale * 1.2) }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform((p) => ({ ...p, scale: Math.max(0.5, p.scale * 0.8) }));
  }, []);

  const reset = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  return {
    transform,
    isDragging,
    containerRef,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    zoomIn,
    zoomOut,
    reset,
  };
}
