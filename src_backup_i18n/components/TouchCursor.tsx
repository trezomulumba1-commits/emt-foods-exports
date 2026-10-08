import React, { useEffect, useRef, useState } from 'react';

export default function TouchCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dot = document.createElement('div');
    dot.className = 'touch-cursor';
    document.body.appendChild(dot);
    dotRef.current = dot;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t || !dotRef.current) return;
      dotRef.current.style.left = `${t.clientX}px`;
      dotRef.current.style.top = `${t.clientY}px`;
      dotRef.current.style.opacity = '1';
      setVisible(true);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t || !dotRef.current) return;
      dotRef.current.style.left = `${t.clientX}px`;
      dotRef.current.style.top = `${t.clientY}px`;
    };
    const onTouchEnd = () => {
      if (!dotRef.current) return;
      dotRef.current.style.opacity = '0';
      setVisible(false);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      if (dotRef.current && dotRef.current.parentElement) dotRef.current.parentElement.removeChild(dotRef.current);
    };
  }, []);

  return null;
}
