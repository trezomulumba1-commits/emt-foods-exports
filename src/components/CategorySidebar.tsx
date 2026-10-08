import React from 'react';
import { SAMPLE_CATEGORIES } from '../data';
import { Product } from '../types';
import { useI18n } from '../lib/i18n';
import { LayoutGrid, Fish, Droplet, Wheat, Shirt, Package, CheckCircle2, LucideProps } from 'lucide-react';

interface CategorySidebarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  products?: Product[];
}

export const getCategoryIcon = (cat: string): React.ComponentType<LucideProps> => {
  switch (cat) {
    case 'All Categories':      return LayoutGrid;
    case 'Dried Fish & Seafood': return Fish;
    case 'Vegetable Oils':      return Droplet;
    case 'Grains & Seeds':      return Wheat;
    case 'Textiles & Apparel':  return Shirt;
    case 'Jerseys & Apparel':   return Shirt;
    default:                    return Package;
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
  const { t } = useI18n();
  const catToKey = (c: string) => {
    switch (c) {
      case 'All Categories': return 'catAll';
      case 'Dried Fish & Seafood': return 'catFish';
      case 'Vegetable Oils': return 'catOils';
      case 'Grains & Seeds': return 'catGrains';
      case 'Textiles & Apparel': return 'catTextiles';
      case 'Jerseys & Apparel': return 'catJerseys';
      default: return 'catMisc';
    }
  };
  const catToShort = (c: string) => {
    switch (c) {
      case 'All Categories': return 'shortAll';
      case 'Dried Fish & Seafood': return 'shortFish';
      case 'Vegetable Oils': return 'shortOils';
      case 'Grains & Seeds': return 'shortGrains';
      case 'Textiles & Apparel': return 'shortTextiles';
      case 'Jerseys & Apparel': return 'shortJerseys';
      default: return 'shortMisc';
    }
  };

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
          <div className="mono text-[10px] uppercase tracking-widest text-emerald-500">{t.sidebar?.filter || 'Filter'}</div>
          <h3 className="serif text-3xl font-light t mt-1">{t.sidebar?.categories || 'Categories'}</h3>
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
                  {(() => { const Icon = getCategoryIcon(cat); return <Icon className="w-4 h-4" />; })()}
                </div>
                {(t.sidebar as any)?.[catToKey(cat)] || cat}
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
                  background: 'linear-gradient(135deg, var(--category-dark) 0%, var(--category-primary) 50%, var(--category-light) 100%)',
                  boxShadow: '0 0 0 2px var(--category-primary), 0 8px 32px rgba(16,185,129,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
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
                    {(() => { const Icon = getCategoryIcon(cat); return <Icon className="w-5 h-5" />; })()}
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-white/90" />
                  ) : (
                    <span className="mono text-[9px] uppercase tracking-widest t3 opacity-50">
                      {(t.sidebar as any)?.[catToShort(cat)] || getShortLabel(cat)}
                    </span>
                  )}
                </div>

                <div className="mt-auto space-y-1">
                  <span className={`block text-sm leading-tight ${isSelected ? 'font-semibold text-white' : 'font-light text-t'}`}>
                    {(t.sidebar as any)?.[catToKey(cat)] || cat}
                  </span>
                  <div className="text-[11px] mt-1 font-light flex items-center gap-2">
                    <span className={`mono text-[10px] uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-t3'}`}>{counts[cat] ?? 0} {t.sidebar?.itemsCount || 'items'}</span>
                  </div>
                  {(cat === 'Textiles & Apparel' || cat === 'Jerseys & Apparel') && (
                    <div className={`text-[11px] mt-1 font-light ${isSelected ? 'text-white/80' : 'text-t2'}`}>{cat === 'Jerseys & Apparel' ? (t.sidebar?.sportsKits || 'Sports kits & branding') : (t.sidebar?.fabricsDesc || 'Traditional & designer fabrics')}</div>
                  )}
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] text-white/80 mono uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse inline-block" />
                      {t.sidebar?.active || 'Active'}
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
