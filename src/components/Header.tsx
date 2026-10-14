import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { SERVICES } from '../data/services';
import { go, useRoute } from '../lib/router';
import { tl } from '../lib/format';
import { useAlerts } from '../lib/alerts';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#/" className="group inline-flex items-center gap-2.5" aria-label="garibandan ana sayfa">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden className="transition-transform group-hover:-rotate-6">
        <rect width="32" height="32" rx="8" fill={light ? '#ffd84d' : '#14110f'} />
        <path d="M9 11.5A2.5 2.5 0 0 1 11.5 9H17l7 7-6.5 6.5-7-7z" fill={light ? '#14110f' : '#ffd84d'} />
        <circle cx="13.2" cy="12.7" r="1.5" fill={light ? '#ffd84d' : '#14110f'} />
      </svg>
      <span className={`font-display text-[24px] font-extrabold tracking-tight ${light ? 'text-paper' : 'text-ink'}`}>
        garibandan<span className="text-save">.</span>
      </span>
    </a>
  );
}

const NAV = [
  { name: '', label: 'Ürünler' },
  { name: 'market', label: 'Market sepeti' },
  { name: 'hizmetler', label: 'Usta & hizmet' },
  { name: 'kuponlar', label: 'Kuponlar' },
];

function SearchBox({ onPick }: { onPick?: () => void }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const click = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName ?? ''))) {
        e.preventDefault();
        input.current?.focus();
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', click);
    window.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', click);
      window.removeEventListener('keydown', key);
    };
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('tr');
    if (!s) return { p: [], s: [] };
    return {
      p: PRODUCTS.filter((p) => (p.title + p.brand + p.tags.join(' ')).toLocaleLowerCase('tr').includes(s)).slice(0, 5),
      s: SERVICES.filter((x) => (x.title + x.tags.join(' ')).toLocaleLowerCase('tr').includes(s)).slice(0, 3),
    };
  }, [q]);

  const pick = (path: string) => {
    go(path);
    setOpen(false);
    setQ('');
    onPick?.();
  };

  return (
    <div ref={box} className="relative w-full">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
      <input
        ref={input}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Ürün, marka ya da hizmet ara"
        aria-label="Ara"
        className="h-11 w-full rounded-full border border-line-strong bg-card pl-11 pr-12 text-[15px] outline-none transition placeholder:text-ink-3 focus:border-ink focus:ring-4 focus:ring-tag/60"
      />
      {q ? (
        <button onClick={() => setQ('')} aria-label="Temizle" className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-3 hover:bg-paper-2">
          <X size={15} />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-line-strong px-1.5 text-[11px] font-semibold text-ink-3 sm:block">/</kbd>
      )}

      {open && (results.p.length > 0 || results.s.length > 0) && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-line-strong bg-card shadow-lift animate-rise">
          {results.p.length > 0 && <div className="eyebrow px-4 pb-1 pt-3">Ürünler</div>}
          {results.p.map((p) => (
            <button key={p.id} onClick={() => pick(`/urun/${p.id}`)} className="flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left hover:bg-paper-2">
              <span className="line-clamp-1 text-sm font-medium">{p.title}</span>
              <span className="num shrink-0 text-sm font-bold">{tl(p.lowestPrice)}</span>
            </button>
          ))}
          {results.s.length > 0 && <div className="eyebrow px-4 pb-1 pt-3">Hizmetler</div>}
          {results.s.map((s) => (
            <button key={s.id} onClick={() => pick(`/hizmet/${s.id}`)} className="flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left hover:bg-paper-2">
              <span className="line-clamp-1 text-sm font-medium">{s.title}</span>
              <span className="num shrink-0 text-sm font-bold">{tl(s.baseFloorPrice)}’den</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header({ onOpenAlerts }: { onOpenAlerts: () => void }) {
  const { name } = useRoute();
  const alerts = useAlerts();
  const [menu, setMenu] = useState(false);
  const active = name === 'urun' ? '' : name === 'hizmet' ? 'hizmetler' : name;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <div className="mx-2 hidden max-w-[520px] flex-1 md:block lg:mx-6">
          <SearchBox />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onOpenAlerts} className="btn-ghost relative !px-3.5" aria-label="Fiyat alarmlarım">
            <Bell size={17} />
            <span className="hidden sm:inline">Alarmlarım</span>
            {alerts.length > 0 && (
              <span className="num absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-paper bg-ink px-1 text-[11px] font-bold text-paper">{alerts.length}</span>
            )}
          </button>
          <button className="btn-ghost !px-3 md:hidden" onClick={() => setMenu((m) => !m)} aria-label="Menü" aria-expanded={menu}>
            <Menu size={18} />
          </button>
        </div>
      </div>

      <nav className="mx-auto hidden max-w-[1240px] gap-1 px-4 sm:px-6 md:flex" aria-label="Ana menü">
        {NAV.map((n) => (
          <a
            key={n.name}
            href={`#/${n.name}`}
            aria-current={active === n.name ? 'page' : undefined}
            className={`relative -mb-px border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
              active === n.name ? 'border-ink text-ink' : 'border-transparent text-ink-3 hover:text-ink'
            }`}
          >
            {n.label}
          </a>
        ))}
      </nav>

      {menu && (
        <div className="space-y-3 border-t border-line px-4 pb-4 pt-3 md:hidden">
          <SearchBox onPick={() => setMenu(false)} />
          <div className="flex flex-wrap gap-2">
            {NAV.map((n) => (
              <a key={n.name} href={`#/${n.name}`} onClick={() => setMenu(false)} data-active={active === n.name} className="chip">
                {n.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
