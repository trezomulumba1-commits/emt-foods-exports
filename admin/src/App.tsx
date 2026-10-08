import {useEffect, useState, type FormEvent} from 'react';
import {type Session} from '@supabase/supabase-js';
import {
  BarChart3,
  Bell,
  Database,
  Download,
  Menu,
  LogOut,
  Moon,
  Package,
  Plus,
  Save,
  ShieldCheck,
  ShoppingBag,
  Mail,
  FileText,
  Truck,
  Trash2,
  Sun,
} from 'lucide-react';

import type {ContactMessage, ExportOrder, Product, PurchaseRequest, QuoteRequest, UserProfile, UserRole} from './types';
import {hasRole, ADMIN_ROLES} from './types';
import {supabase} from './lib/supabaseClient';

type TabId = 'overview' | 'products' | 'orders' | 'quotes' | 'purchases' | 'backup' | 'messages';

const TAB_ROLES: Record<TabId, UserRole[]> = {
  overview: ADMIN_ROLES,
  products: ['content_admin', 'super_admin', 'operations_admin'],
  orders: ['operations_admin', 'super_admin'],
  quotes: ['support_admin', 'operations_admin', 'super_admin'],
  purchases: ['operations_admin', 'finance_admin', 'super_admin'],
  messages: ['support_admin', 'super_admin'],
  backup: ['super_admin']
};

type ProductDraft = {
  sku: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  qualityGrade: string;
  batchNumber: string;
  warehouse: string;
  supplier: string;
  harvestDate: string;
};

const tabs: Array<{id: TabId; label: string; icon: typeof BarChart3}> = [
  {id: 'overview', label: 'Overview', icon: BarChart3},
  {id: 'products', label: 'Products', icon: ShoppingBag},
  {id: 'orders', label: 'Orders', icon: Truck},
  {id: 'quotes', label: 'Quotes', icon: FileText},
  {id: 'purchases', label: 'Purchases', icon: Package},
  {id: 'backup', label: 'Backup', icon: Database},
  {id: 'messages', label: 'Messages', icon: Mail},
];

const simpleTabs: TabId[] = ['overview', 'products', 'quotes', 'purchases', 'backup', 'messages'];

const sanitizeText = (value: string | null | undefined) =>
  String(value ?? '').replace(/<[^>]*>/g, '').trim();

