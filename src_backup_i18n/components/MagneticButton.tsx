import React, { useRef } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.38,
  onClick,
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const distanceX = e.clientX - btnCenterX;
    const distanceY = e.clientY - btnCenterY;

    // Physically translate button toward cursor position
    gsap.to(btn, {
      x: distanceX * strength,
      y: distanceY * strength,
      rotate: distanceX * 0.03,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;

    // Elastic spring back to origin
    gsap.to(btn, {
      x: 0,
      y: 0,
      rotate: 0,
      duration: 0.65,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`btn-magnetic select-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
