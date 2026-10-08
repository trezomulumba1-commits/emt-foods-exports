import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import en, { TranslationKeys } from './translations/en';
import fr from './translations/fr';
import zh from './translations/zh';
import ar from './translations/ar';
import pt from './translations/pt';
import de from './translations/de';
import sw from './translations/sw';

export type SupportedLang = 'en' | 'fr' | 'zh' | 'ar' | 'pt' | 'de' | 'sw';

const TRANSLATIONS: Record<SupportedLang, TranslationKeys> = { en, fr, zh, ar, pt, de, sw };

// Maps our language keys to standard Intl locales for number formatting
const INTL_LOCALES: Record<SupportedLang, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  zh: 'zh-CN',
  ar: 'ar-AE',
  pt: 'pt-BR',
  de: 'de-DE',
  sw: 'sw-KE',
};

type I18nContextType = {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: TranslationKeys;
  isRTL: boolean;
  formatCurrency: (value: number) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<SupportedLang>(() => {
    const saved = localStorage.getItem('emt_lang');
    return (saved as SupportedLang) || 'en';
  });

  const setLang = useCallback((newLang: SupportedLang) => {
    setLangState(newLang);
    localStorage.setItem('emt_lang', newLang);
  }, []);

  const isRTL = lang === 'ar';

  // Apply RTL direction to the document
  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang, isRTL]);

  const t = TRANSLATIONS[lang] || en;

  // Currency formatter using Intl API tied to current language
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat(INTL_LOCALES[lang] || 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL, formatCurrency }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
