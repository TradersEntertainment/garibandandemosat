import { useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpDown, RotateCcw, Truck, TrendingDown } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import type { Product } from '../types';
import { go } from '../lib/router';
import { pct, tl } from '../lib/format';
import { ProductCard } from '../components/ProductCard';
import { ProductThumb } from '../components/ProductThumb';
import { Viewer3D } from '../components/Viewer3D';
import { SectionHead, Sparkline } from '../components/ui';

const FEATURED = ['p-1', 'p-3', 'p-7', 'p-2'].map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean);
const SHORT: Record<string, string> = {
  telefon: 'Telefon & ses', bilgisayar: 'Bilgisayar', 'ev-yasam': 'Ev & yaşam', supermarket: 'Market', 'oyun-konsol': 'Oyun', moda: 'Moda & spor', 'kisisel-bakim': 'Kişisel bakım',
};
const POPULAR = ['iPhone 16', 'Dyson', 'PlayStation', 'Airfryer', 'Zeytinyağı', 'MacBook'];

function HeroStage() {
  const [i, setI] = useState(0);
  const p = FEATURED[i];
  const best = p.offers[0];
  return (
    <div className="relative">
      <div className="relative aspect-[5/5.2] overflow-hidden rounded-[28px] border-2 border-ink bg-[#ece6d6] shadow-pop sm:aspect-[5/4.6] lg:aspect-[5/5.4]">
        <Viewer3D key={p.id} product={p} className="absolute inset-0" />

        <div className="pointer-events-none absolute left-5 top-5">
          <div className="eyebrow">Canlı 3B · sürükleyerek çevir</div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-5 right-5 sm:right-auto">
          <div className="ticket max-w-[300px] px-5 pb-4 pt-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em]">En ucuz · {best.storeName}</div>
            <div className="num mt-1 font-display text-[40px] font-extrabold leading-none">{tl(p.lowestPrice)}</div>
            <div className="mt-1.5 line-clamp-1 text-[13px] font-medium">{p.title}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Öne çıkan ürünler">
        {FEATURED.map((f, k) => (
          <button key={f.id} role="tab" aria-selected={k === i} data-active={k === i} onClick={() => setI(k)} className="chip">
            {f.title.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
        <button onClick={() => go(`/urun/${p.id}`)} className="btn-ink ml-auto !py-2">
          Fiyatları gör <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function Hero({ onChip }: { onChip: (q: string) => void }) {
  return (
    <section className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:gap-14 lg:pt-14">
      <div>
        <div className="eyebrow mb-5">Fiyat karşılaştırma · Market · Usta & hizmet</div>
        <h1 className="text-[52px] font-extrabold leading-[0.98] sm:text-[72px] lg:text-[84px]">
          Aynı şeye{' '}
          <span className="relative whitespace-nowrap">
            <span className="relative z-10">fazla</span>
            <span aria-hidden className="absolute -inset-x-1 bottom-1 top-[52%] -z-0 -rotate-1 bg-tag" />
          </span>{' '}
          ödeme.
        </h1>
        <p className="mt-6 max-w-[34rem] text-[18px] leading-relaxed text-ink-2">
          Ürün fiyatlarını, market sepetini ve usta tekliflerini yan yana koy. En ucuzu 6 aylık fiyat geçmişiyle birlikte gör; indirim gerçek mi, hemen anla.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button className="btn-tag" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>Ürünlere göz at</button>
          <a href="#/market" className="btn-ghost">Market sepetimi hesapla</a>
        </div>

        <div className="mt-10">
          <div className="eyebrow mb-3">Sık aranan</div>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((t) => (
              <button key={t} className="chip" onClick={() => onChip(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      <HeroStage />
    </section>
  );
}

function Drops() {
  const top = useMemo(() => [...PRODUCTS].sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0)).slice(0, 4), []);
  return (
    <section className="border-y border-line bg-paper-2/60">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6">
        <SectionHead
          eyebrow="Bu hafta"
          title="En çok düşen fiyatlar"
          aside={<span className="inline-flex items-center gap-1.5 text-sm text-ink-3"><TrendingDown size={16} className="text-save" /> 6 ayın en düşük seviyesine yaklaşanlar</span>}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {top.map((p) => (
            <button key={p.id} onClick={() => go(`/urun/${p.id}`)} className="group surface flex items-center gap-4 p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-lift">
              <ProductThumb product={p} spin={false} className="h-[92px] w-[92px] shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-[13.5px] font-semibold leading-snug">{p.title}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="num font-display text-xl font-extrabold">{tl(p.lowestPrice)}</span>
                  <span className="num rounded bg-alarm px-1.5 py-0.5 text-[11px] font-bold text-white">−%{p.discountPercentage}</span>
                </div>
                <Sparkline values={p.priceHistory.prices} className="mt-1.5 h-6 w-full" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

type Sort = 'rec' | 'price' | 'discount' | 'rating';

function Catalog({ q, setQ }: { q: string; setQ: (s: string) => void }) {
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState<Sort>('rec');
  const [store, setStore] = useState('all');
  const [free, setFree] = useState(false);
  const [low, setLow] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);

  const cats = useMemo(
    () => CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({ ...c, count: PRODUCTS.filter((p) => p.category === c.id).length })).filter((c) => c.count > 0),
    [],
  );
  const stores = useMemo(() => [...new Set(PRODUCTS.flatMap((p) => p.offers.map((o) => o.storeName)))].sort(), []);

  const list = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('tr');
    const out = PRODUCTS.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (s && !(p.title + p.brand + p.tags.join(' ')).toLocaleLowerCase('tr').includes(s)) return false;
      if (store !== 'all' && !p.offers.some((o) => o.storeName === store)) return false;
      if (free && !p.freeShippingAvailable) return false;
      if (low && p.lowestPrice > p.priceHistory.minPrice) return false;
      return true;
    });
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      rec: (a, b) => pct(b.priceHistory.averagePrice, b.lowestPrice) - pct(a.priceHistory.averagePrice, a.lowestPrice),
      price: (a, b) => a.lowestPrice - b.lowestPrice,
      discount: (a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0),
      rating: (a, b) => b.rating - a.rating,
    };
    return out.sort(by[sort]);
  }, [q, cat, sort, store, free, low]);

  const dirty = cat !== 'all' || q || store !== 'all' || free || low || sort !== 'rec';
  const reset = () => { setCat('all'); setQ(''); setStore('all'); setFree(false); setLow(false); setSort('rec'); };

  return (
    <section id="catalog" ref={anchor} className="mx-auto max-w-[1240px] scroll-mt-28 px-4 py-16 sm:px-6">
      <SectionHead eyebrow="Katalog" title={q ? `“${q}” için sonuçlar` : 'Tüm ürünler'} aside={<span className="num text-sm text-ink-3">{list.length} ürün</span>} />

      <div className="scroll-x -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <button className="chip shrink-0" data-active={cat === 'all'} onClick={() => setCat('all')}>Hepsi <span className="num opacity-60">{PRODUCTS.length}</span></button>
        {cats.map((c) => (
          <button key={c.id} className="chip shrink-0" data-active={cat === c.id} onClick={() => setCat(c.id)}>
            {SHORT[c.id] ?? c.name} <span className="num opacity-60">{c.count}</span>
          </button>
        ))}
      </div>

      <div className="mb-7 flex flex-wrap items-center gap-2.5 border-y border-line py-3.5">
        <label className="chip !cursor-pointer !gap-2">
          <ArrowUpDown size={14} />
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="cursor-pointer bg-transparent outline-none" aria-label="Sırala">
            <option value="rec">Önerilen (ortalamanın altı)</option>
            <option value="price">En düşük fiyat</option>
            <option value="discount">En yüksek indirim</option>
            <option value="rating">En yüksek puan</option>
          </select>
        </label>
        <label className="chip !cursor-pointer">
          <select value={store} onChange={(e) => setStore(e.target.value)} className="cursor-pointer bg-transparent outline-none" aria-label="Mağaza">
            <option value="all">Tüm mağazalar</option>
            {stores.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <button className="chip" data-active={free} onClick={() => setFree((v) => !v)}><Truck size={14} /> Ücretsiz kargo</button>
        <button className="chip" data-active={low} onClick={() => setLow((v) => !v)}><TrendingDown size={14} /> 6 ayın en düşüğü</button>
        {dirty && (
          <button className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink" onClick={reset}>
            <RotateCcw size={14} /> Temizle
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="surface grid place-items-center gap-3 px-6 py-20 text-center">
          <div className="font-display text-3xl font-extrabold">Sonuç yok</div>
          <p className="max-w-sm text-ink-3">Filtreleri gevşetmeyi ya da başka bir arama yapmayı dene.</p>
          <button className="btn-ink" onClick={reset}>Filtreleri temizle</button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </section>
  );
}

function Promos() {
  return (
    <section className="mx-auto grid max-w-[1240px] gap-5 px-4 sm:px-6 md:grid-cols-2">
      <a href="#/market" className="group relative overflow-hidden rounded-[28px] border-2 border-ink bg-tag p-8 shadow-pop transition hover:-translate-y-0.5 sm:p-10">
        <div className="eyebrow !text-ink/70">Market sepeti</div>
        <h3 className="mt-3 max-w-[16ch] text-[36px] font-extrabold leading-[1.02] sm:text-[44px]">Sepetin hangi markette ucuz?</h3>
        <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-ink/80">Migros, CarrefourSA, ŞOK ve A101 fiyatlarını yan yana koy; ürünleri en ucuz olduğu markete böl.</p>
        <span className="mt-7 inline-flex items-center gap-2 font-bold">Hesapla <ArrowRight size={18} className="transition group-hover:translate-x-1" /></span>
      </a>
      <a href="#/hizmetler" className="group relative overflow-hidden rounded-[28px] border-2 border-ink bg-ink p-8 text-paper shadow-[4px_4px_0_0_#ffd84d] transition hover:-translate-y-0.5 sm:p-10">
        <div className="eyebrow !text-paper/60">Usta & hizmet</div>
        <h3 className="mt-3 max-w-[16ch] text-[36px] font-extrabold leading-[1.02] !text-paper sm:text-[44px]">Temizlik, tesisat, tamir.</h3>
        <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-paper/75">Teklif beklemeden başlangıç fiyatını gör. Daire büyüklüğünü ya da arıza türünü seç, fiyat anında güncellensin.</p>
        <span className="mt-7 inline-flex items-center gap-2 font-bold text-tag">Ustaları gör <ArrowRight size={18} className="transition group-hover:translate-x-1" /></span>
      </a>
    </section>
  );
}

function Principles() {
  const items = [
    ['1', 'Sıralamayı fiyat belirler', 'En üstte reklam veren değil, gerçekten en ucuz teklif durur.'],
    ['2', 'İndirim gerçek mi, gör', 'Her üründe 6 aylık fiyat geçmişi var; “yüzde 50 indirim” iddiası ortalamayla kıyaslanır.'],
    ['3', 'Fiyat düşünce haber al', 'Hedef fiyatını gir, alarmlarım listesinde takip et.'],
  ];
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6">
      <SectionHead eyebrow="Kurallarımız" title="Üç basit söz" />
      <div className="grid gap-px overflow-hidden rounded-[24px] border border-line-strong bg-line-strong md:grid-cols-3">
        {items.map(([n, t, d]) => (
          <div key={n} className="bg-card p-8">
            <div className="font-display text-[56px] font-extrabold leading-none text-tag [-webkit-text-stroke:2px_#14110f]">{n}</div>
            <h3 className="mt-5 text-[22px] font-bold">{t}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Home() {
  const [q, setQ] = useState('');
  const chip = (t: string) => {
    setQ(t);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <Hero onChip={chip} />
      <Drops />
      <Catalog q={q} setQ={setQ} />
      <Promos />
      <Principles />
    </>
  );
}


