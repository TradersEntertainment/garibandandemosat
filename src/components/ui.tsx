import { useEffect, useSyncExternalStore } from 'react';
import { CheckCircle2, Star } from 'lucide-react';

/* ---------------- Sparkline ---------------- */
export function Sparkline({
  values,
  className = '',
  stroke = '#0b6b43',
  fill = 'rgba(11,107,67,0.12)',
}: {
  values: number[];
  className?: string;
  stroke?: string;
  fill?: string;
}) {
  const w = 120, h = 36, pad = 3;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [pad + (i / (values.length - 1)) * (w - pad * 2), pad + (1 - (v - min) / span) * (h - pad * 2)]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label="6 aylık fiyat eğrisi" preserveAspectRatio="none">
      <path d={`${d} L${last[0]},${h} L${pts[0][0]},${h} Z`} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={stroke} />
    </svg>
  );
}

/* ---------------- Rating ---------------- */
export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] text-ink-2">
      <Star size={13} className="fill-tag text-ink" strokeWidth={1.6} />
      <b className="num font-semibold text-ink">{value.toFixed(1)}</b>
      {count !== undefined && <span className="num text-ink-3">({count.toLocaleString('tr-TR')})</span>}
    </span>
  );
}

/* ---------------- Toast ---------------- */
let toastMsg: { id: number; text: string } | null = null;
const toastListeners = new Set<() => void>();
export function toast(text: string) {
  const id = Date.now();
  toastMsg = { id, text };
  toastListeners.forEach((l) => l());
  setTimeout(() => {
    if (toastMsg?.id === id) {
      toastMsg = null;
      toastListeners.forEach((l) => l());
    }
  }, 3200);
}
const subToast = (cb: () => void) => {
  toastListeners.add(cb);
  return () => toastListeners.delete(cb);
};

export function Toaster() {
  const t = useSyncExternalStore(subToast, () => toastMsg);
  useEffect(() => {}, [t]);
  if (!t) return null;
  return (
    <div role="status" className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 animate-rise">
      <div className="flex items-center gap-2.5 rounded-full border-2 border-ink bg-tag px-5 py-3 text-sm font-semibold shadow-pop">
        <CheckCircle2 size={18} />
        {t.text}
      </div>
    </div>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionHead({ eyebrow, title, aside }: { eyebrow?: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
        <h2 className="text-[28px] font-extrabold leading-tight sm:text-[34px]">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

/* ---------------- Brand monogram tile (no stock photos) ---------------- */
const MONO: Record<string, [string, string]> = {
  Ferrero: ['#8c1d18', '#f6e7c8'],
  Fairy: ['#0a8f6a', '#ffffff'],
  Çaykur: ['#b3202a', '#ffe9b0'],
  Yudum: ['#e0b02e', '#7a1510'],
  Sütaş: ['#1c5fb5', '#ffffff'],
  Ariel: ['#e2571f', '#ffffff'],
  Nescafe: ['#9c1b1b', '#ffffff'],
  Selpak: ['#2a8bd3', '#ffffff'],
};
export function Monogram({ brand, className = '' }: { brand: string; className?: string }) {
  const [bg, fg] = MONO[brand] ?? ['#14110f', '#ffd84d'];
  return (
    <div className={`grid place-items-center font-display font-extrabold ${className}`} style={{ background: bg, color: fg }}>
      {brand.slice(0, 2)}
    </div>
  );
}
