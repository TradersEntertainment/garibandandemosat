import { useRef, useState } from 'react';
import { tl } from '../lib/format';

interface Props {
  labels: string[];
  prices: number[];
  average: number;
}

export function PriceChart({ labels, prices, average }: Props) {
  const W = 720, H = 280;
  const padL = 64, padR = 28, padT = 28, padB = 40;
  const min = Math.min(...prices), max = Math.max(...prices);
  const lo = min - (max - min) * 0.25, hi = max + (max - min) * 0.2;
  const x = (i: number) => padL + (i / (prices.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
  const [hover, setHover] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  // smooth monotone-ish path
  const pts = prices.map((v, i) => [x(i), y(v)] as const);
  const path = pts.reduce((d, [px, py], i) => {
    if (i === 0) return `M${px},${py}`;
    const [qx, qy] = pts[i - 1];
    const cx = (px + qx) / 2;
    return `${d} C${cx},${qy} ${cx},${py} ${px},${py}`;
  }, '');
  const area = `${path} L${x(prices.length - 1)},${H - padB} L${x(0)},${H - padB} Z`;

  const ticks = [lo + (hi - lo) * 0.1, (lo + hi) / 2, hi - (hi - lo) * 0.1];
  const active = hover ?? prices.length - 1;

  const move = (e: React.PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    const rel = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((rel - padL) / (W - padL - padR)) * (prices.length - 1));
    setHover(Math.max(0, Math.min(prices.length - 1, i)));
  };

  return (
    <div className="surface p-5 sm:p-7">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">{hover === null ? 'Şu an' : labels[active]}</div>
          <div className="num font-display text-[34px] font-extrabold leading-none">{tl(prices[active])}</div>
        </div>
        <div className="flex gap-5 text-[13px]">
          <Stat label="En düşük" value={tl(min)} tone="text-save" />
          <Stat label="Ortalama" value={tl(average)} />
          <Stat label="En yüksek" value={tl(max)} tone="text-alarm" />
        </div>
      </div>

      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-pan-y select-none"
        onPointerMove={move}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`Son 6 ay fiyat geçmişi: en düşük ${tl(min)}, en yüksek ${tl(max)}`}
      >
        <defs>
          <linearGradient id="pc-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0b6b43" stopOpacity="0.22" />
            <stop offset="1" stopColor="#0b6b43" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#d9d1bf" strokeDasharray="3 5" />
            <text x={padL - 10} y={y(t) + 4} textAnchor="end" fontSize="11.5" fill="#6b645a" className="num">{tl(t)}</text>
          </g>
        ))}

        <line x1={padL} x2={W - padR} y1={y(average)} y2={y(average)} stroke="#14110f" strokeWidth="1" strokeDasharray="6 4" opacity="0.55" />
        <text x={W - padR} y={y(average) - 7} textAnchor="end" fontSize="11" fontWeight="600" fill="#14110f" opacity="0.7">ortalama</text>

        <path d={area} fill="url(#pc-fill)" />
        <path d={path} fill="none" stroke="#0b6b43" strokeWidth="3" strokeLinecap="round" />

        {labels.map((l, i) => (
          <text key={l} x={x(i)} y={H - 14} textAnchor="middle" fontSize="12" fill={i === active ? '#14110f' : '#6b645a'} fontWeight={i === active ? 700 : 500}>{l}</text>
        ))}

        <line x1={x(active)} x2={x(active)} y1={padT} y2={H - padB} stroke="#14110f" strokeOpacity="0.25" />
        {pts.map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={i === active ? 7 : prices[i] === min ? 5 : 3.5} fill={i === active ? '#ffd84d' : '#fffdf8'} stroke="#14110f" strokeWidth={i === active ? 2.5 : 1.8} />
        ))}
      </svg>
    </div>
  );
}

function Stat({ label, value, tone = '' }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <div className="text-ink-3">{label}</div>
      <div className={`num font-bold ${tone}`}>{value}</div>
    </div>
  );
}
