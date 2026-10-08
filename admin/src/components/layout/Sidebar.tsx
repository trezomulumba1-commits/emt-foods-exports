import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Truck, MessageSquare, Settings, X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Shipments', path: '/orders', icon: Truck },
  { name: 'Enquiries', path: '/enquiries', icon: MessageSquare },
  { name: 'Settings', path: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose = () => {} }: SidebarProps) {
  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-subtle text-primary' : 'text-muted hover:text-primary hover:bg-subtle'
    }`;

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-subtle">
        <span className="font-bold tracking-tight text-primary">EMT Operations</span>
        <button
          type="button"
          onClick={onClose}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-primary hover:bg-subtle"
          aria-label="Close navigation menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={navClassName}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </div>
    </>
  );

  return (
    <>
      <div className="hidden md:flex md:w-72 md:border-r md:border-subtle md:bg-surface md:h-screen md:sticky md:top-0">
        <div className="w-full flex flex-col">{sidebarContent}</div>
      </div>

      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-subtle bg-surface flex flex-col transition-transform md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
