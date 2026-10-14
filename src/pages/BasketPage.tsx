import { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { GROCERY_ITEMS } from '../data/groceryItems';
import { tl, tlExact } from '../lib/format';
import { Monogram } from '../components/ui';

const MARKETS = [
  { key: 'sok', name: 'ŞOK' },
  { key: 'a101', name: 'A101' },
  { key: 'migros', name: 'Migros' },
  { key: 'carrefour', name: 'CarrefourSA' },
] as const;
type MKey = (typeof MARKETS)[number]['key'];

export function BasketPage() {
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(GROCERY_ITEMS.map((g) => [g.id, 1])));
  const set = (id: string, d: number) => setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(9, (q[id] ?? 0) + d)) }));

  const calc = useMemo(() => {
    const totals = Object.fromEntries(MARKETS.map((m) => [m.key, 0])) as Record<MKey, number>;
    const split: Record<MKey, { name: string; q: number; price: number }[]> = { sok: [], a101: [], migros: [], carrefour: [] };
    let optimal = 0;
    for (const g of GROCERY_ITEMS) {
      const q = qty[g.id] ?? 0;
      if (!q) continue;
      let bestKey: MKey = 'sok';
      for (const m of MARKETS) {
        totals[m.key] += g.prices[m.key] * q;
        if (g.prices[m.key] < g.prices[bestKey]) bestKey = m.key;
      }
      optimal += g.prices[bestKey] * q;
      split[bestKey].push({ name: g.name, q, price: g.prices[bestKey] * q });
    }
    const ranked = [...MARKETS].sort((a, b) => totals[a.key] - totals[b.key]);
    return { totals, ranked, optimal, split };
  }, [qty]);

  const cheapest = calc.totals[calc.ranked[0].key];
  const priciest = calc.totals[calc.ranked[3].key];
  const count = Object.values(qty).reduce((a, b) => a + b, 0);
  const splitSave = cheapest - calc.optimal;

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-4 pt-10 sm:px-6">
      <div className="eyebrow mb-3">Market sepeti</div>
      <h1 className="max-w-[18ch] text-[44px] font-extrabold leading-[1.02] sm:text-[64px]">Sepetin hangi markette ucuz?</h1>
      <p className="mt-4 max-w-xl text-[17px] text-ink-2">Adetleri ayarla; dört marketin toplamını ve ürünleri en ucuz olduğu markete böldüğünde ne kadar tasarruf edeceğini gör.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="surface divide-y divide-line">
          {GROCERY_ITEMS.map((g) => {
            const q = qty[g.id] ?? 0;
            const min = Math.min(...MARKETS.map((m) => g.prices[m.key]));
            return (
              <div key={g.id} className={`flex items-center gap-4 p-4 transition sm:p-5 ${q ? '' : 'opacity-45'}`}>
                <Monogram brand={g.brand} className="h-14 w-14 shrink-0 rounded-xl text-xl" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold leading-snug">{g.name}</div>
                  <div className="text-[13px] text-ink-3">{g.brand} · {g.unit}</div>
                  <div className="mt-2.5 grid max-w-[360px] grid-cols-4 gap-1.5 text-center">
                    {MARKETS.map((m) => (
                      <div key={m.key} className={`rounded-lg border px-1.5 py-1.5 ${g.prices[m.key] === min ? 'border-ink bg-tag' : 'border-line bg-paper'}`}>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-3">{m.name.replace('CarrefourSA', 'CSA')}</div>
                        <div className="num text-[13px] font-bold">{tl(g.prices[m.key])}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full border border-line-strong bg-card p-1">
                  <button onClick={() => set(g.id, -1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper-2" aria-label="Azalt"><Minus size={15} /></button>
                  <span className="num w-6 text-center font-bold" aria-live="polite">{q}</span>
                  <button onClick={() => set(g.id, 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper-2" aria-label="Artır"><Plus size={15} /></button>
                </div>
              </div>
              );
          })}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
          <div className="surface p-6">
            <div className="eyebrow">Tek marketten alırsan · {count} ürün</div>
            <ul className="mt-4 space-y-3">
              {calc.ranked.map((m, i) => {
                const t = calc.totals[m.key];
                return (
                  <li key={m.key}>
                    <div className="flex items-baseline justify-between">
                      <span className="flex items-center gap-2 font-semibold">
                        {m.name}
                        {i === 0 && count > 0 && <span className="rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase text-tag">En ucuz</span>}
                      </span>
                      <span className="num font-bold">{tlExact(t)}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-paper-2">
                      <div className={`h-full rounded-full ${i === 0 ? 'bg-save' : 'bg-ink/35'}`} style={{ width: `${priciest ? (t / priciest) * 100 : 0}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
            {count > 0 && <p className="num mt-4 text-[13.5px] text-ink-3">En pahalı ile en ucuz arasında <b className="text-ink">{tl(priciest - cheapest)}</b> fark var.</p>}
          </div>

          <div className="rounded-[24px] border-2 border-ink bg-tag p-6 shadow-pop">
            <div className="eyebrow !text-ink/70">Parçalı alışveriş</div>
            <div className="num mt-1 font-display text-[44px] font-extrabold leading-none">{tlExact(calc.optimal)}</div>
            <p className="mt-2 text-[14.5px] font-medium">
              {splitSave > 0 ? <>En ucuz tek marketten <b className="num">{tl(splitSave)}</b> daha az.</> : 'Bu sepette tek market zaten en ucuz.'}
            </p>
            <div className="mt-4 space-y-3 border-t-2 border-dashed border-ink/40 pt-4">
              {MARKETS.filter((m) => calc.split[m.key].length).map((m) => (
                <div key={m.key}>
                  <div className="flex justify-between text-sm font-bold"><span>{m.name}</span><span className="num">{tlExact(calc.split[m.key].reduce((a, b) => a + b.price, 0))}</span></div>
                  <ul className="mt-1 space-y-0.5 text-[12.5px] text-ink/75">
                    {calc.split[m.key].map((it) => <li key={it.name} className="line-clamp-1">{it.q}× {it.name}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

