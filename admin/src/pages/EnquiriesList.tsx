import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { QuoteRequest } from '../types';

export default function EnquiriesList() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false });
      if (data) setQuotes(data as QuoteRequest[]);
      setLoading(false);
    }
    load();
  }, []);

  const handleStatusChange = async (id: string, nextStatus: string) => {
    await supabase.from('quote_requests').update({ status: nextStatus }).eq('id', id);
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: nextStatus } : q));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">Enquiries & Quotes</h1>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="table-header">
            <tr>
              <th className="px-6 py-3 font-medium text-muted uppercase tracking-wider text-xs">Customer</th>
              <th className="px-6 py-3 font-medium text-muted uppercase tracking-wider text-xs">Request Details</th>
              <th className="px-6 py-3 font-medium text-muted uppercase tracking-wider text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-muted animate-pulse">Loading data...</td></tr>
            ) : quotes.map(q => (
              <tr key={q.id} className="table-row">
                <td className="px-6 py-4">
                  <div className="font-medium text-primary">{q.customer_name}</div>
                  <div className="text-muted text-xs">{q.customer_email}</div>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <div className="font-medium">{q.product_name || 'General Enquiry'}</div>
                  <div className="text-muted text-xs truncate mt-1" title={q.message}>{q.message}</div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={q.status || 'Pending'} 
                    onChange={(e) => q.id && handleStatusChange(q.id, e.target.value)}
                    className="input-field py-1 text-xs max-w-[150px]"
                  >
                    {['Pending', 'Reviewed', 'Replied', 'Closed'].map(s => (
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
