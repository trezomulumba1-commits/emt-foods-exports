import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import MagneticCursor from './components/MagneticCursor';
import TouchCursor from './components/TouchCursor';
import CookieConsent from './components/CookieConsent';
import LoginModal from './components/LoginModal';
import LanguageGate from './components/LanguageGate';
import { useApp } from './lib/AppStateProvider';
import { recordBusinessActivity } from './lib/business';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ShipPage from './pages/ShipPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const { 
    isDark, toggleTheme, isLoggedIn, 
    isLoginModalOpen, setIsLoginModalOpen,
    cart, isCartDrawerOpen, setIsCartDrawerOpen, handleRemoveFromCart 
  } = useApp();

  const [hasSelectedLanguage, setHasSelectedLanguage] = React.useState(
    () => !!localStorage.getItem('emt_lang')
  );

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const vibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <>
      <LanguageGate onComplete={() => setHasSelectedLanguage(true)} />
      
      {hasSelectedLanguage && (
        <div className="bg-t t min-h-screen font-sans flex flex-col pb-20 md:pb-0">
      <Navbar
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isDark={isDark}
        onToggleTheme={() => { vibrate(); toggleTheme(); }}
        isLoggedIn={isLoggedIn}
        onOpenCart={() => setIsCartDrawerOpen(true)}
      />

      {/* Cursor components */}
      <MagneticCursor />
      <TouchCursor />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartDrawerOpen(false);
          // router handle in CartDrawer or navigate
        }}
      />

      <main className="flex-1 pt-[68px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog/*" element={<CatalogPage />} />
          <Route path="/ship" element={<ShipPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignInSuccess={() => {
          setIsLoginModalOpen(false);
          vibrate();
          recordBusinessActivity('User login', 'Account authenticated');
        }}
      />
      <CookieConsent />
    </div>
    )}
    </>
  );
}
