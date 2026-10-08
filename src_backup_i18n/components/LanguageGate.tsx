import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n, SupportedLang } from '../lib/i18n';

const LANGUAGES: { code: SupportedLang; label: string; region: string }[] = [
  { code: 'en', label: 'English', region: 'Global' },
  { code: 'fr', label: 'Français', region: 'Europe / Africa' },
  { code: 'zh', label: '中文 (Mandarin)', region: 'Asia' },
  { code: 'ar', label: 'العربية (Arabic)', region: 'Middle East' }
];

export default function LanguageGate({ onComplete }: { onComplete: () => void }) {
  const { setLang } = useI18n();
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
                EMT Foods Exports
              </motion.div>
              
              <div className="serif text-4xl md:text-6xl font-light t leading-tight">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>Welcome</motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="t2">Bienvenue</motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="t3">欢迎</motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="t3">مرحبا</motion.div>
              </div>
            </div>

            {/* Language Selection Grid */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`
                    relative overflow-hidden group border bt rounded-xl p-6 text-left transition-all duration-500
                    ${selected === lang.code ? 'bg-[var(--accent)] text-white border-transparent scale-95' : 'bg-surf hover:border-[var(--accent)] hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]'}
                  `}
                >
                  <div className="relative z-10">
                    <div className="mono text-[10px] uppercase tracking-widest opacity-60 mb-2">{lang.region}</div>
                    <div className="serif text-xl font-medium">{lang.label}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500" />
                </button>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.1, duration: 1 }}
              className="mono text-[9px] uppercase tracking-widest t3 mt-12"
            >
              Select your region to continue
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
