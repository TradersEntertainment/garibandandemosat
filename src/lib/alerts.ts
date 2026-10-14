import { useSyncExternalStore } from 'react';

export interface PriceAlert {
  productId: string;
  target: number;
  createdAt: number;
}

const KEY = 'gariban_alerts_v2';
const listeners = new Set<() => void>();

const read = (): PriceAlert[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

let cache = read();

const write = (next: PriceAlert[]) => {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
  listeners.forEach((l) => l());
};

export const alertsStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get: () => cache,
  set(productId: string, target: number) {
    write([{ productId, target, createdAt: Date.now() }, ...cache.filter((a) => a.productId !== productId)]);
  },
  remove(productId: string) {
    write(cache.filter((a) => a.productId !== productId));
  },
};

export const useAlerts = () => useSyncExternalStore(alertsStore.subscribe, alertsStore.get);
