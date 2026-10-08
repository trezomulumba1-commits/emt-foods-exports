import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { ZAMBIAN_WAREHOUSES, SAMPLE_CATEGORIES } from '../data';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

const PRESET_IMAGES = [
  {
    name: 'Dried Seafood',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9QEK1bcHZYhfvYHK7v9TlgNWusfUvJM-rZC_8QKsM9_BrHtBSym4EGMiTnH-i7XiumdAR-Sowa8TjmlMkIDC3npq7q8H1a4XThgszIaXJc_1US3YK1WcR5ATNJP1P_rgNmE4ANxnsPQOrVaA7KYnJ27oeOrlAaQgf2gMJw1rXOGkTBB-PCTtsLN7rMC8v5AWjV8weM16ZmILAivcJva9Imula16d6wOmnW7v0pcGqK8LlVGAxBBmnpRGx93MyzSJKaKsCyzi7M0M',
  },
  {
    name: 'Dried Whole Bream',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB43awMIiJTMSK_waO5Vhob1tRoJgBYgD_F39IFKHVqAjnM_1ILtPr6gkFzOfzsXx4D6KrCsOaBD_w1eKOuDhAm8k3hugLWW6t58V_uvYfzvLDfnnTO3jJFs8YC3qBqtQa58eftDf2jusXrYFJxLD28d3Rn0SVYo_mbDRDzGTPnK6u-lf9qgnPs2cGmrp6F5qMkUotn2hDGPrNM8dNRvEHBhzPYOq5U9TsBDnXyr4dyoRZpqoXjcDt8MuNb4Y5zj1jtkg0Jgpo28Nk',
  },
  {
    name: 'Premium Oil Barrel/Bottle',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV3obVhKvDxCupH8fMDw9xjjEkl0EH9p-ba0m8Wqn9O7TieqhKB0LE_n9vOeHY-L5Fm6qGTVb-eq5HpBq3iNLuaN2YGqZvdgNMzdsz_CDJ1F2IBHfo8CiiRQcXe6X9-qnh7_eKaLYJ1LDuJkalP7Rsv6BTusocjKbLRz2aUpnnkl6Pvn0dJT9_Yb3YhnM7SeeXCLzAtKq602UTlOFRoan0TWMRhc7JRrDF2oLwSVSSUHxOtCwwCyqE1PmeWvsB3-Nq6TfReBxXsg8',
  },
  {
    name: 'Grains & Agriculture',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCndcJWcKpc0Eig73hyoJqxl5SwariWVll-5K4-5wpkDucu0VkTJIIsIXzpQSgMndppQMeQc5H9HXFAQFryxZPU3g64yJYZasic6m3U6poGRp44VDLSdU4tQfBfkGEhyde-pi-JaseF3frJxnfGmjzrSmxftrIGmqboSiDujKQRkY9YQPLRVrjGNV7JjwYvdADaX754gTEbqBIrQduF-mD7NUXyWSpDb2pw-FfarwAsf7sSDyerWkaHW0Z3v0bbkGCyOxOIlyKx-w8',
  },
  {
    name: 'Traditional Fabrics',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvyaO7aNfMXgQByqwprC6Sa12cvP7TaiYag2MJhhLDH8nT-jCnIhEZHj2qGLRTChLIBoG9LfMRAPm2r5wiIZcRw55SjPQx00fqqo2F8rg5QSwPPdeLTATp2pPCHxLW_56aaDOkcqLCljSoXpev2ABCFfa_sncK9UFlsmOAQYh72tRScPy8w50CZdNeP-CQs1-NYQx8zqh91iOmUWyr39Qcb2x6DskfXIAHb_1DdV6s8cmAFlL3uawBJ-BGy26QMdlLdbOdabTK8fU',
  },
];

