import { useEffect, useRef, useState } from 'react';
import type { Product } from '../types';
import { getFrames, useStill } from '../lib/renderer';

/**
 * Product render tile. Shows a baked still; on hover it plays a pre-rendered 360° sequence
 * (GIF-like, but crisp and without holding a WebGL context per card).
 */
export function ProductThumb({ product, className = '', spin = true }: { product: Product; className?: string; spin?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const still = useStill(product, near);
  const [frames, setFrames] = useState<string[] | null>(null);
  const [hover, setHover] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!hover || !spin) return;
    let live = true;
    getFrames(product).then((f) => live && setFrames(f));
    return () => {
      live = false;
    };
  }, [hover, spin, product]);

  useEffect(() => {
    if (!hover || !frames) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % frames.length), 75);
    return () => clearInterval(t);
  }, [hover, frames]);

  const src = hover && frames ? frames[idx] : still;

  return (
    <div
      ref={ref}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        setIdx(0);
      }}
      className={`relative overflow-hidden bg-[#ece6d6] ${className}`}
    >
      {src ? (
        <img src={src} alt={product.title} draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" />
      ) : (
        <div className="skeleton absolute inset-0" />
      )}
      {spin && src && !hover && (
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-3 opacity-0 transition group-hover:opacity-100">
          360°
        </span>
      )}
    </div>
  );
}
