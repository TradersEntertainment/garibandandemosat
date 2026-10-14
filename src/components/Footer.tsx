import React from 'react';
import { ShieldCheck, Heart, Sparkles, TrendingDown, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stores = [
    'Trendyol',
    'Hepsiburada',
    'Amazon TR',
    'N11',
    'Teknosa',
    'MediaMarkt',
    'Vatan Bilgisayar',
    'Migros Sanal Market',
    'ŞOK Market',
    'A101 Kapıda',
    'CarrefourSA',
    'Pazarama'
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg">
                <span className="text-xl">₺</span>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                garibandan<span className="text-emerald-400">.com</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-md">
              Türkiye'nin ilk şeffaf, reklamsız, halkın bütçesini korumayı ilke edinmiş yeni nesil akıllı fiyat arama motoru. Algoritmalarımız her saniye 50'den fazla mağazayı tarayarak tek bir kuruş bile fazla ödemenizi engeller.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck size={16} />
              <span>%100 Bağımsız ve Tarafsız Fiyat Analizi</span>
            </div>
          </div>

          {/* Taradığımız Mağazalar */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Anlık Taranan Mağazalar
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {stores.map((s) => (
                <span
                  key={s}
                  className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded-lg text-[11px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Gariban Manifestosu */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Gariban Manifestosu
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Asla reklam alan mağazayı en üste koymayız.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Sahte indirimleri 6 aylık grafikle afişe ederiz.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Market sepetinde en ucuz kombinasyonu hesaplarız.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-500">
            © 2026 garibandan.com — Tüm hakları halkın cebinde saklıdır. Veriler bilgilendirme amaçlıdır.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <span>Yukarı Çık</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
