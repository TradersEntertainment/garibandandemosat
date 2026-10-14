import { useEffect, useRef } from 'react';
import { Bell, Trash2, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { alertsStore, useAlerts } from '../lib/alerts';
import { go } from '../lib/router';
import { tl } from '../lib/format';
import { ProductThumb } from './ProductThumb';

export function AlertsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const alerts = useAlerts();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    panel.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Fiyat alarmlarım">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={onClose} />
      <div ref={panel} tabIndex={-1} className="absolute bottom-0 right-0 top-0 flex w-full max-w-[440px] flex-col border-l-2 border-ink bg-paper shadow-lift outline-none animate-rise">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <div className="eyebrow">Alarmlarım</div>
            <h2 className="text-[26px] font-extrabold">Takip ettiklerim <span className="num text-ink-3">({alerts.length})</span></h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-line-strong hover:border-ink" aria-label="Kapat"><X size={18} /></button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {alerts.length === 0 ? (
            <div className="grid place-items-center gap-3 px-4 py-20 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-ink bg-tag"><Bell size={26} /></div>
              <div className="font-display text-2xl font-extrabold">Henüz alarm yok</div>
              <p className="max-w-[26ch] text-[15px] text-ink-3">Ürün kartındaki zile bas ya da ürün sayfasında hedef fiyat gir.</p>
              <button className="btn-ink mt-2" onClick={() => { onClose(); go('/'); }}>Ürünlere git</button>
            </div>
          ) : (
            alerts.map((a) => {
              const p = PRODUCTS.find((x) => x.id === a.productId);
              if (!p) return null;
              const hit = p.lowestPrice <= a.target;
              return (
                <div key={a.productId} className="surface flex gap-3.5 p-3.5">
                  <ProductThumb product={p} spin={false} className="h-[84px] w-[84px] shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <button onClick={() => { onClose(); go(`/urun/${p.id}`); }} className="line-clamp-2 text-left text-[14px] font-semibold leading-snug hover:underline">{p.title}</button>
                    <div className="mt-2 flex items-center gap-4 text-[13px]">
                      <div><div className="text-ink-3">Şu an</div><div className="num font-bold">{tl(p.lowestPrice)}</div></div>
                      <div><div className="text-ink-3">Hedef</div><div className="num font-bold">{tl(a.target)}</div></div>
                      {hit && <span className="rounded bg-save px-2 py-1 text-[11px] font-bold text-white">Hedefe ulaştı</span>}
                    </div>
                  </div>
                  <button onClick={() => alertsStore.remove(a.productId)} className="self-start rounded-full p-2 text-ink-3 hover:bg-paper-2 hover:text-alarm" aria-label="Alarmı sil"><Trash2 size={16} /></button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
