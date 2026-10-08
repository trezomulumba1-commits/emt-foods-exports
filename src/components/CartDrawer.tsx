import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { useI18n } from '../lib/i18n';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Product[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const { t } = useI18n();
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-surf border-l bt h-full flex flex-col z-10 shadow-2xl overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b bt flex items-center justify-between bg-bg-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="serif text-xl font-bold t">{t.cart?.title || 'Your Export Cart'}</h3>
                  <span className="mono t3 text-[10px] uppercase tracking-wider">
                    {cart.length} {cart.length === 1 ? (t.cart?.item || 'item') : (t.cart?.items || 'items')} {t.cart?.selected || 'selected'}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-t2 hover:text-t hover:bg-bg-3 rounded-full transition-colors"
                aria-label={t.cart?.close || 'Close cart'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-bg-2 flex items-center justify-center text-t3 border bt">
                    <ShoppingBag className="w-8 h-8 opacity-40" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="serif text-lg font-medium t">{t.cart?.emptyTitle || 'Your cart is empty'}</h4>
                    <p className="t2 text-xs font-light max-w-xs">
                      {t.cart?.emptyDesc || 'Browse our catalog to add Zambian grains, dried goods, vegetable oils, and apparel to your export lot.'}
                    </p>
                  </div>
                </div>
              ) : (
                cart.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 p-3.5 rounded-xl border bt bg-bg-2 relative group hover:border-[var(--accent)]/40 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-bg-3 border bt shrink-0"
                    />
                    <div className="flex-1 min-w-0 pe-6">
                      <h4 className="font-semibold text-sm t truncate">{item.name}</h4>
                      <p className="t2 text-[11px] font-light line-clamp-1 mt-0.5">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="mono text-xs font-bold text-[var(--accent)]">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="mono t3 text-[9px] uppercase px-1.5 py-0.5 rounded bg-bg-3">
                          {item.qualityGrade || (t.cart?.gradeA || 'Grade A')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="absolute top-3.5 end-3.5 text-t3 hover:text-red-500 p-1 rounded-md transition-colors"
                      title={t.cart?.removeItem || 'Remove item'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t bt bg-bg-2 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs t2">
                    <span>{t.cart?.exportDocs || 'Export Customs & Documentation'}</span>
                    <span className="text-emerald-500 font-mono font-medium">{t.cart?.included || 'Included'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t bt">
                    <span className="serif text-lg font-bold t">{t.cart?.estimatedTotal || 'Estimated Total'}</span>
                    <span className="serif text-2xl font-black text-[var(--accent)]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] t3 mono bg-bg-3 p-2.5 rounded-lg border bt">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{t.cart?.guarantee || 'Certified phytosanitary and export handling guaranteed.'}</span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onCheckout();
                  }}
                  className="w-full btn-primary py-4 rounded-xl text-sm font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {t.cart?.checkout || 'Proceed to Checkout'} <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
