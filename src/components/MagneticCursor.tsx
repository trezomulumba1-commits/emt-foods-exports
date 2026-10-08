import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Use refs for scroll state to avoid stale closures and unnecessary re-renders
  const scrollPctRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | undefined>(undefined);

  // Only these drive re-renders (CSS classes / label text)
  const [label, setLabel] = useState('');
  const [isHover, setIsHover] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [isNearBtn, setIsNearBtn] = useState(false); // 28–60% zone: dot hides, ring stays
  const [isScrollActive, setIsScrollActive] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xToDot = gsap.quickTo(dot, 'left', { duration: 0.09, ease: 'power3.out' });
    const yToDot = gsap.quickTo(dot, 'top', { duration: 0.09, ease: 'power3.out' });
    const xToRing = gsap.quickTo(ring, 'left', { duration: 0.22, ease: 'power3.out' });
    const yToRing = gsap.quickTo(ring, 'top', { duration: 0.22, ease: 'power3.out' });

    let lastPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const getTargetCursorColor = (el: Element | null): 'white' | 'black' => {
      let node: Element | null = el;
      while (node && node !== document.documentElement) {
        if (
          node.classList.contains('bg-white') ||
          node.classList.contains('bg-gray-50') ||
          node.getAttribute('data-cursor-bg') === 'dark'
        ) {
          return 'black';
        }
        const cs = getComputedStyle(node);
        const bg = cs.backgroundColor;
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
          if (match) {
            const r = Number(match[1]);
            const g = Number(match[2]);
            const b = Number(match[3]);
            const a = match[4] !== undefined ? Number(match[4]) : 1;
            if (a > 0.25) {
              const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
              return lum > 0.5 ? 'black' : 'white';
            }
          }
        }
        node = node.parentElement;
      }
      return document.documentElement.classList.contains('dark') ? 'white' : 'black';
    };

    const getContextualLabel = (rootEl: Element): string | null => {
      const explicit = rootEl.closest('[data-cursor]') as HTMLElement | null;
      if (explicit && explicit.dataset.cursor) {
        return explicit.dataset.cursor.toUpperCase();
      }
      return null;
    };

    const clearScrollState = () => {
      scrollPctRef.current = null;
      setIsScrollActive(false);
      setLabel('');
      setIsHover(false);
    };

    const onMove = (e: MouseEvent) => {
      let targetX = e.clientX;
      let targetY = e.clientY;
      lastPos = { x: e.clientX, y: e.clientY };

      const rootEl = document.elementFromPoint(e.clientX, e.clientY);
      if (!rootEl) {
        setIsHover(false);
        setIsMerged(false);
        setIsNearBtn(false);
        setLabel('');
        document.documentElement.dataset.cursorColor =
          document.documentElement.classList.contains('dark') ? 'white' : 'black';
        xToDot(targetX); yToDot(targetY);
        xToRing(targetX); yToRing(targetY);
        return;
      }

      const isHeader = Boolean(rootEl.closest('header'));
      const magneticBtn = rootEl.closest(
        'button, .btn-primary, .btn-solid, .btn-ghost, .btn-magnetic, [data-cursor-merge="true"]'
      ) as HTMLElement | null;

      if (magneticBtn && !isHeader) {
        const rect = magneticBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        // Magnetic pull
        targetX = e.clientX + (btnCenterX - e.clientX) * 0.38;
        targetY = e.clientY + (btnCenterY - e.clientY) * 0.38;

        const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
        const halfW = rect.width / 2;

        // Full merge: < 28% of button half-width — both dot and ring hidden
        const fullyMerged = dist < halfW * 0.28;
        // Near zone: < 60% — only dot hides, ring stays
        const nearBtn = !fullyMerged && dist < halfW * 0.60;

        setIsMerged(fullyMerged);
        setIsNearBtn(nearBtn);
      } else {
        setIsMerged(false);
        setIsNearBtn(false);
      }

      xToDot(targetX); yToDot(targetY);
      xToRing(targetX); yToRing(targetY);

      // Only update label when not in scroll mode
      if (scrollPctRef.current === null) {
        const contextWord = rootEl ? getContextualLabel(rootEl) : null;
        if (contextWord) {
          setLabel(contextWord);
          setIsHover(true);
        } else {
          setIsHover(false);
          setLabel('');
        }
      }

      document.documentElement.dataset.cursorColor = getTargetCursorColor(rootEl as Element);
    };

    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0
        ? Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100)))
        : 0;

      scrollPctRef.current = pct;
      setIsScrollActive(true);
      setLabel(`${pct}%`);
      setIsHover(false); // don't show hover ring while scrolling

      const rootEl = document.elementFromPoint(lastPos.x, lastPos.y);
      if (rootEl) {
        document.documentElement.dataset.cursorColor = getTargetCursorColor(rootEl);
      }

      // Reset timer on every scroll event
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = window.setTimeout(() => {
        clearScrollState();
      }, 800); // 800ms after last scroll event
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    };
  }, []); // stable — no dependencies needed

  const shouldHideDot = isMerged || isNearBtn || isScrollActive || isHover;
  const shouldHideRing = isMerged; // ring only disappears on true merge

  return (
    <div data-magnetic-cursor>
      <div
        ref={dotRef}
        className={`cursor-dot ${shouldHideDot ? 'is-hidden' : ''}`}
      />
      <div
        ref={ringRef}
        className={[
          'cursor-ring',
          isHover && !isScrollActive ? 'is-hover' : '',
          isScrollActive ? 'is-scroll-active' : '',
          shouldHideRing ? 'is-merged' : '',
        ].filter(Boolean).join(' ')}
      >
        <span className="cursor-text">{label}</span>
      </div>
    </div>
  );
}
