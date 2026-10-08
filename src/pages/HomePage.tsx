import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal], .hero, .fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* === Hero === */}
      <section className="relative h-screen w-full bg-t overflow-hidden z-10 hero is-in pt-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-[28vw] tracking-tighter text-t mix-blend-luminosity opacity-[0.08] whitespace-nowrap pointer-events-none z-1 leading-none">{t.home.heroBg}</div>
        
        <div className="absolute bottom-0 left-1/2 w-full max-w-[1500px] h-[45vh] -translate-x-1/2 z-10 overflow-hidden opacity-30 transition-all duration-[1500ms] pointer-events-none">
          <img src="/air_freight_cargo.png" alt="Air freight cargo" className="w-full h-full object-cover filter grayscale contrast-125" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg pointer-events-none"></div>
        </div>

        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-8 h-full flex flex-col justify-center pb-[20vh]">
          <div className="absolute top-8 left-8 flex gap-5 items-center font-mono text-[11px] tracking-[0.18em] uppercase opacity-70 text-[var(--accent)]">
            <span>{t.home.heroSubtitle}</span>
            <span className="w-1 h-1 bg-current rounded-full opacity-40"></span>
            <span>{t.home.heroLocation}</span>
            <span className="w-1 h-1 bg-current rounded-full opacity-40"></span>
            <span>{t.home.heroEst}</span>
          </div>

          <h1 className="serif font-black text-[clamp(3.2rem,8.5vw,8.5rem)] tracking-tight leading-[0.88] max-w-4xl m-0 text-t">
            <span className="block overflow-hidden pb-[0.08em]"><span className="block translate-y-0 transition-transform duration-[1300ms]">{t.home.hero1}</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span className="block translate-y-0 transition-transform duration-[1300ms]">{t.home.hero2}</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span className="block translate-y-0 transition-transform duration-[1300ms]">{t.home.hero3}</span></span>
          </h1>
          
          <p data-cursor="Documentation" className="mt-9 max-w-xl text-[1.0625rem] leading-[1.6] text-t2">
            {t.home.heroDesc}
          </p>

          <div className="mt-10 flex gap-4 flex-wrap">
            <button data-cursor="Explore" onClick={() => navigate('/catalog')} className="btn-magnetic btn-solid">{t.home.browseCatalog} <span className="arrow">→</span></button>
            <button data-cursor="Ship" onClick={() => navigate('/ship')} className="btn-magnetic">{t.home.shipGoods} <span className="arrow">→</span></button>
          </div>
        </div>

        <div className="absolute bottom-10 left-8 z-20 font-mono text-[10px] tracking-[0.22em] uppercase flex items-center gap-3 text-t3">
          {t.home.scroll}<span className="block w-px h-8 bg-current opacity-60 animate-[cueline_2.4s_infinite]"></span>
        </div>
      </section>

      {/* === Bento Quick Links === */}
      <section className="py-12 px-8 bg-bg" data-reveal>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-surf rounded-xl border bt flex flex-col items-start gap-3">
              <div className="mono text-[10px] uppercase text-t3">{t.home.quickLinks.jerseys}</div>
              <div className="serif text-lg font-bold text-t">{t.home.quickLinks.jerseysTitle}</div>
              <p className="text-t2 text-sm">{t.home.quickLinks.jerseysDesc}</p>
              <button onClick={() => navigate('/catalog')} className="mt-3 text-xs font-mono uppercase text-accent">{t.home.quickLinks.exploreJerseys}</button>
            </div>
            <div className="p-4 bg-surf rounded-xl border bt flex flex-col items-start gap-3">
              <div className="mono text-[10px] uppercase text-t3">{t.home.quickLinks.fabrics}</div>
              <div className="serif text-lg font-bold text-t">{t.home.quickLinks.fabricsTitle}</div>
              <p className="text-t2 text-sm">{t.home.quickLinks.fabricsDesc}</p>
              <button onClick={() => navigate('/catalog')} className="mt-3 text-xs font-mono uppercase text-accent">{t.home.quickLinks.browseFabrics}</button>
            </div>
            <div className="p-4 bg-surf rounded-xl border bt flex flex-col items-start gap-3">
              <div className="mono text-[10px] uppercase text-t3">{t.home.quickLinks.export}</div>
              <div className="serif text-lg font-bold text-t">{t.home.quickLinks.exportTitle}</div>
              <p className="text-t2 text-sm">{t.home.quickLinks.exportDesc}</p>
              <button onClick={() => navigate('/ship')} className="mt-3 text-xs font-mono uppercase text-accent">{t.home.quickLinks.startShipment}</button>
            </div>
            <div className="p-4 bg-surf rounded-xl border bt flex flex-col items-start gap-3">
              <div className="mono text-[10px] uppercase text-t3">{t.home.quickLinks.cart}</div>
              <div className="serif text-lg font-bold text-t">{t.home.quickLinks.cartTitle}</div>
              <p className="text-t2 text-sm">{t.home.quickLinks.cartDesc}</p>
              <button onClick={() => navigate('/catalog')} className="mt-3 text-xs font-mono uppercase text-accent">{t.home.quickLinks.viewCatalog}</button>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-20 bg-t text-t">
        
        {/* === Manifesto === */}
        <section className="py-48 px-8 bg-surf" data-reveal>
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="text-label mb-8">{t.home.workLabel}</div>
            <p className="serif font-extrabold text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.15] tracking-tight max-w-4xl">
              <span className="block">{t.home.workTitle1}</span>
              <span className="block">{t.home.workTitle2}</span>
              <span className="block">{t.home.workTitle3}</span>
              <span className="block">{t.home.workTitle4}</span>
              <span className="block">{t.home.workTitle5}</span>
            </p>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t bt pt-8">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-t3">{t.home.founded}</span>
                <strong className="font-mono font-medium text-[13px] tracking-wider text-t">{t.home.heroLocation}</strong>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-t3">{t.home.focus}</span>
                <strong className="font-mono font-medium text-[13px] tracking-wider text-t">{t.home.focusValue}</strong>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-t3">{t.home.standard}</span>
                <strong className="font-mono font-medium text-[13px] tracking-wider text-t">{t.home.standardValue}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* === Image Gallery (Fabrics & Seeds) - staggered layout === */}
        <section className="py-24 px-8 bg-bg-2" data-reveal>
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="text-label mb-12">{t.home.sourcingLabel}</div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
              <div className="md:col-span-3 md:row-span-2 fade-up relative overflow-hidden rounded-xl border bt bg-surf">
                <img src="/premium_export_seeds.png" alt="Premium Seeds" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-black/40 text-white px-3 py-2 rounded">{t.home.premiumSeeds}</div>
              </div>
              <div className="md:col-span-2 md:row-span-1 fade-up overflow-hidden rounded-xl border bt bg-surf">
                <img src="/images/Afrohemian.jpg" alt="Afrohemian Fabric" className="w-full h-full object-cover" />
              </div>
              <div className="md:col-span-1 md:row-span-1 fade-up overflow-hidden rounded-xl border bt bg-surf">
                <img src="/images/farigirl.png" alt="Farigirl" className="w-full h-full object-cover" />
              </div>
              <div className="md:col-span-2 fade-up overflow-hidden rounded-xl border bt bg-surf">
                <img src="/flowing_fabric.png" alt="Fabric Sample" className="w-full h-[260px] object-cover" />
              </div>
              <div className="md:col-span-4 fade-up overflow-hidden rounded-xl border bt bg-surf relative">
                <img src="/zambia_merch.png" alt="Merchandise Showcase" className="w-full h-[260px] object-cover" />
                <div className="absolute top-4 right-4 bg-surf/80 text-t px-3 py-1 rounded">{t.home.jerseysApparel}</div>
              </div>
            </div>
          </div>
        </section>

        {/* === Featured Jerseys === */}
        <section className="py-20 px-8 bg-surf" data-reveal>
          <div className="max-w-[1200px] mx-auto">
            <div className="text-label mb-6">{t.home.featuredLabel}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['images/dried_bream.png','images/dried_kapenta.png','images/dried_mulamba.png','dried_goods.png'].map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border bt bg-bg p-3 flex flex-col items-start gap-3">
                  <img src={`/${img}`} alt={`product-${i}`} className="w-full h-40 object-contain" />
                  <div className="serif text-sm font-semibold text-t">{t.home.premiumCatch} {i+1}</div>
                  <div className="text-t2 text-xs">{t.home.catchDesc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === Customer Stories === */}
        <section className="py-20 px-8 bg-bg" data-reveal>
          <div className="max-w-[1200px] mx-auto">
            <div className="text-label mb-6">{t.home.storiesLabel}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[t.home.story1, t.home.story2, t.home.story3].map((story, i) => (
                <div key={i} className="p-6 rounded-xl bg-surf border bt">
                  <div className="serif text-[15px] font-bold mb-2">{i===0? 'Ngoma Co-op' : i===1 ? 'Lusaka Tailors' : 'A. Importers'}</div>
                  <div className="text-t2 text-sm">{story}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === Two Doors === */}
        <section className="bg-surf py-36 px-8" data-reveal>
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="text-label mb-8">{t.home.twoDoorsLabel}</div>
            <h2 className="serif text-[clamp(2.5rem,5vw,4rem)] max-w-3xl mb-20 text-t">{t.home.twoDoorsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="border-t bt pt-8 flex flex-col fade-up">
                <div className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-55 mb-8 text-t">{t.home.doorALabel}</div>
                <h3 className="serif text-[clamp(1.85rem,3vw,2.6rem)] mb-4 max-w-md leading-none text-t">{t.home.doorATitle}</h3>
                <p className="font-mono text-[12px] tracking-wider text-t3 mb-8 uppercase">{t.home.doorASub}</p>
                <p data-cursor="Documentation" className="text-t2 text-base leading-[1.7] max-w-lg mb-8">
                  {t.home.doorADesc}
                </p>
                <button onClick={() => navigate('/catalog')} className="mt-auto pt-4 font-mono text-[11px] tracking-[0.18em] uppercase flex items-center gap-3 border-t bt self-start text-t hover:gap-6 transition-all">
                  {t.home.seeCatalog} <span className="arrow">→</span>
                </button>
              </div>
              <div className="border-t bt pt-8 flex flex-col fade-up">
                <div className="font-mono text-[11px] tracking-[0.2em] uppercase opacity-55 mb-8 text-t">{t.home.doorBLabel}</div>
                <h3 className="serif text-[clamp(1.85rem,3vw,2.6rem)] mb-4 max-w-md leading-none text-t">{t.home.doorBTitle}</h3>
                <p className="font-mono text-[12px] tracking-wider text-t3 mb-8 uppercase">{t.home.doorBSub}</p>
                <p className="text-t2 text-base leading-[1.7] max-w-lg mb-8">
                  {t.home.doorBDesc}
                </p>
                <button onClick={() => navigate('/ship')} className="mt-auto pt-4 font-mono text-[11px] tracking-[0.18em] uppercase flex items-center gap-3 border-t bt self-start text-t hover:gap-6 transition-all">
                  {t.home.startShipmentBtn} <span className="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* === Catalog CTA === */}
        <section className="bg-bg-2 py-24 px-8" data-reveal>
          <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="text-label mb-4">{t.home.ctaLabel}</div>
              <h2 className="serif text-[clamp(2rem,4vw,3.5rem)] text-t leading-none">{t.home.ctaTitle}</h2>
            </div>
            <button data-cursor="Explore" onClick={() => navigate('/catalog')} className="btn-magnetic btn-solid shrink-0">
              {t.home.openCatalog} <span className="arrow">→</span>
            </button>
          </div>
        </section>

        {/* === Interlude === */}
        <section className="h-[100vh] bg-bg relative flex items-center justify-center overflow-hidden">
          <div className="absolute font-serif font-black text-[18vw] tracking-[0.2em] text-t opacity-5 whitespace-nowrap pointer-events-none uppercase">{t.home.quality}</div>
          <div className="relative z-10 text-center px-8 max-w-[600px]">
            <div className="text-label justify-center mb-8 border-none before:hidden">{t.home.interludeLabel}</div>
            <p className="serif font-extrabold text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.2] text-t">{t.home.interludeTitle1}<br/>{t.home.interludeTitle2}</p>
          </div>
        </section>

        {/* === Marquee === */}
        <div className="bg-surf border-y bt py-6 overflow-hidden whitespace-nowrap">
          <div className="inline-block font-mono text-[14px] tracking-[0.2em] uppercase text-t animate-[marquee_30s_linear_infinite]">
            <span>LUSAKA</span> <span className="inline-block w-1 h-1 bg-current rounded-full mx-8 opacity-40"></span>
            <span>JOHANNESBURG</span> <span className="inline-block w-1 h-1 bg-current rounded-full mx-8 opacity-40"></span>
            <span>ROTTERDAM</span> <span className="inline-block w-1 h-1 bg-current rounded-full mx-8 opacity-40"></span>
            <span>DUBAI</span> <span className="inline-block w-1 h-1 bg-current rounded-full mx-8 opacity-40"></span>
            <span>SHANGHAI</span> <span className="inline-block w-1 h-1 bg-current rounded-full mx-8 opacity-40"></span>
            <span>LONDON</span> <span className="inline-block w-1 h-1 bg-current rounded-full mx-8 opacity-40"></span>
            <span>LUSAKA</span> <span className="inline-block w-1 h-1 bg-current rounded-full mx-8 opacity-40"></span>
            <span>JOHANNESBURG</span> <span className="inline-block w-1 h-1 bg-current rounded-full mx-8 opacity-40"></span>
            <span>ROTTERDAM</span> <span className="inline-block w-1 h-1 bg-current rounded-full mx-8 opacity-40"></span>
            <span>DUBAI</span> <span className="inline-block w-1 h-1 bg-current rounded-full mx-8 opacity-40"></span>
          </div>
        </div>

        {/* === Footer === */}
        <footer className="bg-bg-3 pt-20 pb-8 px-8 border-t bt mt-20">
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
              <div>
                <h3 className="serif font-black text-2xl mb-4 text-t2">EMT FOODS</h3>
                <p className="text-t2 text-[0.9rem] max-w-sm leading-[1.7]">{t.home.footerDesc}</p>
              </div>
              <div className="flex flex-col gap-5">
                <h4 className="font-mono font-medium text-[11px] tracking-[0.2em] uppercase text-t3">{t.home.footerCatalog}</h4>
                <div className="flex flex-col gap-3">
                  <a href="/catalog" className="text-[0.9rem] text-t2 hover:text-t hover:translate-x-1 transition-all">{t.home.footerAg}</a>
                  <a href="/catalog" className="text-[0.9rem] text-t2 hover:text-t hover:translate-x-1 transition-all">{t.home.footerTextiles}</a>
                  <a href="/catalog" className="text-[0.9rem] text-t2 hover:text-t hover:translate-x-1 transition-all">{t.home.footerFood}</a>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <h4 className="font-mono font-medium text-[11px] tracking-[0.2em] uppercase text-t3">{t.home.footerServices}</h4>
                <div className="flex flex-col gap-3">
                  <a href="/ship" className="text-[0.9rem] text-t2 hover:text-t hover:translate-x-1 transition-all">{t.home.footerDocs}</a>
                  <a href="/ship" className="text-[0.9rem] text-t2 hover:text-t hover:translate-x-1 transition-all">{t.home.footerCustoms}</a>
                  <a href="/ship" className="text-[0.9rem] text-t2 hover:text-t hover:translate-x-1 transition-all">{t.home.footerFreight}</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
