import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useI18n } from '../lib/i18n';

interface AnimatedCartProps {
  cart: Product[];
  onOpen?: () => void;
}

export default function AnimatedCart({ cart, onOpen }: AnimatedCartProps) {
  const { t } = useI18n();
  const count = cart.length;
  const prev = useRef<number>(count);
  const [popped, setPopped] = useState(false);

  // Compute a simple "volume" score for the cart based on product price or a
  // provided `volume` field when available. This is used to scale the visual box.
  const totalVolume = useMemo(() => {
    return cart.reduce((acc, it) => {
      // Prefer explicit dimension/volume if present
      const anyIt = it as any;
      if (anyIt.volume) return acc + Number(anyIt.volume || 1);
      // Fallback: scale from price so larger items make a bigger box
      return acc + Math.max(0.5, (it.price || 1) / 8);
    }, 0);
  }, [cart]);

  const scale = Math.min(1.6, Math.max(0.8, 0.8 + totalVolume * 0.08));

  useEffect(() => {
    if (prev.current !== count) {
      // Trigger a short pop animation
      setPopped(true);
      const t = setTimeout(() => setPopped(false), 420);
      prev.current = count;
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <div
      role="button"
      onClick={onOpen}
      className={`animated-cart fixed z-50 bottom-6 right-6 flex items-center gap-3 cursor-pointer select-none`}
      aria-label={`${t.cart?.open || 'Open cart'} (${count} ${count === 1 ? t.cart?.item || 'item' : t.cart?.items || 'items'})`}
      style={{ transform: `scale(${1})` }}
    >
      <div className={`cart-box ${popped ? 'is-pop' : ''}`} style={{ transform: `scale(${scale})` }}>
        <div className="cart-box-inner">
          <ShoppingBag className="w-5 h-5 text-a-text" />
        </div>
      </div>
      <div className="cart-meta">
        <div className="mono text-[10px] uppercase tracking-wider text-t3">{t.profile?.cart || 'Cart'}</div>
        <div className="serif font-medium text-sm">{count} {count === 1 ? t.cart?.item || 'item' : t.cart?.items || 'items'}</div>
      </div>
    </div>
  );
}
