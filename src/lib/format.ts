export const tl = (n: number) => `₺${Math.round(n).toLocaleString('tr-TR')}`;

export const tlExact = (n: number) =>
  `₺${n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const pct = (from: number, to: number) => Math.max(0, Math.round(((from - to) / from) * 100));
