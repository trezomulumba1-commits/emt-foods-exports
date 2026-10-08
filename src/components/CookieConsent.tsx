import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';

import { useI18n } from '../lib/i18n';

export default function CookieConsent() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay before showing to not overwhelm on initial load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 p-4 z-50 pointer-events-none flex justify-center"
        >
          <div className="bg-surf dark:bg-bg border border-subtle shadow-2xl rounded-[24px] p-5 w-full max-w-xl pointer-events-auto flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-t text-sm mb-1">{t.cookie?.title || 'We use cookies'}</h4>
                <p className="text-t2 text-xs leading-relaxed max-w-sm">
                  {t.cookie?.desc || 'We use cookies to improve your browsing experience, serve personalized ads or content, and analyze our traffic.'}
                </p>
              </div>
            </div>

            <div className="flex w-full sm:w-auto gap-2 shrink-0">
              <button 
                onClick={handleDecline}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-subtle text-t2 font-bold text-xs hover:bg-surf dark:hover:bg-bg transition-colors"
              >
                {t.cookie?.decline || 'Decline'}
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-t dark:bg-bg text-t dark:text-t font-bold text-xs hover:scale-105 transition-transform shadow-md"
              >
                {t.cookie?.acceptAll || 'Accept All'}
              </button>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 p-2 text-t2 hover:text-t2 sm:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
