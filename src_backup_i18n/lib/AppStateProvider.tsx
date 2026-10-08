import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import { Product, ExportOrder, ExportStatusUpdate, UserProfile } from '../types';
import { INITIAL_PRODUCTS } from '../data';

type AppState = {
  isDark: boolean;
  toggleTheme: () => void;
  products: Product[];
  exportOrders: ExportOrder[];
  exportStatusUpdates: ExportStatusUpdate[];
  isLoading: boolean;
  user: any;
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (v: boolean) => void;
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (v: boolean) => void;
  handleRemoveFromCart: (index: number) => void;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

const DOCUMENT_THEME_PROPS = [
  '--bg', '--bg-2', '--bg-3', '--surface', '--text', '--text-2', '--text-3',
  '--border', '--accent', '--accent-h', '--a-text', '--amber', '--tag-bg', '--tag-br'
];

const applyDocumentTheme = (isDarkTheme: boolean) => {
  const root = document.documentElement;
  DOCUMENT_THEME_PROPS.forEach(prop => root.style.removeProperty(prop));
  root.classList.toggle('dark', isDarkTheme);
  root.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
};

const vibrate = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [exportOrders, setExportOrders] = useState<ExportOrder[]>([]);
  const [exportStatusUpdates, setExportStatusUpdates] = useState<ExportStatusUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('emt-theme');
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : sysDark;
    setIsDark(dark);
    applyDocumentTheme(dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    applyDocumentTheme(next);
    localStorage.setItem('emt-theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data: p } = await supabase.from('products').select('*');
      if (p && p.length > 0) setProducts(p);
      const { data: eo } = await supabase.from('export_orders').select('*');
      if (eo) setExportOrders(eo);
      const { data: esu } = await supabase.from('export_status_updates').select('*');
      if (esu) setExportStatusUpdates(esu);
      setIsLoading(false);
    };
    fetch();

    const fetchProfile = async (userId: string) => {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) setProfile(data);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRemoveFromCart = (index: number) => {
    vibrate();
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <AppStateContext.Provider value={{
      isDark, toggleTheme,
      products, exportOrders, exportStatusUpdates, isLoading,
      user, profile, setProfile, isLoggedIn, isLoginModalOpen, setIsLoginModalOpen,
      cart, setCart, isCartDrawerOpen, setIsCartDrawerOpen, handleRemoveFromCart
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppStateProvider');
  }
  return context;
};
