import { useEffect, useState, FormEvent, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../types';
import { LIMITS, sanitize } from '../../../src/lib/security';
import { Plus, Trash2, ImagePlus, X, Check } from 'lucide-react';

const CATEGORIES = [
  'Dried Foods',
  'Dried Fish & Seafood',
  'Grains & Seeds',
  'Veg Oils',
  'Jerseys',
  'Other',
];

const QUALITY_GRADES = ['Premium A', 'Grade A', 'Grade B', 'Standard'];
const WAREHOUSES = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone'];

function generateSKU(category: string): string {
  const prefix = category.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3);
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `EMT-${prefix}-${suffix}${timestamp}`;
}

const blankDraft = {
  name: '',
  category: 'Dried Foods',
  price: '',
  image: '',
  description: '',
  qualityGrade: 'Premium A',
  batchNumber: '',
  warehouse: 'Lusaka',
  supplier: '',
  harvestDate: new Date().toISOString().slice(0, 10),
};

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ ...blankDraft });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleImageSelect = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let imageUrl = '';

    if (imageFile) {
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      } catch (err: any) {
        alert(`Image upload failed: ${err.message}`);
        setSaving(false);
        return;
      }
    }

    const sku = generateSKU(draft.category);

    const payload: Product = {
      id: crypto.randomUUID(),
      sku,
      name: sanitize(draft.name, LIMITS.MEDIUM),
      description: sanitize(draft.description, LIMITS.LONG),
      category: sanitize(draft.category, LIMITS.NAME),
      image: imageUrl,
      price: Number(draft.price) || 0,
      qualityGrade: sanitize(draft.qualityGrade, LIMITS.SHORT),
      batchNumber: sku,
      warehouse: sanitize(draft.warehouse, LIMITS.NAME),
      supplier: sanitize(draft.supplier, LIMITS.MEDIUM),
      harvestDate: sanitize(draft.harvestDate, LIMITS.PHONE),
    };

    const { data, error } = await supabase.from('products').insert([payload]).select().single();
    if (data && !error) {
      setProducts([data, ...products]);
      setDraft({ ...blankDraft });
      removeImage();
      setShowForm(false);
    } else {
      alert(`Save failed: ${error?.message}`);
    }
    setSaving(false);
  };

  const removeProduct = async (id: string) => {
    if (!confirm('Remove this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">Products</h1>
          <p className="text-sm text-muted mt-0.5">{products.length} items in catalogue</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 space-y-6">
          <h2 className="text-base font-semibold text-primary">New Product</h2>

          {/* Image Upload */}
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">Product Image</label>
            {imagePreview ? (
              <div className="relative w-full aspect-video max-h-56 rounded-lg overflow-hidden border border-subtle">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-primary" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                  isDragging ? 'border-primary bg-subtle' : 'border-subtle hover:border-primary hover:bg-subtle'
                }`}
              >
                <ImagePlus className="w-8 h-8 text-muted" />
                <p className="text-sm text-muted">Drag & drop or <span className="text-primary font-medium">click to upload</span></p>
                <p className="text-xs text-muted">JPEG, PNG, WebP — max 5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={e => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">Product Name *</label>
            <input
              required
              value={draft.name}
              onChange={e => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Sun-Dried Kapenta"
              className="input-field"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">Category *</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setDraft({ ...draft, category: cat })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    draft.category === cat
                      ? 'bg-primary border-primary text-white dark:text-black'
                      : 'border-subtle text-muted hover:text-primary hover:border-primary'
                  }`}
                >
                  {draft.category === cat && <Check className="w-3 h-3 inline mr-1" />}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">Price (USD per kg) *</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={draft.price}
              onChange={e => setDraft({ ...draft, price: e.target.value })}
              placeholder="e.g. 12.50"
              className="input-field max-w-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">Description</label>
            <textarea
              rows={3}
              value={draft.description}
              onChange={e => setDraft({ ...draft, description: e.target.value })}
              placeholder="Describe the product, origin, processing method..."
              className="input-field resize-none"
            />
          </div>

          {/* Secondary Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">Quality Grade</label>
              <div className="flex flex-col gap-1.5">
                {QUALITY_GRADES.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setDraft({ ...draft, qualityGrade: g })}
                    className={`px-3 py-1.5 rounded-md text-sm text-left border transition-colors ${
                      draft.qualityGrade === g
                        ? 'bg-primary border-primary text-white dark:text-black font-medium'
                        : 'border-subtle text-muted hover:text-primary'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">Warehouse</label>
              <div className="flex flex-col gap-1.5">
                {WAREHOUSES.map(w => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setDraft({ ...draft, warehouse: w })}
                    className={`px-3 py-1.5 rounded-md text-sm text-left border transition-colors ${
                      draft.warehouse === w
                        ? 'bg-primary border-primary text-white dark:text-black font-medium'
                        : 'border-subtle text-muted hover:text-primary'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">Supplier / Source</label>
                <input
                  value={draft.supplier}
                  onChange={e => setDraft({ ...draft, supplier: e.target.value })}
                  placeholder="e.g. Lusaka Cooperative"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">Harvest / Prep Date</label>
                <input
                  type="date"
                  value={draft.harvestDate}
                  onChange={e => setDraft({ ...draft, harvestDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="p-3 bg-subtle rounded-lg border border-subtle">
                <p className="text-xs text-muted">SKU is auto-generated on save</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2 border-t border-subtle">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? 'Uploading & Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">SKU</th>
              <th className="px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Price</th>
              <th className="px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="table-row">
                  <td className="px-6 py-4"><div className="h-4 bg-subtle rounded animate-pulse w-32" /></td>
                  <td className="px-6 py-4 hidden sm:table-cell"><div className="h-4 bg-subtle rounded animate-pulse w-24" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-subtle rounded animate-pulse w-20" /></td>
                  <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 bg-subtle rounded animate-pulse w-12" /></td>
                  <td className="px-6 py-4" />
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-muted text-sm">
                  No products yet. Click "Add Product" to get started.
                </td>
              </tr>
            ) : products.map(p => (
              <tr key={p.id} className="table-row">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {p.image ? (
                      <img src={p.image} alt="" className="w-10 h-10 rounded-md object-cover shrink-0 border border-subtle" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-subtle shrink-0 flex items-center justify-center">
                        <ImagePlus className="w-4 h-4 text-muted" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-primary">{p.name}</div>
                      <div className="text-xs text-muted">{p.qualityGrade}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="mono text-xs text-muted">{p.sku}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="badge">{p.category}</span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="mono text-sm font-medium">${p.price}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => removeProduct(p.id)}
                    className="text-muted hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
