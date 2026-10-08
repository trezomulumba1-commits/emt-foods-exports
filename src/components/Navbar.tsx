import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, Send, User, Mail, Sun, Moon, Globe } from 'lucide-react';
import { useI18n, SupportedLang } from '../lib/i18n';

interface NavbarProps {
  onOpenLoginModal: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isLoggedIn: boolean;
  onOpenCart?: () => void;
}

export default function Navbar({ onOpenLoginModal, isDark, onToggleTheme, isLoggedIn, onOpenCart }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { t, lang, setLang } = useI18n();
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (path: string) => {
    if (path === 'login') { onOpenLoginModal(); return; }
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path: string) => location.pathname === path;

  /* ── Solid, always-visible nav background ───────────────────────
     Light mode: white with subtle shadow
     Dark mode:  deep dark with subtle shadow
     When scrolled: stronger shadow / border for depth
  ────────────────────────────────────────────────────────────────── */
  const navBg = isDark
    ? 'bg-[var(--nav-dark)] border-[rgba(244,244,244,0.12)]'
    : 'bg-[var(--nav-light)] border-[rgba(17,17,17,0.10)]';

  const shadowClass = scrolled ? 'shadow-lg' : 'shadow-sm';

  /* ── Text colors always contrast against the nav bg ── */
  const textColor   = isDark ? 'text-[var(--nav-text-light)]'             : 'text-[var(--nav-text-dark)]';
  const mutedColor  = isDark ? 'text-[rgba(244,244,244,0.6)]' : 'text-[rgba(17,17,17,0.55)]';
  const hoverColor  = isDark ? 'hover:text-[var(--nav-text-light)]'        : 'hover:text-[var(--nav-text-dark)]';
  const accentColor = isDark ? 'text-[var(--nav-accent-dark)]'              : 'text-[var(--nav-accent-light)]';

  /* ── Mobile Inverted Navigation ── */
  const mobileNavBg = isDark
    ? 'bg-[var(--nav-light)] border-[rgba(17,17,17,0.10)]'
    : 'bg-[var(--nav-dark)] border-[rgba(244,244,244,0.12)]';
    
  const mobileTextColor = isDark ? 'text-[var(--nav-text-dark)]' : 'text-[var(--nav-text-light)]';
  const mobileThemeBtn = isDark 
    ? 'border-[rgba(17,17,17,0.15)] text-[rgba(17,17,17,0.5)]'
    : 'border-[rgba(244,244,244,0.2)] text-[rgba(244,244,244,0.7)]';

  /* Mobile pill (Inverted) */
  const pillBg = isDark
    ? 'bg-[var(--nav-light)]/95 border-[rgba(17,17,17,0.12)]'
    : 'bg-[var(--nav-dark)]/95 border-[rgba(244,244,244,0.14)]';
  const pillText  = isDark ? 'text-[rgba(17,17,17,0.45)]' : 'text-[rgba(244,244,244,0.55)]';
  const pillActive = isDark ? 'text-[var(--nav-accent-light)]' : 'text-[var(--nav-accent-dark)]';

  const NavLink = ({ path, label }: { path: string; label: string }) => (
    <button
      onClick={() => go(path)}
      className={`text-[11px] font-mono uppercase tracking-[0.14em] transition-all duration-200
        ${isActive(path) ? `${accentColor} font-bold` : `${mutedColor} ${hoverColor}`}`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* ── Desktop Header ── */}
      <header
        className={`hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between
          px-8 py-3.5 border-b transition-all duration-300 ${navBg} ${shadowClass}`}
      >
        {/* Logo */}
        <div
          onClick={() => go('/')}
          className={`font-black text-[15px] tracking-[0.1em] cursor-pointer transition-opacity hover:opacity-60
            font-['Montserrat',sans-serif] ${textColor}`}
        >
          EMT FOODS
        </div>

        {/* Center: Products pill */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => go('/catalog')}
            className={`text-[10px] font-mono font-bold uppercase tracking-[0.18em] px-6 py-2 rounded-full
              transition-all duration-200 border
              ${isDark
                ? 'bg-[var(--nav-text-light)] text-[var(--nav-dark)] border-transparent hover:bg-white shadow-md'
                : 'bg-[var(--nav-text-dark)] text-white border-transparent hover:bg-[var(--nav-accent-light)] shadow-md'
              }`}
          >
            {t.nav.products}
          </button>
        </div>

        {/* Right: nav links + theme toggle */}
        <nav className="flex gap-5 items-center">
          <NavLink path="/ship"    label={t.nav.export}  />
          <NavLink path="/contact" label={t.nav.contact} />
          <NavLink path="/profile" label={isLoggedIn ? t.nav.profile : t.nav.login} />

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200
                ${isDark
                  ? 'border-[rgba(244,244,244,0.2)] text-[rgba(244,244,244,0.7)] hover:text-[var(--nav-text-light)]'
                  : 'border-[rgba(17,17,17,0.15)] text-[rgba(17,17,17,0.5)] hover:text-[var(--nav-text-dark)]'
                }`}
              title={t.nav?.changeLang || 'Change language'}
            >
              <Globe className="w-3.5 h-3.5" />
            </button>
            {showLangMenu && (
              <div className={`absolute right-0 top-full mt-2 border bt rounded-xl shadow-2xl overflow-hidden z-50 min-w-[140px] ${isDark ? 'bg-[var(--nav-dark)]' : 'bg-[var(--nav-light)]'}`}>
                {(['en', 'fr', 'zh', 'ar', 'pt', 'de', 'sw'] as SupportedLang[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => { setLang(code); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors
                      ${lang === code ? 'text-[var(--accent)] font-bold' : `${mutedColor} ${hoverColor}`}
                      hover:bg-[var(--bg-2)]`}
                  >
                    {{ en: 'English', fr: 'Français', zh: '中文', ar: 'العربية', pt: 'Português', de: 'Deutsch', sw: 'Kiswahili' }[code]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={t.nav?.toggleTheme || 'Toggle theme'}
            aria-label={t.nav?.toggleTheme || 'Toggle theme'}
            className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200
              ${isDark
                ? 'border-[rgba(244,244,244,0.2)] text-[rgba(244,244,244,0.7)] hover:text-[var(--nav-text-light)] hover:border-[rgba(244,244,244,0.45)]'
                : 'border-[rgba(17,17,17,0.15)] text-[rgba(17,17,17,0.5)] hover:text-[var(--nav-text-dark)] hover:border-[rgba(17,17,17,0.35)]'
              }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </nav>
      </header>

      {/* ── Mobile Top Header ── */}
      <header
        className={`flex md:hidden fixed top-0 left-0 right-0 z-50 items-center justify-between
          px-5 py-3.5 border-b transition-all duration-300 ${mobileNavBg} ${shadowClass}`}
      >
        <div
          onClick={() => go('/')}
          className={`font-black text-[14px] tracking-[0.1em] cursor-pointer font-['Montserrat',sans-serif] ${mobileTextColor}`}
        >
          EMT FOODS
        </div>

        <button
          onClick={onToggleTheme}
          title={t.nav?.toggleTheme || 'Toggle theme'}
          aria-label={t.nav?.toggleTheme || 'Toggle theme'}
          className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 ${mobileThemeBtn}`}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </header>

      {/* ── Mobile Bottom Pill Nav ── */}
      <nav
        className={`flex md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50
          backdrop-blur-2xl border rounded-full shadow-2xl px-7 py-3
          items-center gap-7 transition-all duration-300 ${pillBg}`}
      >
        {[
          { path: '/',        Icon: Home,    label: t.nav.home    },
          { path: '/catalog', Icon: Package, label: t.nav.shop    },
          { path: '/ship',    Icon: Send,    label: t.nav.export  },
          { path: '/contact', Icon: Mail,    label: t.nav.contact },
          { path: '/profile', Icon: User,    label: isLoggedIn ? t.nav.profile : t.nav.login },
        ].map(({ path, Icon, label }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => go(path === '/profile' && !isLoggedIn ? 'login' : path)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200
                ${active ? pillActive : pillText}`}
            >
              <Icon className={`transition-all duration-200 ${active ? 'w-5 h-5' : 'w-[18px] h-[18px]'}`} />
              <span className="text-[8px] font-mono uppercase tracking-widest leading-none">{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
