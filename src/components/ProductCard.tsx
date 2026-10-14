import { Bell, BellRing } from 'lucide-react';
import type { Product } from '../types';
import { go } from '../lib/router';
import { pct, tl } from '../lib/format';
import { alertsStore, useAlerts } from '../lib/alerts';
import { ProductThumb } from './ProductThumb';
import { Rating, Sparkline, toast } from './ui';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const alerts = useAlerts();
  const hasAlert = alerts.some((a) => a.productId === product.id);
  const best = product.offers[0];
  const avg = product.priceHistory.averagePrice;
  const belowAvg = pct(avg, product.lowestPrice);
  const atLow = product.lowestPrice <= product.priceHistory.minPrice;
  const spread = product.highestPrice - product.lowestPrice;

  const toggleAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasAlert) {
      alertsStore.remove(product.id);
      toast('Fiyat alarmı kaldırıldı');
    } else {
      alertsStore.set(product.id, Math.round(product.lowestPrice * 0.95));
      toast(`${tl(product.lowestPrice * 0.95)} altına düşünce haber vereceğiz`);
    }
  };

  return (
    <article
      onClick={() => go(`/urun/${product.id}`)}
      className="group surface relative flex cursor-pointer flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lift animate-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="relative">
        <ProductThumb product={product} className="aspect-square" />
        {product.discountPercentage ? (
          <span className="num absolute left-3 top-3 rounded-md bg-alarm px-2 py-1 text-xs font-bold text-white">−%{product.discountPercentage}</span>
        ) : null}
        <button
          onClick={toggleAlert}
          aria-label={hasAlert ? 'Fiyat alarmını kaldır' : 'Fiyat alarmı kur'}
          aria-pressed={hasAlert}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border transition ${
            hasAlert ? 'border-ink bg-tag text-ink' : 'border-line-strong bg-card/90 text-ink-2 hover:border-ink hover:text-ink'
          }`}
        >
          {hasAlert ? <BellRing size={16} /> : <Bell size={16} />}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3.5">
        <div className="flex items-center justify-between">
          <span className="eyebrow">{product.brand}</span>
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <h3 className="mt-1.5 line-clamp-2 min-h-[2.6em] font-sans text-[15px] font-semibold leading-snug tracking-normal text-ink">{product.title}</h3>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="num font-display text-[26px] font-extrabold leading-none">{tl(product.lowestPrice)}</span>
                {product.previousPrice && <span className="num text-[13px] text-ink-3 line-through">{tl(product.previousPrice)}</span>}
              </div>
              <div className="mt-1 text-[12.5px] text-ink-3">
                {best.storeName} · <span className="num">{product.storesCount}</span> mağazada
              </div>
            </div>
            <Sparkline values={product.priceHistory.prices} className="h-9 w-[84px] shrink-0" />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-dashed border-line-strong pt-3">
            {atLow && <span className="rounded-md bg-tag px-2 py-1 text-[11.5px] font-bold">6 ayın en düşüğü</span>}
            {belowAvg > 0 && <span className="num rounded-md bg-save-soft px-2 py-1 text-[11.5px] font-semibold text-save-ink">ortalamanın %{belowAvg} altında</span>}
            {spread > 0 && !atLow && <span className="num rounded-md bg-paper-2 px-2 py-1 text-[11.5px] font-medium text-ink-2">{tl(spread)} fark</span>}
          </div>
        </div>
      </div>
    </article>
  );
}