export default function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Dried Fish & Seafood');
  const [price, setPrice] = useState('');
  const [qualityGrade, setQualityGrade] = useState<'Premium A' | 'Standard B' | 'Choice C'>('Premium A');
  const [moisturePercent, setMoisturePercent] = useState('');
  const [warehouse, setWarehouse] = useState<'Lusaka' | 'Kitwe' | 'Ndola' | 'Livingstone'>('Lusaka');
  const [supplier, setSupplier] = useState('');
  const [harvestDate, setHarvestDate] = useState('2026-06-28');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isUsingCustomImage, setIsUsingCustomImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Product name is required.');
    if (!description.trim()) return setError('Please provide a product description.');
    if (!price || parseFloat(price) <= 0) return setError('Please specify a valid base price (greater than 0).');
    if (!supplier.trim()) return setError('Supplier name / cooperative is required.');

    // Generate custom code prefixes based on name
    const prefix = name.split(' ').map(word => word[0] || '').join('').toUpperCase().slice(0, 3);
    const sku = `${prefix || 'GP'}-${Math.floor(100 + Math.random() * 900)}`;
    const batchNumber = `${prefix || 'GP'}-2026-B${Math.floor(10 + Math.random() * 90)}`;

    const newProduct: Product = {
      id: String(Date.now()),
      sku,
      name: name.trim(),
      description: description.trim(),
      category,
      image: isUsingCustomImage && customImageUrl ? customImageUrl.trim() : selectedImage,
      price: parseFloat(price),
      qualityGrade,
      moisturePercent: moisturePercent ? parseFloat(moisturePercent) : undefined,
      batchNumber,
      warehouse,
      harvestDate,
      supplier: supplier.trim(),
      inspectionNotes: 'Initial registration. Subject to localized food quality standards check.',
    };

    onAddProduct(newProduct);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      resetForm();
      onClose();
    }, 1500);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('Dried Fish & Seafood');
    setPrice('');
    setQualityGrade('Premium A');
    setMoisturePercent('');
    setWarehouse('Lusaka');
    setSupplier('');
    setHarvestDate('2026-06-28');
    setSelectedImage(PRESET_IMAGES[0].url);
    setCustomImageUrl('');
    setIsUsingCustomImage(false);
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="add-goods-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl bg-surf border bt rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="bg-bg-2 border-b bt px-6 py-4 flex items-center justify-between">
              <div>
                <span className="mono t3 text-[9px] uppercase tracking-widest block mb-0.5">Supplier Onboarding</span>
                <h3 className="font-headline-sm uppercase text-t tracking-wider">Become an Export Partner - Apply</h3>
              </div>
              <button
                onClick={onClose}
                className="t2 hover:t transition-colors p-1 hover:bg-bg-3 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-tertiary animate-bounce" />
                  <h4 className="font-headline-md text-tertiary">Application Submitted!</h4>
                  <p className="text-on-surface-variant max-w-sm">
                    Your export partner application has been submitted successfully to our dispatch team. For simulation purposes, this commodity has been added to our global catalogue under "Pending Verification".
                  </p>
                </div>
              ) : (
                <form id="add-product-form" onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-error-container/20 border border-error text-error p-3 rounded flex items-center gap-2 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Basic Info Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Luapula Dried Bream Extra"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-outline-variant bg-surface-container-lowest px-3 py-2 rounded focus:outline-none focus:border-primary text-sm font-sans"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-outline-variant bg-surface-container-lowest px-3 py-2 rounded focus:outline-none focus:border-primary text-sm font-sans"
                      >
                        {SAMPLE_CATEGORIES.filter(c => c !== 'All Categories').map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      Product Description *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify high-grade biological characteristics, organic certification, packing information, or shipping states..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-outline-variant bg-surface-container-lowest px-3 py-2 rounded focus:outline-none focus:border-primary text-sm font-sans"
                      required
                    />
                  </div>

                  {/* Pricing and Quality parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Price (USD per kg / liter) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-sm text-on-surface-variant">$</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="4.50"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full border border-outline-variant bg-surface-container-lowest pl-7 pr-3 py-2 rounded focus:outline-none focus:border-primary text-sm font-sans"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Quality Level *
                      </label>
                      <select
                        value={qualityGrade}
                        onChange={(e) => setQualityGrade(e.target.value as any)}
                        className="w-full border border-outline-variant bg-surface-container-lowest px-3 py-2 rounded focus:outline-none focus:border-primary text-sm font-sans"
                      >
                        <option value="Premium A">Premium A (Export standard)</option>
                        <option value="Standard B">Standard B (Standard wholesale)</option>
                        <option value="Choice C">Choice C (Economy bulk)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Moisture Content (%) <span className="text-xs text-on-surface-variant font-normal">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 8.5"
                        value={moisturePercent}
                        onChange={(e) => setMoisturePercent(e.target.value)}
                        className="w-full border border-outline-variant bg-surface-container-lowest px-3 py-2 rounded focus:outline-none focus:border-primary text-sm font-sans"
                      />
                    </div>
                  </div>

                  {/* Logistics details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Stock Location *
                      </label>
                      <select
                        value={warehouse}
                        onChange={(e) => setWarehouse(e.target.value as any)}
                        className="w-full border border-outline-variant bg-surface-container-lowest px-3 py-2 rounded focus:outline-none focus:border-primary text-sm font-sans"
                      >
                        <option value="Lusaka">Lusaka Main Depot</option>
                        <option value="Kitwe">Kitwe Central Warehouse</option>
                        <option value="Ndola">Ndola Export Depot</option>
                        <option value="Livingstone">Livingstone Hub</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Source Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lake Kariba Co-op"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        className="w-full border border-outline-variant bg-surface-container-lowest px-3 py-2 rounded focus:outline-none focus:border-primary text-sm font-sans"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Prep Date *
                      </label>
                      <input
                        type="date"
                        value={harvestDate}
                        onChange={(e) => setHarvestDate(e.target.value)}
                        className="w-full border border-outline-variant bg-surface-container-lowest px-3 py-2 rounded focus:outline-none focus:border-primary text-sm font-sans"
                        required
                      />
                    </div>
                  </div>

                  {/* Image Selector / Custom URL */}
                  <div className="border-t border-outline-variant pt-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                      Select Premium Image Backdrop
                    </label>

                    <div className="flex items-center gap-4 mb-3">
                      <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input
                          type="radio"
                          checked={!isUsingCustomImage}
                          onChange={() => setIsUsingCustomImage(false)}
                          className="accent-primary"
                        />
                        Use Authentic High-Res Preset
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input
                          type="radio"
                          checked={isUsingCustomImage}
                          onChange={() => setIsUsingCustomImage(true)}
                          className="accent-primary"
                        />
                        Provide Custom URL
                      </label>
                    </div>

                    {!isUsingCustomImage ? (
                      <div className="grid grid-cols-5 gap-2">
                        {PRESET_IMAGES.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedImage(img.url)}
                            className={`relative aspect-square border-2 rounded overflow-hidden transition-all ${
                              selectedImage === img.url && !isUsingCustomImage
                                ? 'border-primary ring-2 ring-primary-container scale-95 shadow'
                                : 'border-outline-variant hover:border-primary/50'
                            }`}
                          >
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/70 text-[8px] text-white py-0.5 text-center truncate px-0.5">
                              {img.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-... or custom hotlink"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="w-full border border-outline-variant bg-surface-container-lowest px-3 py-2 rounded focus:outline-none focus:border-primary text-xs font-mono"
                      />
                    )}
                  </div>

                  {/* Business Notice */}
                  <div className="bg-surface-container p-4 rounded border border-outline-variant flex gap-3 text-xs text-on-surface-variant">
                    <FileText className="w-5 h-5 text-secondary shrink-0" />
                    <div>
                      <p className="font-bold text-on-surface mb-0.5">Regulatory Agreement Notice</p>
                      <p>
                        By submitting this product, you guarantee adherence to Zambian Ministry of Agriculture 
                        phytosanitary requirements and authorize pre-shipment lot sampling. Domestic taxes may be computed separately.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="border border-outline px-4 py-2 rounded text-sm hover:bg-surface-container transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#EAB308] text-black hover:bg-[#CA8A04] font-bold px-6 py-2 rounded text-sm hover:opacity-95 transition-all shadow active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-black" />
                      Submit Partner Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
