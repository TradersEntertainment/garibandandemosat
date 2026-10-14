import { useEffect, useState, useSyncExternalStore } from 'react';

/** Minimal hash router: #/ , #/urun/p-1 , #/market , #/hizmetler , #/hizmet/s-1 , #/kuponlar */
const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};
const getSnapshot = () => window.location.hash || '#/';

export function useRoute() {
  const hash = useSyncExternalStore(subscribe, getSnapshot);
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return { name: parts[0] ?? '', id: parts[1] ?? null };
}

export const go = (path: string) => {
  window.location.hash = path.startsWith('#') ? path : `#${path}`;
};

/** Scroll to top whenever the route changes. */
export function useScrollReset(key: string) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [key]);
}

export function useMediaQuery(q: string) {
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const h = () => setM(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [q]);
  return m;
}
