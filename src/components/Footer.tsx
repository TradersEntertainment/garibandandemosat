import { Logo } from './Header';

const COLS = [
  { title: 'Keşfet', links: [['Ürünler', '#/'], ['Market sepeti', '#/market'], ['Usta & hizmet', '#/hizmetler'], ['Kuponlar', '#/kuponlar']] },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-paper/70">
              Aynı şeye fazla ödememen için fiyatları, market sepetini ve usta tekliflerini yan yana koyuyoruz. Sıralamayı reklam değil fiyat belirler.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="eyebrow !text-paper/50">{c.title}</div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map(([l, h]) => (
                  <li key={l}>
                    <a href={h} className="text-[15px] text-paper/85 transition hover:text-tag">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 pt-6 text-[13px] text-paper/55">
          <span>© 2026 garibandan.com</span>
          <span className="rounded-full border border-paper/20 px-3 py-1">Bu sürümdeki fiyat, mağaza ve usta bilgileri demo amaçlı örnek veridir.</span>
        </div>
      </div>
    </footer>
  );
}


