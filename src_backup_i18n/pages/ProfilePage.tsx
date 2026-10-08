import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, ShoppingBag } from 'lucide-react';
import { useApp } from '../lib/AppStateProvider';
import { supabase } from '../lib/supabaseClient';
import { sanitize, LIMITS } from '../lib/security';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="mono t3 text-[10px] uppercase tracking-[0.18em]">{children}</span>
);

const Chip = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`chip ${className}`.trim()}>{children}</span>
);

export default function ProfilePage() {
  const { 
    user, profile, isLoggedIn, setIsLoginModalOpen, cart, exportOrders, 
    handleRemoveFromCart, setProfile
  } = useApp();
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [purchaseMessage, setPurchaseMessage] = useState('');

  const vibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  const getDisplayName = () => {
    const fromProfile = profile?.full_name || '';
    const fromAuthMeta = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
    const fallback = user?.email?.split('@')[0] || 'Valued Client';
    return fromProfile || fromAuthMeta || fallback;
  };
  const displayName = getDisplayName();

  const handlePurchaseRequest = async () => {
    if (!cart.length || !user) return;
    setPurchaseStatus('submitting');
    setPurchaseMessage('');

    const totalValue = cart.reduce((sum, item) => sum + item.price, 0);
    const payload = {
      customer_name: displayName,
      customer_email: user.email || '',
      customer_phone: profile?.phone_number || null,
      shipping_address: profile?.shipping_address || null,
      items: cart.map(item => `${item.name} (${item.sku})`).join(', '),
      total_value: totalValue,
      status: 'Pending',
      notes: `Submitted from the public site cart with ${cart.length} items.`,
    };

    const { error } = await supabase.from('purchase_requests').insert([payload]);
    if (error) {
      setPurchaseStatus('error');
      setPurchaseMessage('We could not send the request right now. Please try again.');
      return;
    }

    setPurchaseStatus('success');
    setPurchaseMessage('Your purchase request was sent successfully.');
  };

  if (!isLoggedIn) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
        <div className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
          <div className="space-y-2">
            <SectionLabel>{t.profile.accountRequired}</SectionLabel>
            <h1 className="serif text-3xl sm:text-4xl font-light t">{t.profile.signInTitle}</h1>
            <p className="t2 text-sm font-light">{t.profile.signInDesc}</p>
          </div>
          <button onClick={() => setIsLoginModalOpen(true)} className="btn-primary px-8 py-4 rounded-xl text-sm w-full">
            {t.profile.signInNow}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
      <div className="border-b bt">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <SectionLabel>{t.profile.commandCenter}</SectionLabel>
            <h1 className="serif text-5xl font-light t mt-3">{t.profile.opsHub} <em className="ac">{t.profile.opsHubAccent}</em></h1>
          </div>
          <button onClick={async () => {
            vibrate();
            await supabase.auth.signOut();
            navigate('/');
          }} className="btn-ghost text-xs px-4 py-2 rounded-lg">{t.common.signOut}</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr] gap-6 sm:gap-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[var(--accent)]/8 to-transparent border bt rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center text-a-text font-semibold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="mono t3 text-[10px] uppercase tracking-[0.18em]">{t.profile.accountProfile}</div>
                <div className="serif text-xl sm:text-2xl font-light t mt-1">{displayName}</div>
                <div className="t2 text-xs font-light mt-0.5">{user?.email}</div>
              </div>
            </div>
            <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="btn-ghost text-[10px] px-3 py-2 rounded-lg whitespace-nowrap">{t.profile.editProfile}</button>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              <div className="bg-bg-2 border bt rounded-lg p-2">
                <div className="mono text-[9px] uppercase tracking-widest t3">{t.profile.status}</div>
                <div className="text-sm font-medium t mt-1">{profile?.shipping_address ? t.profile.complete : t.profile.incomplete}</div>
              </div>
              <div className="bg-bg-2 border bt rounded-lg p-2">
                <div className="mono text-[9px] uppercase tracking-widest t3">{t.profile.cart}</div>
                <div className="text-sm font-medium t mt-1">{cart.length} {t.profile.items}</div>
              </div>
            </div>
          </div>

          {isEditingProfile && (
            <div className="bg-surf card rounded-2xl p-6 sm:p-8 border bt space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="serif text-xl font-light t">{t.profile.editProfile}</div>
                <button onClick={() => setIsEditingProfile(false)} className="text-xs t3 hover:t">{t.common.close}</button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const updates = {
                  full_name: sanitize(String(fd.get('full_name') ?? ''), LIMITS.NAME),
                  company_name: sanitize(String(fd.get('company_name') ?? ''), LIMITS.NAME),
                  phone_number: sanitize(String(fd.get('phone_number') ?? ''), LIMITS.PHONE),
                  shipping_address: sanitize(String(fd.get('shipping_address') ?? ''), LIMITS.LONG),
                };
                const { error } = await supabase.from('profiles').update(updates).eq('id', user?.id);
                if (!error) {
                  setProfile((prev: any) => ({ ...prev, ...updates }));
                  setIsEditingProfile(false);
                }
              }} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="mono t3 text-[10px] uppercase tracking-wider">{t.profile.fullName}</label>
                  <input name="full_name" type="text" defaultValue={profile?.full_name || ''} className="w-full border rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="mono t3 text-[10px] uppercase tracking-wider">{t.profile.company}</label>
                  <input name="company_name" type="text" defaultValue={profile?.company_name || ''} className="w-full border rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="mono t3 text-[10px] uppercase tracking-wider">{t.profile.phone}</label>
                  <input name="phone_number" type="tel" defaultValue={profile?.phone_number || ''} className="w-full border rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="mono t3 text-[10px] uppercase tracking-wider">{t.profile.shippingAddress}</label>
                  <input name="shipping_address" type="text" defaultValue={profile?.shipping_address || ''} className="w-full border rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <button type="submit" className="btn-primary py-2.5 rounded-lg text-xs md:col-span-2">{t.profile.saveChanges}</button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surf card rounded-xl p-4 border bt">
              <div className="mono text-[9px] uppercase tracking-widest t3">{t.profile.totalOrders}</div>
              <div className="text-2xl font-medium t mt-2">{exportOrders.filter(o => o.customer_email === user?.email).length}</div>
            </div>
            <div className="bg-surf card rounded-xl p-4 border bt">
              <div className="mono text-[9px] uppercase tracking-widest t3">{t.profile.activeShipments}</div>
              <div className="text-2xl font-medium t mt-2">{exportOrders.filter(o => o.customer_email === user?.email && o.export_status !== 'Completed').length}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surf card rounded-2xl p-6 sm:p-8 border bt space-y-4">
            <div className="flex items-center justify-between">
              <div className="serif text-lg font-light t">{t.profile.yourCart}</div>
              <div className="chip text-[9px]">{cart.length}</div>
            </div>
            {cart.length > 0 ? (
              <>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.sku} className="flex items-start justify-between gap-3 p-2 rounded-lg bg-bg-2 border bt">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium t truncate">{item.name}</div>
                        <div className="t3 text-[10px]">SKU: {item.sku}</div>
                      </div>
                      <div className="text-xs font-medium t2 whitespace-nowrap">${item.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t bt pt-3 space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="t">{t.profile.subtotal}</span>
                    <span className="t">${cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</span>
                  </div>
                  <button onClick={handlePurchaseRequest} disabled={purchaseStatus === 'submitting'} className="w-full btn-primary py-3 rounded-lg text-xs">
                    {purchaseStatus === 'submitting' ? t.profile.processing : t.profile.submitPurchase}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="w-8 h-8 t3 mx-auto mb-2" />
                <p className="t3 text-xs font-light">{t.profile.cartEmpty}</p>
                <button onClick={() => navigate('/catalog')} className="text-xs ac mt-2 hover:underline">{t.profile.browseProducts}</button>
              </div>
            )}
          </div>

          <div className="bg-surf card rounded-2xl p-6 sm:p-8 border bt space-y-4">
            <div className="serif text-lg font-light t">{t.profile.recentActivity}</div>
            {exportOrders.filter(o => o.customer_email === user?.email).slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {exportOrders.filter(o => o.customer_email === user?.email).slice(0, 5).map(order => (
                  <div key={order.id} className="p-3 rounded-lg bg-bg-2 border bt">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="text-xs font-medium t">{order.order_reference}</div>
                      <Chip className="text-[8px]">{order.export_status}</Chip>
                    </div>
                    <div className="t3 text-[10px]">To: {order.destination_country}</div>
                    <div className="t2 text-[10px] mt-1">{order.product_name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Package className="w-6 h-6 t3 mx-auto mb-1.5" />
                <p className="t3 text-xs font-light">{t.profile.noOrders}</p>
              </div>
            )}
            <button onClick={() => navigate('/ship')} className="w-full btn-ghost py-2.5 rounded-lg text-xs">{t.profile.trackAll}</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
