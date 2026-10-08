import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import MobileCatalogView from '../mobile/MobileCatalogView';
import { useI18n } from '../../lib/i18n';

interface ViewProps {
  products: Product[];
  isLoading: boolean;
  onSelectProduct: (p: Product) => void;
}

export default function GenericCategoryView({ products, isLoading, onSelectProduct }: ViewProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-48 md:h-56 bg-bg-2 rounded-2xl border bt" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="bg-bg-2 border bt rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="mono t3 text-[10px] uppercase tracking-[0.2em]">{t.catalog.verifiedLots}</div>
          <h2 className="serif text-4xl md:text-5xl font-light t tracking-tight">
            {t.catalog.headerTitle}
          </h2>
          <p className="t2 text-sm font-light max-w-lg leading-relaxed">
            {t.catalog.headerDesc}
          </p>
        </div>
        <div className="relative z-10 shrink-0 flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-surf border bt mono text-xs t font-medium">
            {products.length} {t.catalog.productsAvailable}
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-surf border bt rounded-2xl space-y-3">
          <p className="t2 text-base font-light">{t.catalog.noProducts}</p>
          <p className="t3 text-xs mono">{t.catalog.noProductsHint}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((item) => {
            const isFabric = item.category.includes('Apparel') || item.category.includes('Textiles');
            const hasNoImage = !item.image || item.image.includes('example.com') || item.image.includes('placeholder');

            return (
              <motion.div
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => onSelectProduct(item)}
                className="group cursor-pointer bg-surf rounded-2xl overflow-hidden border bt hover:border-[var(--accent)] transition-all shadow-sm flex flex-col md:flex-row min-h-[220px]"
              >
                {/* Left: Image / Fallback */}
                <div className="w-full md:w-[260px] h-[220px] md:h-auto relative bg-bg-2 shrink-0 overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r bt">
                  {hasNoImage ? (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${isFabric ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black' : 'bg-gradient-to-br from-[var(--bg-3)] to-[var(--bg)]'}`}>
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]"></div>
                      <div className={`mono text-[9px] uppercase tracking-[0.3em] mb-2 z-10 ${isFabric ? 'text-white/60' : 't3'}`}>
                        {item.category}
                      </div>
                      <h3 className={`serif text-2xl font-black leading-tight z-10 uppercase ${isFabric ? 'text-white' : 't'}`}>
                        {item.name}
                      </h3>
                      {isFabric ? (
                        <div className="mt-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded border border-white/20 mono text-[9px] text-black font-bold uppercase z-10">
                          {t.common.premiumTextile || 'Premium Textile'}
                        </div>
                      ) : (
                        <div className="mt-4 px-3 py-1 bg-surf rounded border bt mono text-[9px] t2 uppercase z-10">
                          {t.common.originVerified || 'Origin Verified'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>

                {/* Middle: Details */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                  <div>
                    <div className="mono text-[10px] text-t3 uppercase tracking-wider mb-2">{item.category}</div>
                    <h3 className="serif text-2xl font-bold t group-hover:text-[var(--accent)] transition-colors mb-3">
                      {item.name}
                    </h3>
                    <p className="t2 text-sm font-light leading-relaxed line-clamp-3 md:line-clamp-2 max-w-2xl">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-6 text-[11px] mono">
                    <span className="bg-bg-2 t2 px-2.5 py-1.5 rounded-md border bt font-medium">
                      {item.qualityGrade || (t.common.gradeA || 'Grade A')}
                    </span>
                    <span className="bg-bg-2 t2 px-2.5 py-1.5 rounded-md border bt font-medium">
                      Ships from Lusaka
                    </span>
                  </div>
                </div>

                {/* Right: Pricing & Action */}
                <div className="w-full md:w-[220px] shrink-0 p-6 flex flex-col justify-center items-end md:items-center text-right md:text-center border-t md:border-t-0 md:border-l bt bg-bg-2/30">
                  <div className="w-full">
                    <div className="t3 text-[10px] mono uppercase tracking-wider mb-1">Price</div>
                    <div className="serif text-3xl font-bold t mb-6">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    <button className="w-full btn-primary py-3 rounded-lg text-xs shadow-md shadow-[var(--accent)]/10 hover:shadow-[var(--accent)]/30 transition-all">
                      {t.common.viewDetails || 'View Details →'}
                    </button>
                    <div className="mt-3 text-[10px] t3 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      In Stock & Ready
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
