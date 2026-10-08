import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  return (
    <div className="bg-t min-h-screen pt-48 px-8 text-t font-sans transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-55 mb-8">{t.nav.contact}</div>
          <h1 className="serif font-black text-[clamp(2.5rem,5vw,4rem)] mb-6 leading-none">
            {t.contact.title}
          </h1>
          <p className="text-t2 text-base leading-relaxed max-w-md mb-12">
            {t.contact.desc}
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[var(--accent)] shrink-0 mt-1" />
              <div>
                <div className="font-mono text-[10px] tracking-wider uppercase mb-1">{t.contact.office}</div>
                <div className="font-medium t">{t.contact.city || 'Lusaka, Zambia'}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-[var(--accent)] shrink-0 mt-1" />
              <div>
                <div className="font-mono text-[10px] tracking-wider uppercase mb-1">{t.contact.marketSupport}</div>
                <div className="font-medium t">+260 211 000 000</div>
                <div className="text-sm t2 mt-1">{t.contact.marketSupportDesc}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surf border bt rounded-3xl p-8 shadow-xl">
          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
              <h3 className="serif text-2xl font-bold t">{t.contact.messageSent || 'Message Sent'}</h3>
              <p className="t2 text-sm">{t.contact.getBackSoon || 'We will get back to you shortly.'}</p>
              <button onClick={() => setStatus('idle')} className="btn-ghost mt-4">{t.contact.sendAnother || 'Send another message'}</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="mono text-[10px] uppercase tracking-wider">{t.contact.name}</label>
                <input required type="text" className="w-full bg-bg border bt rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="mono text-[10px] uppercase tracking-wider">{t.contact.email}</label>
                <input required type="email" className="w-full bg-bg border bt rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="mono text-[10px] uppercase tracking-wider">{t.contact.subject}</label>
                <input required type="text" className="w-full bg-bg border bt rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="mono text-[10px] uppercase tracking-wider">{t.contact.message}</label>
                <textarea required rows={4} className="w-full bg-bg border bt rounded-xl px-4 py-3 text-sm focus:border-[var(--accent)] outline-none transition-colors resize-none" />
              </div>
              <button disabled={status === 'sending'} type="submit" className="w-full btn-primary py-4 rounded-xl shadow-lg">
                {status === 'sending' ? t.contact.sending : t.contact.sendMessage}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
