import React, { useState } from 'react';
import CategorySidebar from '../components/CategorySidebar';
import GenericCategoryView from '../components/categories/GenericCategoryView';
import MobileCatalogView from '../components/mobile/MobileCatalogView';
import { INITIAL_PRODUCTS } from '../data';
import { Product } from '../types';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORY_CONTENT: Record<string, { title: string, subtitle: string, image: string }> = {
  'All Categories': {
    title: 'Directly Sourced Lines.',
    subtitle: 'Explore our complete catalog of premium Zambian exports. Every product is rigorously vetted and packaged for global compliance.',
    image: '/images/Afrohemian.jpg'
  },
  'Grains & Seeds': {
    title: 'Farm-Origin Grains & Seeds.',
    subtitle: 'Premium lots sourced directly from Zambian growers. Triple-cleaned, sorted, and certified for cross-border export.',
    image: '/floating_seeds.png'
  },
  'Vegetable Oils': {
    title: 'Pure Extracted Oils.',
    subtitle: 'Cold-pressed and refined oils sourced from sustainable farms. Export-ready in industrial and retail packaging.',
    image: '/floating_seeds.png'
  },
  'Jerseys & Apparel': {
    title: 'Custom Athletic Apparel.',
    subtitle: 'High-performance jerseys and statement pieces. Blending traditional patterns with modern manufacturing.',
    image: '/images/farigirl.png'
  },
  'Textiles & Apparel': {
    title: 'Premium Chitenge & Fabrics.',
    subtitle: 'Design-led textiles woven with rich history. Available in wholesale lots for fashion and interior designers.',
    image: '/images/Afrohemian.jpg'
  },
  'Dried Fish & Seafood': {
    title: 'Preserved Zambian Seafood.',
    subtitle: 'Authentic tastes from local waters. Carefully dried, fumigated, and packed to meet strict international standards.',
    image: '/dried_goods.png'
  },
  'Generic': {
    title: 'Corporate Catalog.',
    subtitle: 'Premium Zambian goods ready for the world.',
    image: '/air_freight_cargo.png'
  }
};

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number, customization?: string}[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState('');

  const filtered = selectedCategory === 'All Categories'
    ? INITIAL_PRODUCTS
    : INITIAL_PRODUCTS.filter(p => p.category === selectedCategory);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === selectedProduct.id && item.customization === customization);
      if (existing) {
        return prev.map(item =>
          (item.product.id === selectedProduct.id && item.customization === customization)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product: selectedProduct, quantity, customization }];
    });
    setSelectedProduct(null);
    setQuantity(1);
    setCustomization('');
    setIsCartOpen(true);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="bg-t min-h-screen pt-24 text-t font-sans transition-colors duration-300">

      {/* Floating cart button */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 btn-magnetic btn-solid hidden md:flex items-center gap-2 shadow-2xl rounded-full px-5 py-3"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{cartItems.length}</span>
        </button>
      )}

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        {/* Dynamic Category Banner */}
        <div className="mb-12 relative rounded-3xl overflow-hidden bg-bg-2 border bt shadow-sm">
          <div className="absolute inset-0 z-0">
            <img 
              src={(CATEGORY_CONTENT[selectedCategory] || CATEGORY_CONTENT['Generic']).image} 
              alt={selectedCategory} 
              className="w-full h-full object-cover opacity-20 mix-blend-overlay transition-opacity duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-transparent" />
          </div>
          <div className="relative z-10 p-10 md:p-16 max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">
              Catalog / {selectedCategory}
            </div>
            <h1 className="serif font-black text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-t mb-4">
              {(CATEGORY_CONTENT[selectedCategory] || CATEGORY_CONTENT['Generic']).title}
            </h1>
            <p className="text-t2 text-sm md:text-base leading-relaxed max-w-lg">
              {(CATEGORY_CONTENT[selectedCategory] || CATEGORY_CONTENT['Generic']).subtitle}
            </p>
          </div>
        </div>

        {/* Sidebar + Products */}
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-64 shrink-0">
            <CategorySidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="hidden md:block">
              <GenericCategoryView
                products={filtered}
                isLoading={false}
                onSelectProduct={(p) => { setSelectedProduct(p); setQuantity(1); setCustomization(''); }}
              />
            </div>
            <div className="block md:hidden">
              <MobileCatalogView
                products={filtered}
                isLoading={false}
                onSelectProduct={(p) => { setSelectedProduct(p); setQuantity(1); setCustomization(''); }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg/80 backdrop-blur-md"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surf border bt p-6 md:p-8 max-w-4xl w-full rounded-2xl relative shadow-2xl z-10 max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 font-mono text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100 flex items-center gap-2 text-t"
              >
                Close <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div>
                  <div className="bg-bg-2 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center p-8 mb-6 border bt">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-bg border bt p-5 rounded-xl">
                    <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-t3 mb-3">Required Documentation</h4>
                    <ul className="text-xs text-t2 space-y-2">
                      <li className="flex items-center gap-2">✓ Commercial Invoice & Packing List</li>
                      <li className="flex items-center gap-2">✓ Certificate of Origin</li>
                      {selectedProduct.category === 'Dried Fish & Seafood' && (
                        <li className="flex items-center gap-2">✓ Phytosanitary Certificate & Fumigation</li>
                      )}
                      {selectedProduct.category === 'Grains & Seeds' && (
                        <li className="flex items-center gap-2">✓ Phytosanitary Certificate</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="font-mono text-[11px] tracking-wider text-t3 uppercase mb-2">
                    {selectedProduct.category} — {selectedProduct.qualityGrade}
                  </p>
                  <h3 className="serif font-black text-[2rem] leading-none mb-4 text-t">{selectedProduct.name}</h3>
                  <p className="text-t2 text-sm leading-relaxed mb-6">{selectedProduct.description}</p>

                  {selectedProduct.category === 'Jerseys & Apparel' && (
                    <div className="mb-6">
                      <label className="font-mono text-[10px] tracking-wider uppercase text-t3 block mb-2">Print / Customization</label>
                      <textarea
                        value={customization}
                        onChange={(e) => setCustomization(e.target.value)}
                        placeholder="Enter jersey numbers, names, or branding requirements..."
                        className="w-full bg-bg border bt rounded-lg p-4 text-sm text-t focus:outline-none focus:border-accent h-24 resize-none"
                      />
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-center justify-between border-y bt py-5 mb-5">
                      <div className="flex items-center gap-3 bg-bg border bt rounded-lg p-1">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 rounded text-t hover:bg-border"><Minus className="w-4 h-4" /></button>
                        <span className="font-mono text-sm w-8 text-center text-t">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="p-2 rounded text-t hover:bg-border"><Plus className="w-4 h-4" /></button>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[10px] tracking-wider text-t3 uppercase mb-1">Total</p>
                        <p className="font-mono font-medium text-2xl text-t">${(selectedProduct.price * quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <button data-cursor="Add" onClick={handleAddToCart} className="w-full btn-magnetic btn-solid justify-center">
                      Add to Shipment <span className="arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[70] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-surf h-full border-l bt shadow-2xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-6 border-b bt">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-t3" />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-t">Shipment Manifest</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="opacity-60 hover:opacity-100 text-t"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <p className="text-t3 font-mono text-sm text-center mt-10 uppercase">Manifest is empty</p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 border-b bt pb-6">
                      <div className="w-20 h-20 bg-bg-2 rounded-lg p-2 shrink-0 border bt">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="serif font-bold text-lg leading-tight mb-1 text-t">{item.product.name}</h4>
                        <p className="font-mono text-[10px] text-t3 uppercase mb-2">Qty: {item.quantity}</p>
                        {item.customization && <p className="text-xs text-t3 italic line-clamp-1 mb-2">"{item.customization}"</p>}
                        <p className="font-mono text-sm text-t">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t bt bg-bg-2">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[11px] tracking-wider uppercase text-t3">Estimated Total</span>
                  <span className="font-mono text-xl text-t">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  disabled={cartItems.length === 0}
                  className="w-full btn-magnetic btn-solid justify-center disabled:opacity-50"
                >
                  Proceed to Checkout <span className="arrow">→</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
