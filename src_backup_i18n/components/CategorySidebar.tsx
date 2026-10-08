import React from 'react';
import { SAMPLE_CATEGORIES } from '../data';
import { Product } from '../types';
import { LayoutGrid, Fish, Droplet, Wheat, Shirt, Package, CheckCircle2 } from 'lucide-react';

interface CategorySidebarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  products?: Product[];
}

export const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case 'All Categories':      return <LayoutGrid className="w-5 h-5" />;
    case 'Dried Fish & Seafood': return <Fish className="w-5 h-5" />;
    case 'Vegetable Oils':      return <Droplet className="w-5 h-5" />;
    case 'Grains & Seeds':      return <Wheat className="w-5 h-5" />;
    case 'Textiles & Apparel':  return <Shirt className="w-5 h-5" />;
    case 'Jerseys & Apparel':   return <Shirt className="w-5 h-5" />;
    default:                    return <Package className="w-5 h-5" />;
  }
};

export const getShortLabel = (cat: string) => {
  switch (cat) {
    case 'All Categories':      return 'ALL';
    case 'Dried Fish & Seafood': return 'FISH';
    case 'Vegetable Oils':      return 'OILS';
    case 'Grains & Seeds':      return 'GRAIN';
    case 'Textiles & Apparel':  return 'TEX';
    case 'Jerseys & Apparel':   return 'JRSY';
    default:                    return 'MISC';
  }
};

export default function CategorySidebar({ selectedCategory, setSelectedCategory, products = [] }: CategorySidebarProps) {
  const counts = React.useMemo(() => {
    const map: Record<string, number> = {};
    SAMPLE_CATEGORIES.forEach(c => map[c] = 0);
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    map['All Categories'] = products.length;
    return map;
  }, [products]);
  return (
    <aside className="w-full">
      <div className="md:sticky md:top-24 space-y-5">
        <div className="hidden md:block">
          <div className="mono text-[10px] uppercase tracking-widest text-emerald-500">Filter</div>
          <h3 className="serif text-3xl font-light t mt-1">Categories</h3>
        </div>

        {/* Mobile: Horizontal scrollable pills */}
        <nav className="flex md:hidden overflow-x-auto hide-scrollbar gap-2 pb-1">
          {SAMPLE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={`mobile-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-medium transition-all border ${
                  isSelected 
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' 
                    : 'bg-surf text-t2 border-[var(--border)] hover:bg-bg-2'
                }`}
              >
                <div className={isSelected ? 'text-white' : 'text-emerald-500'}>
                  {React.cloneElement(getCategoryIcon(cat) as React.ReactElement, { className: 'w-4 h-4' })}
                </div>
                {cat}
              </button>
            );
          })}
        </nav>

        {/* Desktop: Vertical stack of large detailed cards */}
        <nav className="hidden md:flex flex-col gap-3">
          {SAMPLE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={`desktop-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                style={isSelected ? {
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                  boxShadow: '0 0 0 2px #10b981, 0 8px 32px rgba(16,185,129,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                } : {}}
                className={`
                      group relative overflow-hidden flex flex-col items-start gap-3 p-5 rounded-3xl
                      transition-all duration-300 w-full border text-left cursor-pointer focus:outline-none
                  ${isSelected
                    ? 'text-white border-emerald-400/60 scale-[1.02]'
                    : 'bg-surf border-[var(--border)] hover:border-emerald-400/40 hover:bg-bg-2 text-t'
                  }
                `}
              >
                {isSelected && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)' }}
                  />
                )}

                <div className="flex items-center justify-between w-full">
                  <div className={`p-2.5 rounded-2xl transition-colors ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-bg-2 text-t3 group-hover:text-emerald-500'
                  }`}>
                    {getCategoryIcon(cat)}
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-white/90" />
                  ) : (
                    <span className="mono text-[9px] uppercase tracking-widest t3 opacity-50">
                      {getShortLabel(cat)}
                    </span>
                  )}
                </div>

                <div className="mt-auto space-y-1">
                  <span className={`block text-sm leading-tight ${isSelected ? 'font-semibold text-white' : 'font-light text-t'}`}>
                    {cat}
                  </span>
                  <div className="text-[11px] mt-1 font-light flex items-center gap-2">
                    <span className={`mono text-[10px] uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-t3'}`}>{counts[cat] ?? 0} items</span>
                  </div>
                  {(cat === 'Textiles & Apparel' || cat === 'Jerseys & Apparel') && (
                    <div className={`text-[11px] mt-1 font-light ${isSelected ? 'text-white/80' : 'text-t2'}`}>{cat === 'Jerseys & Apparel' ? 'Sports kits & branding' : 'Traditional & designer fabrics'}</div>
                  )}
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] text-white/80 mono uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse inline-block" />
                      Active
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
