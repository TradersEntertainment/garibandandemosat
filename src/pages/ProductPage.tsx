import { useState } from 'react';
import { ArrowLeft, Bell, BellRing, CreditCard, ExternalLink, ShieldCheck, Truck } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { alertsStore, useAlerts } from '../lib/alerts';
import { pct, tl } from '../lib/format';
import { Viewer3D } from '../components/Viewer3D';
import { PriceChart } from '../components/PriceChart';
import { ProductCard } from '../components/ProductCard';
import { Rating, SectionHead, toast } from '../components/ui';

export function ProductPage({ id }: { id: string }) {
  const p = PRODUCTS.find((x) => x.id === id);
  const alerts = useAlerts();
  const [target, setTarget] = useState('');

  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-6 py-28 text-center">
        <h1 className="text-5xl font-extrabold">Ürün bulunamadı</h1>
        <a href="#/" className="btn-ink mt-8">Ürünlere dön</a>
      </div>
    );
  }

  const alert = alerts.find((a) => a.productId === p.id);
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const best = p.offers[0];
  const avg = p.priceHistory.averagePrice;
  const below = pct(avg, p.lowestPrice);
  const savedVsMax = p.highestPrice - p.lowestPrice;
  const similar = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const suggested = Math.round(p.lowestPrice * 0.95);

  const setAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const v = Number(target || suggested);
    if (!v || v <= 0) return;
    alertsStore.set(p.id, v);
    toast(`${tl(v)} altına düşünce haber vereceğiz`);
  };

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-4 pt-6 sm:px-6">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-3" aria-label="Sayfa yolu">
        <a href="#/" className="inline-flex items-center gap-1.5 font-semibold text-ink hover:underline"><ArrowLeft size={15} /> Ürünler</a>
        <span>/</span>
        <span>{cat?.name.split(',')[0]}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
        {/* viewer */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-[28px] border-2 border-ink bg-[#ece6d6] shadow-pop">
            <Viewer3D product={p} className="absolute inset-0" />
            <div className="eyebrow pointer-events-none absolute left-5 top-5">Sürükleyerek çevir</div>
            {p.discountPercentage ? <span className="num absolute right-5 top-5 rounded-md bg-alarm px-2.5 py-1 text-sm font-bold text-white">−%{p.discountPercentage}</span> : null}
          </div>
        </div>

        {/* summary */}
        <div>
          <div className="eyebrow">{p.brand}</div>
          <h1 className="mt-2 text-[34px] font-extrabold leading-[1.08] sm:text-[42px]">{p.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Rating value={p.rating} count={p.reviewCount} />
            <span className="text-sm text-ink-3"><span className="num font-semibold text-ink">{p.storesCount}</span> mağazada</span>
          </div>

          <div className="ticket mt-7 px-6 pb-6 pt-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em]">En ucuz · {best.storeName}</div>
                <div className="num mt-1 font-display text-[56px] font-extrabold leading-none">{tl(p.lowestPrice)}</div>
                {p.previousPrice && <div className="num mt-1.5 text-sm font-medium line-through opacity-70">{tl(p.previousPrice)}</div>}
              </div>
              <a href={best.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="btn-ink">
                {best.storeName}’a git <ExternalLink size={15} />
              </a>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t-2 border-dashed border-ink/40 pt-4 text-[13.5px]">
              <div><div className="opacity-70">6 ay ortalaması</div><div className="num font-bold">{tl(avg)} {below > 0 && <span className="font-semibold">(%{below} altında)</span>}</div></div>
              <div><div className="opacity-70">Mağazalar arası fark</div><div className="num font-bold">{tl(savedVsMax)}</div></div>
            </div>
          </div>

          <p className="mt-5 flex gap-3 rounded-2xl border border-line bg-card p-4 text-[14.5px] leading-relaxed text-ink-2">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-save" />
            <span>{p.aiAdvice}</span>
          </p>

          <form onSubmit={setAlert} className="mt-5 rounded-2xl border border-line-strong bg-card p-4">
            <div className="mb-2.5 flex items-center gap-2 text-[15px] font-bold">
              {alert ? <BellRing size={18} className="text-save" /> : <Bell size={18} />}
              {alert ? `Alarm kurulu: ${tl(alert.target)}` : 'Fiyat düşünce haber ver'}
            </div>
            <div className="flex flex-wrap gap-2.5">
              <div className="relative min-w-[160px] flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3">₺</span>
                <input
                  inputMode="numeric"
                  value={target}
                  onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))}
                  placeholder={String(suggested)}
                  aria-label="Hedef fiyat"
                  className="num h-11 w-full rounded-full border border-line-strong bg-paper pl-8 pr-4 outline-none focus:border-ink focus:ring-4 focus:ring-tag/60"
                />
              </div>
              <button className="btn-ink">{alert ? 'Güncelle' : 'Alarm kur'}</button>
              {alert && <button type="button" className="btn-ghost" onClick={() => { alertsStore.remove(p.id); toast('Alarm kaldırıldı'); }}>Kaldır</button>}
            </div>
          </form>
        </div>
      </div>

      {/* offers */}
      <section className="mt-20" aria-labelledby="offers">
        <SectionHead eyebrow="Fiyatlar" title="Tüm mağazalar" aside={<span className="text-sm text-ink-3">Ucuzdan pahalıya sıralı</span>} />
        <div className="surface overflow-hidden">
          {p.offers.map((o, i) => (
            <div key={o.id} className={`grid items-center gap-x-6 gap-y-3 border-b border-line px-5 py-4 last:border-0 md:grid-cols-[1.3fr_1.4fr_1fr_auto] ${i === 0 ? 'bg-tag-soft' : ''}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-bold">{o.storeName}</span>
                  {i === 0 && <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-tag">En ucuz</span>}
                  {o.badge && i !== 0 && <span className="rounded-md bg-paper-2 px-2 py-0.5 text-[11px] font-semibold text-ink-2">{o.badge}</span>}
                </div>
                <div className="mt-0.5 text-[13px] text-ink-3">{o.sellerName} · <Rating value={o.sellerRating} /></div>
              </div>
              <div className="space-y-1 text-[13.5px] text-ink-2">
                <div className="flex items-center gap-2"><Truck size={15} className="text-ink-3" />{o.shippingFee === 0 ? <b className="text-save">Ücretsiz kargo</b> : `+${tl(o.shippingFee)} kargo`} · {o.shippingTime}</div>
                <div className="flex items-center gap-2"><CreditCard size={15} className="text-ink-3" />{o.installments}</div>
              </div>
              <div className="md:text-right">
                <div className="num font-display text-[26px] font-extrabold leading-none">{tl(o.price)}</div>
                {i > 0 && <div className="num mt-1 text-[12.5px] text-alarm">+{tl(o.price - best.price)} daha pahalı</div>}
              </div>
              <a href={o.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className={i === 0 ? 'btn-tag' : 'btn-ghost'}>
                Mağazaya git <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* history */}
      <section className="mt-20 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHead eyebrow="Fiyat geçmişi" title="Son 6 ay" />
          <PriceChart labels={p.priceHistory.labels} prices={p.priceHistory.prices} average={avg} />
        </div>
        <div className="lg:pt-[88px]">
          <div className="surface p-6">
            <h3 className="font-sans text-[17px] font-bold tracking-normal">Şimdi almalı mıyım?</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              {p.lowestPrice <= p.priceHistory.minPrice
                ? 'Fiyat 6 ayın en düşük seviyesinde. Beklemek için güçlü bir neden yok.'
                : below > 0
                  ? `Fiyat 6 aylık ortalamanın %${below} altında. Makul bir zaman.`
                  : 'Fiyat ortalamanın üzerinde. Alarm kurup beklemek mantıklı olabilir.'}
            </p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-paper-2">
              <div className="h-full rounded-full bg-save" style={{ width: `${Math.max(6, 100 - ((p.lowestPrice - p.priceHistory.minPrice) / (p.priceHistory.maxPrice - p.priceHistory.minPrice || 1)) * 100)}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[12px] text-ink-3"><span>en pahalı</span><span>en ucuz</span></div>
          </div>
        </div>
      </section>

      {/* specs */}
      <section className="mt-20">
        <SectionHead eyebrow="Detay" title="Özellikler" />
        <dl className="surface divide-y divide-line">
          {Object.entries(p.specs).map(([k, v]) => (
            <div key={k} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[220px_1fr]">
              <dt className="text-[14px] text-ink-3">{k}</dt>
              <dd className="text-[15px] font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {similar.length > 0 && (
        <section className="mt-20">
          <SectionHead eyebrow="Benzer" title="Bunlara da bak" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{similar.map((s, i) => <ProductCard key={s.id} product={s} index={i} />)}</div>
        </section>
      )}
    </div>
  );
}
