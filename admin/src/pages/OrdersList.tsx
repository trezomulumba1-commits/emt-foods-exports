import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ExportOrder } from '../types';

export default function OrdersList() {
  const [orders, setOrders] = useState<ExportOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('export_orders').select('*').order('created_at', { ascending: false });
      if (data) setOrders(data as ExportOrder[]);
      setLoading(false);
    }
    load();
  }, []);

  const handleStatusChange = async (id: string, nextStatus: string) => {
    await supabase.from('export_orders').update({ export_status: nextStatus }).eq('id', id);
    setOrders(orders.map(o => o.id === id ? { ...o, export_status: nextStatus as any } : o));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">Shipments</h1>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-3 font-medium text-muted uppercase tracking-wider text-xs">Reference</th>
              <th className="px-6 py-3 font-medium text-muted uppercase tracking-wider text-xs">Customer</th>
              <th className="px-6 py-3 font-medium text-muted uppercase tracking-wider text-xs">Destination</th>
              <th className="px-6 py-3 font-medium text-muted uppercase tracking-wider text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-muted animate-pulse">Loading data...</td></tr>
            ) : orders.map(o => (
              <tr key={o.id} className="table-row">
                <td className="px-6 py-4 mono font-medium text-primary">{o.order_reference}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-primary">{o.customer_name}</div>
                  <div className="text-muted text-xs">{o.customer_email}</div>
                </td>
                <td className="px-6 py-4">{o.destination_country}</td>
                <td className="px-6 py-4">
                  <select 
                    value={o.export_status} 
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="input-field py-1 text-xs max-w-[200px]"
                  >
                    {['Pending', 'Preparing Products', 'Quality Inspection', 'Documentation', 'Ready for Export', 'Handed to Carrier', 'Completed', 'Cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
