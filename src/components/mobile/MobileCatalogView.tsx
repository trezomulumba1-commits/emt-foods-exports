import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { useI18n } from '../../lib/i18n';

interface MobileCatalogProps {
  products: Product[];
  isLoading: boolean;
  onSelectProduct: (p: Product) => void;
}

export default function MobileCatalogView({ products, isLoading, onSelectProduct }: MobileCatalogProps) {
  const { t } = useI18n();
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-bg-2 rounded border bt animate-pulse h-24 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
        <p className="font-mono text-sm uppercase">{t.sidebar?.emptyProducts || 'No products found.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {products.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onSelectProduct(item)}
          className="grid grid-cols-[40px_1fr] gap-4 py-6 border-b bt items-start cursor-pointer active:bg-border/10"
        >
          <div className="font-mono text-[10px] tracking-wider opacity-50 pt-1">
            {String(idx + 1).padStart(2, '0')}
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="serif font-black text-xl leading-none truncate">
              {item.name}
            </h3>
            <p className="font-sans text-[0.85rem] leading-[1.6] text-t2 line-clamp-2">
              {item.description}
            </p>
            <div className="flex justify-between items-center mt-2 font-mono text-[10px] tracking-wider text-t3 uppercase">
              <span>${item.price.toFixed(2)}</span>
              <span className="text-lg">→</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
