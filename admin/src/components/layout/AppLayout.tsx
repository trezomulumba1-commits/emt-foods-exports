import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Sidebar from './Sidebar';
import { LogOut, Bell, Menu } from 'lucide-react';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex bg-subtle text-primary">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-subtle bg-surface flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-subtle text-muted hover:text-primary hover:bg-subtle"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="font-semibold text-primary text-sm sm:text-base">EMT Operations</div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="text-muted hover:text-primary transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <button
              onClick={handleLogout}
              className="text-muted hover:text-primary text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
