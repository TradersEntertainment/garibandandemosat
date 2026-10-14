import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock, MapPin, Paintbrush, Search, ShieldCheck, Smartphone, Sparkles, Truck, Wrench, KeyRound } from 'lucide-react';
import { SERVICES } from '../data/services';
import type { ServiceItem } from '../types';
import { go } from '../lib/router';
import { tl } from '../lib/format';
import { Rating, toast } from '../components/ui';

const ICON: Record<ServiceItem['category'], typeof Wrench> = {
  temizlik: Sparkles,
  tamir: Wrench,
  elektronik: Smartphone,
  boya: Paintbrush,
  cilingir: KeyRound,
  nakliyat: Truck,
};
const CATS: { id: string; label: string }[] = [
  { id: 'all', label: 'Hepsi' },
  { id: 'temizlik', label: 'Temizlik' },
  { id: 'tamir', label: 'Tesisat & kombi' },
  { id: 'elektronik', label: 'Telefon & elektronik' },
  { id: 'boya', label: 'Boya & badana' },
  { id: 'cilingir', label: 'Çilingir' },
  { id: 'nakliyat', label: 'Nakliyat' },
];

export function ServicesPage() {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('tr');
    return SERVICES.filter((x) => (cat === 'all' || x.category === cat) && (!s || (x.title + x.shortDesc + x.tags.join(' ')).toLocaleLowerCase('tr').includes(s)));
  }, [cat, q]);

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-4 pt-10 sm:px-6">
      <div className="eyebrow mb-3">Usta & hizmet</div>
      <h1 className="max-w-[16ch] text-[44px] font-extrabold leading-[1.02] sm:text-[64px]">Teklif beklemeden fiyatı gör.</h1>
      <p className="mt-4 max-w-xl text-[17px] text-ink-2">Temizlik, tesisat, tamir ve nakliye için başlangıç fiyatı ve piyasa ortalaması yan yana. Kapsamı seç, fiyat anında güncellensin.</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-[340px]">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ne lazım? (örn. kombi, temizlik)" aria-label="Hizmet ara" className="h-11 w-full rounded-full border border-line-strong bg-card pl-11 pr-4 outline-none focus:border-ink focus:ring-4 focus:ring-tag/60" />
        </div>
        <div className="scroll-x -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {CATS.map((c) => <button key={c.id} className="chip shrink-0" data-active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</button>)}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((s, i) => {
          const Icon = ICON[s.category];
          const top = s.providers[0];
          return (
            <button key={s.id} onClick={() => go(`/hizmet/${s.id}`)} style={{ animationDelay: `${i * 40}ms` }} className="surface group flex flex-col p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lift animate-rise">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-tag shadow-[3px_3px_0_0_#14110f] transition group-hover:-rotate-3"><Icon size={26} strokeWidth={1.8} /></div>
              <div className="eyebrow mt-5">{s.categoryLabel}</div>
              <h3 className="mt-1.5 line-clamp-2 min-h-[2.5em] font-sans text-[16px] font-bold leading-snug tracking-normal">{s.title}</h3>
              <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-ink-3">{s.shortDesc}</p>
              <div className="mt-auto border-t border-dashed border-line-strong pt-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[12px] text-ink-3">başlangıç</div>
                    <div className="num font-display text-[26px] font-extrabold leading-none">{tl(s.baseFloorPrice)}</div>
                  </div>
                  <div className="text-right">
                    <div className="num text-[12.5px] text-ink-3 line-through">{tl(s.armutAveragePrice)}</div>
                    <div className="num text-[12.5px] font-bold text-save">{tl(s.savings)} daha az</div>
                  </div>
                </div>
                {top && <div className="mt-3 flex items-center justify-between text-[12.5px] text-ink-3"><Rating value={top.rating} /> <span>{s.providers.length} usta</span></div>}
              </div>
            </button>
          );
        })}
      </div>
      {list.length === 0 && <div className="surface mt-8 py-16 text-center text-ink-3">Bu aramayla eşleşen hizmet yok.</div>}
    </div>
  );
}

