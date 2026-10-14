import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { POPULAR_COUPONS } from '../data/coupons';
import { toast } from '../components/ui';

export function CouponsPage() {
  const stores = ['Hepsi', ...new Set(POPULAR_COUPONS.map((c) => c.store))];
  const [store, setStore] = useState('Hepsi');
  const [copied, setCopied] = useState<string | null>(null);
  const list = POPULAR_COUPONS.filter((c) => store === 'Hepsi' || c.store === store);

  const copy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard may be blocked; still give feedback */
    }
    setCopied(id);
    toast(`${code} kopyalandı`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 pb-4 pt-10 sm:px-6">
      <div className="eyebrow mb-3">Kuponlar</div>
      <h1 className="max-w-[14ch] text-[44px] font-extrabold leading-[1.02] sm:text-[64px]">Ödemede yapıştır, indir.</h1>
      <p className="mt-4 max-w-xl text-[17px] text-ink-2">Kodu kopyala, mağazanın ödeme adımında kupon alanına yapıştır.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {stores.map((s) => <button key={s} className="chip" data-active={store === s} onClick={() => setStore(s)}>{s}</button>)}
      </div>

      <div className="mt-8 space-y-4">
        {list.map((c) => (
          <article key={c.id} className="flex overflow-hidden rounded-2xl border-2 border-ink bg-card shadow-card">
            <div className="grid w-28 shrink-0 place-items-center bg-tag px-3 text-center sm:w-40">
              <div>
                <div className="num font-display text-[30px] font-extrabold leading-none sm:text-[40px]">{c.discount.replace(' ₺', '')}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wider">TL indirim</div>
              </div>
            </div>
            <div className="relative flex flex-1 flex-wrap items-center gap-x-6 gap-y-3 border-l-2 border-dashed border-ink p-5">
              <span aria-hidden className="absolute -left-[11px] -top-[11px] h-5 w-5 rounded-full border-2 border-ink bg-paper" />
              <span aria-hidden className="absolute -bottom-[11px] -left-[11px] h-5 w-5 rounded-full border-2 border-ink bg-paper" />
              <div className="min-w-[200px] flex-1">
                <div className="eyebrow">{c.store}</div>
                <h3 className="mt-1 font-sans text-[16px] font-bold leading-snug tracking-normal">{c.title}</h3>
                <div className="mt-1.5 text-[13px] text-ink-3">{c.minSpend} · {c.expires}</div>
              </div>
              <button onClick={() => copy(c.id, c.code)} className={`num inline-flex items-center gap-3 rounded-full border-2 border-dashed px-4 py-2.5 font-mono text-[15px] font-bold tracking-wider transition ${copied === c.id ? 'border-save bg-save-soft text-save-ink' : 'border-ink hover:bg-tag'}`}>
                {c.code}
                {copied === c.id ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
