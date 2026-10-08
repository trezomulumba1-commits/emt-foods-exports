import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Package, Truck, FileText, Mail, ArrowRight, Clock3 } from 'lucide-react';

type ActivityItem = {
  title: string;
  detail: string;
  timestamp: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    quotes: 0,
    messages: 0,
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError('');

      try {
        const [productsCount, ordersCount, quotesCount, messagesCount, recentProducts, recentOrders, recentQuotes] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact' }),
          supabase.from('export_orders').select('id', { count: 'exact' }),
          supabase.from('quote_requests').select('id', { count: 'exact' }),
          supabase.from('contact_messages').select('id', { count: 'exact' }),
          supabase.from('products').select('name, category, created_at').order('created_at', { ascending: false }).limit(3),
          supabase.from('export_orders').select('order_reference, customer_name, export_status, created_at').order('created_at', { ascending: false }).limit(3),
          supabase.from('quote_requests').select('customer_name, product_name, status, created_at').order('created_at', { ascending: false }).limit(3),
        ]);

        const nextActivity: ActivityItem[] = [];
        (recentProducts.data || []).forEach((item) => {
          nextActivity.push({
            title: `New product in ${item.category || 'catalogue'}`,
            detail: item.name || 'Catalog item added',
            timestamp: item.created_at || new Date().toISOString(),
          });
        });
        (recentOrders.data || []).forEach((item) => {
          nextActivity.push({
            title: `Shipment ${item.order_reference || 'update'}`,
            detail: `${item.customer_name || 'Buyer'} · ${item.export_status || 'Pending'}`,
            timestamp: item.created_at || new Date().toISOString(),
          });
        });
        (recentQuotes.data || []).forEach((item) => {
          nextActivity.push({
            title: `Quote request from ${item.customer_name || 'buyer'}`,
            detail: item.product_name || item.status || 'Awaiting review',
            timestamp: item.created_at || new Date().toISOString(),
          });
        });

        setStats({
          products: productsCount.count || 0,
          orders: ordersCount.count || 0,
          quotes: quotesCount.count || 0,
          messages: messagesCount.count || 0,
        });

        setActivity(nextActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6));
      } catch {
        setError('Unable to reach the Supabase dashboard tables. Verify the admin environment variables and database permissions.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = useMemo(
    () => [
      { label: 'Total Products', value: stats.products, icon: Package },
      { label: 'Active Shipments', value: stats.orders, icon: Truck },
      { label: 'Pending Quotes', value: stats.quotes, icon: FileText },
      { label: 'Unread Messages', value: stats.messages, icon: Mail },
    ],
    [stats],
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Overview</h1>
          <p className="text-xs font-mono uppercase tracking-wider text-muted mt-2">Supabase-backed operational dashboard</p>
        </div>
        <div className="badge border-accent/20 bg-accent/5 text-accent shadow-[0_0_15px_rgba(255,255,255,0.1)]">System Live</div>
      </div>

      {error ? (
        <div className="card p-4 text-sm text-danger border border-danger/30 bg-surface">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={stat.label} className="card p-6 transition-all hover:scale-[1.02] hover:border-accent/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] cursor-default" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-center justify-between text-muted mb-4 opacity-70">
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-accent" />
            </div>
            <div className="text-4xl font-black text-primary tracking-tight">{loading ? '…' : stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6">
        <div className="card p-6 min-h-[300px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-subtle">
            <h3 className="text-xs font-mono uppercase tracking-widest text-primary font-bold">Recent Activity</h3>
            <div className="flex items-center gap-2 text-accent text-[10px] font-mono uppercase tracking-widest bg-accent/10 px-2 py-1 rounded">
              <Clock3 className="w-3 h-3" />
              Live sync
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-sm text-muted animate-pulse">Loading Supabase activity...</div>
            ) : activity.length === 0 ? (
              <div className="text-sm text-muted">No recent activity recorded yet.</div>
            ) : (
              activity.map((item, index) => (
                <div key={`${item.title}-${item.timestamp}-${index}`} className="flex gap-4 p-4 rounded-xl border border-subtle bg-subtle/30 hover:bg-subtle/60 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0 animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                  <div>
                    <div className="text-sm font-bold text-primary">{item.title}</div>
                    <div className="text-xs text-muted mt-1 opacity-80">{item.detail}</div>
                    <div className="text-[10px] font-mono tracking-wider text-muted mt-2 opacity-60">{new Date(item.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6 min-h-[300px] flex flex-col">
          <h3 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-6 pb-4 border-b border-subtle">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 flex-1">
            <button onClick={() => navigate('/products')} className="group flex flex-col justify-center gap-2 p-5 rounded-xl border border-subtle bg-subtle/30 hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] transition-all text-left">
              <span className="text-sm font-bold flex justify-between items-center w-full">New Product <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" /></span>
              <span className="text-xs opacity-60">Add to catalogue</span>
            </button>
            <button onClick={() => navigate('/enquiries')} className="group flex flex-col justify-center gap-2 p-5 rounded-xl border border-subtle bg-subtle/30 hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] transition-all text-left">
              <span className="text-sm font-bold flex justify-between items-center w-full">Review Quotes <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" /></span>
              <span className="text-xs opacity-60">Process buyer requests</span>
            </button>
            <button onClick={() => navigate('/orders')} className="group flex flex-col justify-center gap-2 p-5 rounded-xl border border-subtle bg-subtle/30 hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] transition-all text-left">
              <span className="text-sm font-bold flex justify-between items-center w-full">Update Shipments <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" /></span>
              <span className="text-xs opacity-60">Manage order statuses</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