const initials = (n: string) => n.split(/[\s&]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr');

export function ServiceDetail({ id }: { id: string }) {
  const s = SERVICES.find((x) => x.id === id);
  const [optId, setOptId] = useState<string | null>(null);
  const [asked, setAsked] = useState<string | null>(null);

  if (!s) {
    return (
      <div className="mx-auto max-w-xl px-6 py-28 text-center">
        <h1 className="text-5xl font-extrabold">Hizmet bulunamadı</h1>
        <a href="#/hizmetler" className="btn-ink mt-8">Hizmetlere dön</a>
      </div>
    );
  }

  const Icon = ICON[s.category];
  const opt = s.options.find((o) => o.id === optId) ?? s.options[0];
  const m = opt.multiplier;
  const floor = Math.round(s.baseFloorPrice * m);
  const market = Math.round(s.armutAveragePrice * m);
  const providers = [...s.providers].sort((a, b) => a.price - b.price);

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-4 pt-6 sm:px-6">
      <a href="#/hizmetler" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"><ArrowLeft size={15} /> Hizmetler</a>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-tag shadow-[3px_3px_0_0_#14110f]"><Icon size={30} strokeWidth={1.8} /></div>
            <div className="eyebrow">{s.categoryLabel}</div>
          </div>
          <h1 className="mt-5 text-[34px] font-extrabold leading-[1.08] sm:text-[46px]">{s.title}</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">{s.shortDesc}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-save-soft px-4 py-2 text-sm font-semibold text-save-ink"><ShieldCheck size={16} /> {s.guaranteeText}</p>

          <h2 className="mb-4 mt-12 text-[26px] font-extrabold">Kapsamı seç</h2>
          <div role="radiogroup" aria-label="Kapsam" className="grid gap-3 sm:grid-cols-2">
            {s.options.map((o) => {
              const on = o.id === opt.id;
              return (
                <button key={o.id} role="radio" aria-checked={on} onClick={() => setOptId(o.id)} className={`relative rounded-2xl border-2 p-4 text-left transition ${on ? 'border-ink bg-tag-soft shadow-[3px_3px_0_0_#14110f]' : 'border-line-strong bg-card hover:border-ink'}`}>
                  {on && <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-ink text-tag"><Check size={14} strokeWidth={3} /></span>}
                  <div className="pr-8 font-bold">{o.label}</div>
                  {o.description && <div className="mt-1 text-[13px] text-ink-3">{o.description}</div>}
                  <div className="num mt-3 font-display text-[22px] font-extrabold">{tl(s.baseFloorPrice * o.multiplier)}</div>
                </button>
              );
            })}
          </div>

          <h2 className="mb-4 mt-12 text-[26px] font-extrabold">Ustalar <span className="text-ink-3">({providers.length})</span></h2>
          <div className="surface divide-y divide-line">
            {providers.map((p, i) => {
              const price = Math.round(p.price * m);
              const done = asked === p.id;
              return (
                <div key={p.id} className={`flex flex-wrap items-center gap-x-5 gap-y-3 p-5 ${i === 0 ? 'bg-tag-soft' : ''}`}>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-ink bg-card font-display text-lg font-extrabold">{initials(p.name)}</div>
                  <div className="min-w-[200px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold">{p.name}</span>
                      {i === 0 && <span className="rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase text-tag">En uygun</span>}
                    </div>
                    <div className="text-[13px] text-ink-3">{p.businessName}</div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-ink-2">
                      <Rating value={p.rating} count={p.reviewCount} />
                      <span className="inline-flex items-center gap-1"><Clock size={13} className="text-ink-3" />{p.responseTime}</span>
                      <span className="inline-flex items-center gap-1"><MapPin size={13} className="text-ink-3" />{p.location}</span>
                    </div>
                    <div className="mt-1.5 text-[12px] font-semibold text-save-ink">{p.verifiedBadge}{p.warrantyDays > 0 ? ` · ${p.warrantyDays} gün garanti` : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="num font-display text-[26px] font-extrabold leading-none">{tl(price)}</div>
                    <button
                      className={`mt-2 ${done ? 'btn-ghost' : i === 0 ? 'btn-tag' : 'btn-ink'} !py-2`}
                      onClick={() => { setAsked(p.id); toast(`${p.name} için teklif talebin iletildi (demo)`); }}
                    >
                      {done ? <><Check size={15} /> İletildi</> : <>Teklif iste <ArrowRight size={15} /></>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="ticket px-6 pb-6 pt-7">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em]">{opt.label}</div>
            <div className="num mt-1 font-display text-[60px] font-extrabold leading-none">{tl(floor)}</div>
            <div className="text-sm font-medium opacity-80">başlangıç · {s.unit}</div>
            <div className="mt-5 space-y-2 border-t-2 border-dashed border-ink/40 pt-4 text-[14.5px]">
              <div className="flex justify-between"><span className="opacity-75">Piyasa ortalaması</span><span className="num font-semibold line-through">{tl(market)}</span></div>
              <div className="flex justify-between text-[17px] font-extrabold"><span>Fark</span><span className="num">{tl(market - floor)}</span></div>
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-3">Fiyatlar demo verisidir. Gerçek teklif için usta kapsamı keşif sonrası kesinleştirir.</p>
        </aside>
      </div>
    </div>
  );
}
