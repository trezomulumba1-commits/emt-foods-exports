import React from 'react';
import { useI18n } from '../lib/i18n';

export default function ShipPage() {
  const { t } = useI18n();

  return (
    <div className="bg-t min-h-screen pt-48 px-8 text-t font-sans transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto w-full">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-55 mb-8">{t.ship.tag}</div>
        <h1 className="serif font-black text-[clamp(2.5rem,5vw,4rem)] max-w-[16ch] mb-8 leading-none">
          {t.ship.title}
        </h1>
        <p className="font-mono text-[12px] tracking-wider text-[#f4f4f4]/75 mb-16 uppercase">
          {t.ship.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t bt pt-16">
          <div>
            <h3 className="serif text-2xl mb-4">{t.ship.youMakeIt}</h3>
            <p className="text-t2 text-sm leading-relaxed mb-6">
              {t.ship.youMakeItDesc}
            </p>
          </div>
          <div>
            <h3 className="serif text-2xl mb-4">{t.ship.weHandle}</h3>
            <p className="text-t2 text-sm leading-relaxed mb-6">
              {t.ship.weHandleDesc}
            </p>
            <button className="btn-magnetic btn-solid mt-4">{t.ship.startShipment}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