const blankDraft: ProductDraft = {
  sku: '',
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

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const [products, setProducts] = useState<Product[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [exportOrders, setExportOrders] = useState<ExportOrder[]>([]);
  const [quoteStatuses, setQuoteStatuses] = useState<Record<string, string>>({});
  const [purchaseStatuses, setPurchaseStatuses] = useState<Record<string, string>>({});
  const [statusUpdates, setStatusUpdates] = useState<Record<string, string>>({});
  const [productDraft, setProductDraft] = useState<ProductDraft>(blankDraft);
  const [savingProduct, setSavingProduct] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [simpleMode, setSimpleMode] = useState(() => localStorage.getItem('emt-admin-mode') !== 'full');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('emt-admin-theme');
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : sysDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('emt-admin-theme', next ? 'dark' : 'light');
  };

  const toggleMode = () => {
    const next = !simpleMode;
    setSimpleMode(next);
    localStorage.setItem('emt-admin-mode', next ? 'simple' : 'full');
    if (next && activeTab === 'orders') setActiveTab('overview');
  };

  const loadAdminData = async (userId: string, user: Session['user'] | null) => {
    const {data: adminProfile} = await supabase.from('profiles').select('*').eq('id', userId).single();
    const isAdmin = hasRole(adminProfile, ADMIN_ROLES) || user?.app_metadata?.is_admin === true;

    if (!isAdmin) {
      await supabase.auth.signOut();
      setAuthorized(false);
      setProfile(null);
      setAuthError('Admin access is required.');
      return;
    }

    setProfile(adminProfile);
    setAuthorized(true);

    // Auto-select first available tab if overview isn't allowed (fallback)
    const allowedTabs = tabs.filter(t => hasRole(adminProfile, TAB_ROLES[t.id]) || user?.app_metadata?.is_admin === true);
    if (allowedTabs.length > 0 && !allowedTabs.find(t => t.id === activeTab)) {
      setActiveTab(allowedTabs[0].id);
    }

    const [productsRes, quotesRes, purchasesRes, messagesRes, ordersRes, updatesRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', {ascending: false}),
      supabase.from('quote_requests').select('*').order('created_at', {ascending: false}),
      supabase.from('purchase_requests').select('*').order('created_at', {ascending: false}),
      supabase.from('contact_messages').select('*').order('created_at', {ascending: false}),
      supabase.from('export_orders').select('*').order('created_at', {ascending: false}),
      supabase.from('export_status_updates').select('*').order('created_at', {ascending: false}),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (quotesRes.data) setQuoteRequests(quotesRes.data);
    if (quotesRes.data) {
      const nextQuoteStatuses: Record<string, string> = {};
      quotesRes.data.forEach(quote => {
        nextQuoteStatuses[quote.id ?? quote.customer_email] = quote.status ?? 'Pending';
      });
      setQuoteStatuses(nextQuoteStatuses);
    }
    if (purchasesRes.data) {
      setPurchaseRequests(purchasesRes.data);
      const nextPurchaseStatuses: Record<string, string> = {};
      purchasesRes.data.forEach(request => {
        if (request.id) nextPurchaseStatuses[request.id] = request.status ?? 'Pending';
      });
      setPurchaseStatuses(nextPurchaseStatuses);
    }
    if (messagesRes.data) setContactMessages(messagesRes.data);
    if (ordersRes.data) {
      setExportOrders(ordersRes.data as ExportOrder[]);
      const nextStatus: Record<string, string> = {};
      ordersRes.data.forEach(order => {
        nextStatus[order.id] = order.export_status;
      });
      updatesRes.data?.forEach(update => {
        if (!nextStatus[update.export_order_id]) nextStatus[update.export_order_id] = update.status;
      });
      setStatusUpdates(nextStatus);
    }
  };

  useEffect(() => {
    const boot = async () => {
      const {data: {session}} = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) await loadAdminData(session.user.id, session.user);
      setLoading(false);
    };

    boot();

    const {data: {subscription}} = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        setLoading(true);
        await loadAdminData(nextSession.user.id, nextSession.user);
        setLoading(false);
      } else {
        setAuthorized(false);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError('');
    const {error} = await supabase.auth.signInWithPassword({
      email: sanitizeText(authEmail).toLowerCase(),
      password: sanitizeText(authPassword),
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    const {data: {session}} = await supabase.auth.getSession();
    if (session?.user) {
      setSession(session);
      setLoading(true);
      await loadAdminData(session.user.id, session.user);
      setLoading(false);
    }
  };

  const addProduct = async (event: FormEvent) => {
    event.preventDefault();
    setSavingProduct(true);

    const payload: Product = {
      id: crypto.randomUUID(),
      sku: sanitizeText(productDraft.sku).slice(0, 80),
      name: sanitizeText(productDraft.name).slice(0, 160),
      description: sanitizeText(productDraft.description).slice(0, 2000),
      category: sanitizeText(productDraft.category).slice(0, 120),
      image: sanitizeText(productDraft.image).slice(0, 500),
      price: Number(productDraft.price) || 0,
      qualityGrade: sanitizeText(productDraft.qualityGrade).slice(0, 80),
      batchNumber: sanitizeText(productDraft.batchNumber).slice(0, 80),
      warehouse: sanitizeText(productDraft.warehouse).slice(0, 120),
      supplier: sanitizeText(productDraft.supplier).slice(0, 160),
      harvestDate: sanitizeText(productDraft.harvestDate).slice(0, 40),
    };

    const {data, error} = await supabase.from('products').insert([payload]).select().single();
    if (!error && data) {
      setProducts([data, ...products]);
      setProductDraft(blankDraft);
    }
    setSavingProduct(false);
  };

  const removeProduct = async (id: string) => {
    const {error} = await supabase.from('products').delete().eq('id', id);
    if (!error) setProducts(products.filter(product => product.id !== id));
  };

  const saveOrderStatus = async (orderId: string) => {
    const nextStatus = statusUpdates[orderId] as ExportOrder['export_status'];
    const {error} = await supabase.from('export_orders').update({export_status: nextStatus}).eq('id', orderId);
    if (!error) {
      setExportOrders(exportOrders.map(order => order.id === orderId ? {...order, export_status: nextStatus} : order));
    }
  };

  const saveQuoteStatus = async (quoteId: string, fallbackKey: string) => {
    const nextStatus = quoteStatuses[quoteId] ?? quoteStatuses[fallbackKey] ?? 'Pending';
    const {error} = await supabase.from('quote_requests').update({status: nextStatus}).eq('id', quoteId);
    if (!error) {
      setQuoteRequests(quoteRequests.map(quote => quote.id === quoteId ? {...quote, status: nextStatus} : quote));
    }
  };

  const downloadJson = (name: string, data: unknown) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const savePurchaseStatus = async (requestId: string) => {
    const nextStatus = purchaseStatuses[requestId] ?? 'Pending';
    const {error} = await supabase.from('purchase_requests').update({status: nextStatus}).eq('id', requestId);
    if (!error) {
      setPurchaseRequests(purchaseRequests.map(request => request.id === requestId ? {...request, status: nextStatus} : request));
    }
  };

  const activeQuoteCount = quoteRequests.filter(quote => ['Pending', 'Reviewed'].includes(quote.status ?? 'Pending')).length;
  const pendingPurchaseCount = purchaseRequests.filter(request => !['Closed', 'Cancelled'].includes(request.status ?? 'Pending')).length;
  const activeShipmentCount = exportOrders.filter(order => !['Completed', 'Cancelled'].includes(order.export_status)).length;

  const handleQuickAction = (tab: TabId) => {
    setActiveTab(tab);
    if (tab === 'backup') {
      const snapshot = {
        products,
        quoteRequests,
        purchaseRequests,
        contactMessages,
        exportOrders,
      };
      downloadJson(`emt-admin-backup-${new Date().toISOString().slice(0, 10)}.json`, snapshot);
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-t flex items-center justify-center px-6 t">
        <div className="space-y-3 text-center max-w-sm">
          <ShieldCheck className="w-10 h-10 ac mx-auto" />
          <div className="serif text-3xl font-light">Loading admin</div>
          <p className="t2 text-sm">Checking access and loading workspace data for the standalone admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-t flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md bg-surf card rounded-lg p-8 space-y-6 border bt">
          <div className="space-y-2 text-center">
            <ShieldCheck className="w-10 h-10 ac mx-auto" />
            <div className="serif text-3xl font-light t">Admin Access</div>
            <p className="t2 text-sm">Sign in with an admin account to manage products, orders, quotes, purchases, and messages from any device.</p>
          </div>
          <form onSubmit={signIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="mono t3 text-[10px] uppercase tracking-wider">Email</label>
              <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} type="email" className="w-full border rounded-lg px-3 py-2.5 text-sm bg-t" />
            </div>
            <div className="space-y-1.5">
              <label className="mono t3 text-[10px] uppercase tracking-wider">Password</label>
              <input value={authPassword} onChange={e => setAuthPassword(e.target.value)} type="password" className="w-full border rounded-lg px-3 py-2.5 text-sm bg-t" />
            </div>
            {authError && <div className="text-sm text-red-500">{authError}</div>}
            <button className="btn-primary w-full py-3 rounded-lg text-sm inline-flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4 rotate-180" /> Enter Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-t t">
      <header className="sticky top-0 z-30 bg-surf/95 backdrop-blur border-b bt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative">
          <div>
            <div className="serif text-2xl font-light">EMT Foods Admin</div>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(open => !open)}
              className="btn-ghost px-3 py-2 rounded-lg text-xs inline-flex items-center gap-2"
            >
              <Menu className="w-4 h-4" /> Menu
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surf card rounded-xl border bt p-2 shadow-lg z-50">
                <div className="px-3 py-2 border-b bt mb-2">
                  <div className="mono text-[10px] uppercase tracking-wider t3">Signed in</div>
                  <div className="text-sm t truncate">{profile?.full_name || session?.user.email}</div>
                </div>
                <button
                  onClick={() => { toggleMode(); setMenuOpen(false); }}
                  className="w-full text-left btn-ghost px-3 py-2 rounded-lg text-sm inline-flex items-center gap-2 mb-1"
                >
                  <Database className="w-4 h-4" /> {simpleMode ? 'Simple mode' : 'Full mode'}
                </button>
                <button
                  onClick={() => { toggleTheme(); setMenuOpen(false); }}
                  className="w-full text-left btn-ghost px-3 py-2 rounded-lg text-sm inline-flex items-center gap-2 mb-1"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} Theme
                </button>
                <button
                  onClick={() => { supabase.auth.signOut(); setMenuOpen(false); }}
                  className="w-full text-left btn-ghost px-3 py-2 rounded-lg text-sm inline-flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {label: 'Catalogue', value: products.length, icon: ShoppingBag},
            {label: 'Live Enquiries', value: activeQuoteCount, icon: FileText},
            {label: 'Pending Approvals', value: pendingPurchaseCount, icon: Package},
            {label: 'Customer Messages', value: contactMessages.length, icon: Mail},
            {label: 'In Transit', value: activeShipmentCount, icon: Truck},
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-surf card rounded-lg p-5 border bt">
                <div className="flex items-center justify-between">
                  <div className="mono text-[10px] uppercase tracking-wider t3">{item.label}</div>
                  <Icon className="w-4 h-4 ac" />
                </div>
                <div className="serif text-4xl font-light t mt-3">{item.value}</div>
              </div>
            );
          })}
        </section>

        <section className="bg-surf card rounded-lg p-4 border bt space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="serif text-xl font-light">Quick Actions</div>
              <p className="t2 text-xs mt-1">Purpose-built shortcuts for daily admin work.</p>
            </div>
            <ShieldCheck className="w-4 h-4 ac shrink-0" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {[
              {tab: 'products', label: 'Add Product', sub: 'Create a new catalogue listing', cta: 'Create item', icon: Plus},
              {tab: 'quotes', label: 'Review Quotes', sub: 'Handle incoming buyer enquiries', cta: 'Review queue', icon: FileText},
              {tab: 'purchases', label: 'Approve Purchases', sub: 'Confirm bulk purchase requests', cta: 'Approve requests', icon: Package},
              {tab: 'backup', label: 'Export Backup', sub: 'Download current site content', cta: 'Download backup', icon: Database},
              {tab: 'messages', label: 'Message Inbox', sub: 'Respond to site conversations', cta: 'Open inbox', icon: Mail},
              {tab: 'orders', label: 'Track Orders', sub: 'Update shipment progress', cta: 'Update shipments', icon: Truck},
            ].map(({tab, label, sub, cta, icon: Icon}) => (
              <button
                key={tab}
                onClick={() => handleQuickAction(tab)}
                className="bg-t2 border bt rounded-lg p-3 text-left flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="mono text-[10px] uppercase tracking-wider t3">{label}</div>
                  <div className="t2 text-xs mt-1 leading-relaxed">{sub}</div>
                  <div className="serif text-sm font-light t mt-2">{cta}</div>
                </div>
                <Icon className="w-4 h-4 ac shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </section>

        <nav className="flex flex-nowrap gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {(simpleMode ? tabs.filter(tab => simpleTabs.includes(tab.id)) : tabs)
            .filter(tab => hasRole(profile, TAB_ROLES[tab.id]) || session?.user?.app_metadata?.is_admin === true)
            .map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 border bt shrink-0 ${isActive ? 'bg-t2 t' : 'bg-surf t2'}`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </nav>

        {simpleMode && activeTab === 'orders' && (
          <section className="bg-surf card rounded-lg p-6 border bt">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="serif text-2xl font-light">Orders view is in Full mode</div>
                <p className="t2 text-sm mt-1">Switch to Full if you need shipment status editing. Simple mode keeps the screen easier for quick phone edits.</p>
              </div>
              <Truck className="w-5 h-5 ac shrink-0" />
            </div>
          </section>
        )}

        {activeTab === 'overview' && (
          <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
            <div className="space-y-6">
              <div className="bg-surf card rounded-lg p-6 space-y-4 border bt">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="serif text-2xl font-light">Sales pipeline</div>
                    <p className="t2 text-sm mt-1">A closer view of buyer interest and what needs attention today.</p>
                  </div>
                  <Bell className="w-4 h-4 ac shrink-0" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border bt rounded-lg p-4 bg-t2">
                    <div className="mono text-[10px] uppercase tracking-wider t3">Open quotes</div>
                    <div className="serif text-3xl font-light t mt-2">{activeQuoteCount}</div>
                    <div className="t2 text-sm mt-2">Quotes waiting for pricing or a follow-up reply.</div>
                  </div>
                  <div className="border bt rounded-lg p-4 bg-t2">
                    <div className="mono text-[10px] uppercase tracking-wider t3">Pending approvals</div>
                    <div className="serif text-3xl font-light t mt-2">{pendingPurchaseCount}</div>
                    <div className="t2 text-sm mt-2">Purchase requests that require a decision before dispatch.</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {quoteRequests.slice(0, 3).map((quote, index) => (
                    <div key={quote.id ?? index} className="border bt rounded-lg p-4 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-sm">{quote.customer_name}</div>
                        <div className="t2 text-xs mt-1">{quote.product_name ?? quote.message ?? 'Enquiry request'}</div>
                      </div>
                      <span className="chip">{quote.status ?? 'Pending'}</span>
                    </div>
                  ))}
                  {quoteRequests.length === 0 && <p className="t3 text-sm">No quote requests yet.</p>}
                </div>
              </div>

              <div className="bg-surf card rounded-lg p-6 space-y-4 border bt">
                <div className="flex items-center justify-between">
                  <div className="serif text-2xl font-light">Delivery tracking</div>
                  <Truck className="w-4 h-4 ac" />
                </div>
                <div className="space-y-3">
                  {exportOrders.slice(0, 4).map(order => {
                    const currentStatus = statusUpdates[order.id] ?? order.export_status;
                    return (
                      <div key={order.id} className="border bt rounded-lg p-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium text-sm">{order.order_reference}</div>
                          <div className="t2 text-xs mt-1">{order.customer_name} · {order.destination_country}</div>
                        </div>
                        <div className="text-right">
                          <span className="chip">{currentStatus}</span>
                          <div className="t2 text-[11px] mt-1">Next update: {currentStatus === 'Completed' ? 'Close out' : 'Keep buyer informed'}</div>
                        </div>
                      </div>
                    );
                  })}
                  {exportOrders.length === 0 && <p className="t3 text-sm">No export orders yet.</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-surf card rounded-lg p-6 space-y-4 border bt">
                <div className="serif text-2xl font-light">Today’s priorities</div>
                <ul className="space-y-2 text-sm t2">
                  <li>Review {activeQuoteCount} enquiries that still need a response.</li>
                  <li>Approve {pendingPurchaseCount} purchase requests before they stall.</li>
                  <li>Keep {activeShipmentCount} shipments moving with clear status updates.</li>
                </ul>
              </div>

              <div className="bg-surf card rounded-lg p-6 space-y-4 border bt">
                <div className="flex items-center justify-between">
                  <div className="serif text-2xl font-light">Customer follow-up</div>
                  <Mail className="w-4 h-4 ac" />
                </div>
                <div className="space-y-3">
                  {contactMessages.slice(0, 4).map((message, index) => (
                    <div key={message.id ?? index} className="border bt rounded-lg p-4">
                      <div className="font-medium text-sm">{message.name}</div>
                      <div className="mono text-[10px] uppercase tracking-wider t3 mt-1">{message.subject}</div>
                      <p className="t2 text-xs mt-2 line-clamp-2">{message.message}</p>
                      <div className="serif text-sm font-light t mt-2">
                        Next action: {message.subject.toLowerCase().includes('quote') ? 'Send pricing' : message.subject.toLowerCase().includes('order') ? 'Confirm shipment' : 'Reply today'}
                      </div>
                    </div>
                  ))}
                  {contactMessages.length === 0 && <p className="t3 text-sm">No contact messages yet.</p>}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'products' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={addProduct} className="bg-surf card rounded-lg p-6 space-y-4 border bt">
              <div className="flex items-center justify-between">
                <div className="serif text-2xl font-light">Add Product</div>
                <Plus className="w-4 h-4 ac" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  ['sku', 'Code'],
                  ['name', 'Product name'],
                  ['category', 'Product group'],
                  ['price', 'Price'],
                  ['image', 'Image link'],
                  ['supplier', 'Source name'],
                  ['batchNumber', 'Batch / lot'],
                  ['warehouse', 'Stock place'],
                  ['qualityGrade', 'Quality'],
                  ['harvestDate', 'Prep date'],
                ].map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <label className="mono text-[10px] uppercase tracking-wider t3">{label}</label>
                    <input
                      value={(productDraft as Record<string, string>)[key]}
                      onChange={e => setProductDraft({...productDraft, [key]: e.target.value})}
                      type={key === 'price' ? 'number' : key === 'harvestDate' ? 'date' : 'text'}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-t"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <label className="mono text-[10px] uppercase tracking-wider t3">Description</label>
                <textarea
                  value={productDraft.description}
                  onChange={e => setProductDraft({...productDraft, description: e.target.value})}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-t resize-none"
                />
              </div>
              <button disabled={savingProduct} className="btn-primary px-5 py-3 rounded-lg text-sm inline-flex items-center gap-2">
                <Save className="w-4 h-4" /> {savingProduct ? 'Saving…' : 'Save Product'}
              </button>
            </form>

            <div className="bg-surf card rounded-lg p-6 space-y-4 border bt">
              <div className="flex items-center justify-between">
                <div className="serif text-2xl font-light">Products</div>
                <Package className="w-4 h-4 ac" />
              </div>
              <div className="space-y-3">
                {products.map(product => (
                  <div key={product.id} className="border bt rounded-lg p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="mono text-[10px] uppercase tracking-wider t3 mt-1">{product.sku} · {product.category}</div>
                      <div className="t2 text-xs mt-2">${product.price.toFixed(2)} · {product.warehouse}</div>
                    </div>
                    <button onClick={() => removeProduct(product.id)} className="text-xs text-red-500 inline-flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="bg-surf card rounded-lg p-6 space-y-4 border bt">
            <div className="flex items-center justify-between">
              <div className="serif text-2xl font-light">Export Orders</div>
              <Truck className="w-4 h-4 ac" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {exportOrders.map(order => (
                <div key={order.id} className="border bt rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <div className="mono text-[10px] uppercase tracking-wider t3">Reference</div>
                    <div className="font-medium">{order.order_reference}</div>
                    <div className="t2 text-xs mt-1">{order.customer_name} · {order.destination_country}</div>
                  </div>
                  <div>
                    <label className="mono text-[10px] uppercase tracking-wider t3">Status</label>
                    <select
                      value={statusUpdates[order.id] ?? order.export_status}
                      onChange={e => setStatusUpdates({...statusUpdates, [order.id]: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-t"
                    >
                      {['Pending','Preparing Products','Quality Inspection','Documentation','Ready for Export','Handed to Carrier','Completed','Cancelled'].map(status => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={() => saveOrderStatus(order.id)} className="btn-primary px-4 py-2 rounded-lg text-sm">
                    Update Status
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'quotes' && (
          <section className="bg-surf card rounded-lg p-6 space-y-4 border bt">
            <div className="serif text-2xl font-light">Quote Requests</div>
            <div className="space-y-3">
              {quoteRequests.map((quote, index) => (
                <div key={quote.id ?? index} className="border bt rounded-lg p-4">
                  <div className="flex justify-between gap-3">
                    <div className="font-medium text-sm">{quote.customer_name}</div>
                    <span className="chip">{quoteStatuses[quote.id ?? quote.customer_email] ?? quote.status ?? 'Pending'}</span>
                  </div>
                  <div className="t2 text-xs mt-1">{quote.customer_email} · {quote.destination_country}</div>
                  <div className="t2 text-sm mt-2">{quote.product_name}</div>
                  <div className="mt-3 flex flex-col md:flex-row gap-2 md:items-center">
                    <select
                      value={quoteStatuses[quote.id ?? quote.customer_email] ?? quote.status ?? 'Pending'}
                      onChange={e => setQuoteStatuses({...quoteStatuses, [quote.id ?? quote.customer_email]: e.target.value})}
                      className="border rounded-lg px-3 py-2 text-sm bg-t"
                    >
                      {['Pending', 'Reviewed', 'Quoted', 'Closed'].map(status => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                    {quote.id && (
                      <button onClick={() => saveQuoteStatus(quote.id!, quote.customer_email)} className="btn-ghost px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Status
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'purchases' && (
          <section className="bg-surf card rounded-lg p-6 space-y-4 border bt">
            <div className="flex items-center justify-between">
              <div className="serif text-2xl font-light">Purchase Requests</div>
              <Package className="w-4 h-4 ac" />
            </div>
            <div className="space-y-3">
              {purchaseRequests.map((request, index) => (
                <div key={request.id ?? index} className="border bt rounded-lg p-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm">{request.customer_name}</div>
                      <div className="mono text-[10px] uppercase tracking-wider t3 mt-1">{request.customer_email}</div>
                      {request.customer_phone && <div className="t2 text-xs mt-1">{request.customer_phone}</div>}
                    </div>
                    <div className="text-left md:text-right space-y-2">
                      <span className="chip">{purchaseStatuses[request.id ?? ''] ?? request.status ?? 'Pending'}</span>
                      <div className="serif text-2xl font-light t mt-2">${Number(request.total_value).toFixed(2)}</div>
                    </div>
                  </div>
                  {request.id && (
                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                      <select
                        value={purchaseStatuses[request.id] ?? request.status ?? 'Pending'}
                        onChange={event => setPurchaseStatuses({...purchaseStatuses, [request.id!]: event.target.value})}
                        className="border rounded-lg px-3 py-2 text-sm bg-t"
                      >
                        {['Pending', 'Reviewed', 'Quoted', 'Closed', 'Cancelled'].map(status => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                      <button onClick={() => savePurchaseStatus(request.id!)} className="btn-ghost px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Status
                      </button>
                    </div>
                  )}
                  <div className="bg-t2 border bt rounded-lg p-3">
                    <div className="mono text-[10px] uppercase tracking-wider t3">Items</div>
                    <p className="t2 text-sm mt-1">{request.items}</p>
                  </div>
                  {(request.shipping_address || request.notes) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {request.shipping_address && (
                        <div className="bg-t2 border bt rounded-lg p-3">
                          <div className="mono text-[10px] uppercase tracking-wider t3">Shipping Address</div>
                          <p className="t2 text-xs mt-1 whitespace-pre-line">{request.shipping_address}</p>
                        </div>
                      )}
                      {request.notes && (
                        <div className="bg-t2 border bt rounded-lg p-3">
                          <div className="mono text-[10px] uppercase tracking-wider t3">Notes</div>
                          <p className="t2 text-xs mt-1">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {purchaseRequests.length === 0 && <p className="t3 text-sm">No purchase requests yet.</p>}
            </div>
          </section>
        )}

        {activeTab === 'messages' && (
          <section className="bg-surf card rounded-lg p-6 space-y-4 border bt">
            <div className="serif text-2xl font-light">Contact Messages</div>
            <div className="space-y-3">
              {contactMessages.map((message, index) => (
                <div key={message.id ?? index} className="border bt rounded-lg p-4">
                  <div className="flex justify-between gap-3">
                    <div className="font-medium text-sm">{message.name}</div>
                    <span className="mono text-[10px] uppercase tracking-wider t3">{message.email}</span>
                  </div>
                  <div className="mono text-[10px] uppercase tracking-wider t3 mt-1">{message.subject}</div>
                  <p className="t2 text-sm mt-2 whitespace-pre-line">{message.message}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'backup' && (
          <section className="space-y-6">
            <div className="bg-surf card rounded-lg p-6 space-y-4 border bt">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="serif text-2xl font-light">Site Backup</div>
                  <p className="t2 text-sm mt-1">Download current content snapshots for the website and admin operations.</p>
                </div>
                <Database className="w-5 h-5 ac" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {label: 'Products', data: products},
                  {label: 'Quotes', data: quoteRequests},
                  {label: 'Purchases', data: purchaseRequests},
                  {label: 'Messages', data: contactMessages},
                ].map(({label, data}) => (
                  <button
                    key={label}
                    onClick={() => downloadJson(`emt-${String(label).toLowerCase()}-backup.json`, data)}
                    className="bg-t2 border bt rounded-lg p-4 text-left flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="mono text-[10px] uppercase tracking-wider t3">{label}</div>
                      <div className="serif text-2xl font-light t mt-1">{Array.isArray(data) ? data.length : 0}</div>
                    </div>
                    <Download className="w-4 h-4 ac" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surf card rounded-lg p-6 space-y-4 border bt">
                <div className="serif text-2xl font-light">What This Backs Up</div>
                <ul className="space-y-2 text-sm t2">
                  <li>Current product catalog content</li>
                  <li>Quote requests and their statuses</li>
                  <li>Public purchase requests from the cart</li>
                  <li>Contact messages received from the site</li>
                  <li>Export order tracking data already in the database</li>
                </ul>
              </div>
              <div className="bg-surf card rounded-lg p-6 space-y-4 border bt">
                <div className="serif text-2xl font-light">Backup Notes</div>
                <p className="t2 text-sm leading-relaxed">
                  This is a content backup, not a full database dump. For full infrastructure recovery, export the Supabase schema and database backups from Supabase too.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
