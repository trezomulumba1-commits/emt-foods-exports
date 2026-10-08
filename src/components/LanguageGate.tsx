import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n, SupportedLang } from '../lib/i18n';

const LANGUAGES: { code: SupportedLang; label: string; region: string }[] = [
  { code: 'en', label: 'English', region: 'Global' },
  { code: 'fr', label: 'Français', region: 'Europe / Africa' },
  { code: 'sw', label: 'Kiswahili', region: 'East Africa' },
  { code: 'ar', label: 'العربية', region: 'Middle East' },
  { code: 'zh', label: '中文 (Mandarin)', region: 'Asia' },
  { code: 'pt', label: 'Português', region: 'Lusophone' },
  { code: 'de', label: 'Deutsch', region: 'Europe' },
];

export default function LanguageGate({ onComplete }: { onComplete: () => void }) {
  const { setLang, t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    const savedLang = localStorage.getItem('emt_lang');
    if (!savedLang) {
      setIsVisible(true);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleSelect = (code: SupportedLang) => {
    setSelected(code);
    setLang(code);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="language-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg t overflow-hidden"
        >
          {/* Background Ambient Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_30%)] opacity-[0.03]"
            />
          </div>

          <div className="relative z-10 max-w-2xl w-full px-6 text-center space-y-12">
            
            {/* Greeting Header */}
            <div className="space-y-4">
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mono t3 text-[10px] tracking-[0.3em] uppercase"
              >
                {t.auth?.brand || 'EMT Foods Exports'}
              </motion.div>
              
              <div className="serif text-4xl md:text-6xl font-light t leading-tight">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>Welcome</motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="t2">Karibu</motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="t3">Bienvenue</motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="t3">مرحبا</motion.div>
              </div>
            </div>

            {/* Language Selection Grid */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-2xl mx-auto"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  style={{ cursor: 'pointer' }}
                  className={`
                    relative overflow-hidden group border bt rounded-xl p-4 text-left transition-all duration-300
                    ${selected === lang.code
                      ? 'bg-[var(--accent)] border-transparent scale-95'
                      : 'bg-surf hover:border-[var(--accent)] hover:scale-[1.02]'
                    }
                  `}
                >
                  <div className="relative z-10">
                    <div className="mono text-[9px] uppercase tracking-widest opacity-50 mb-1">{lang.region}</div>
                    <div className={`serif text-base font-medium ${selected === lang.code ? 'text-white' : 't'}`}>{lang.label}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300" />
                </button>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.1, duration: 1 }}
              className="mono text-[9px] uppercase tracking-widest t3 mt-12"
            >
              {t.gate?.selectRegion || 'Select your region to continue'}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
