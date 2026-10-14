import React from 'react';
import { ShieldCheck, ArrowUp, Terminal, Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stores = [
    'Amazon TR',
    'Hepsiburada',
    'Trendyol',
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
    <footer className="bg-obsidian-950 border-t border-white/10 text-slate-400 text-xs pt-14 pb-8 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyber-emerald to-cyan-400 flex items-center justify-center text-obsidian-950 font-black shadow-lg shadow-cyber-emerald/20">
                <span className="text-xl">₺</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-display">
                garibandan<span className="text-cyber-emerald">.com</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-md font-sans text-xs">
              Türkiye'nin ilk bağımsız, reklamsız, halkın bütçesini gözeten 3D fiyat arama ve arbitraj motoru. Sistemimiz her saniye 50'den fazla mağazayı tarayarak tek bir kuruş bile fazla ödemenizi engeller.
            </p>

            <div className="flex items-center gap-2 text-cyber-emerald font-semibold">
              <ShieldCheck size={16} />
              <span>%100 Bağımsız ve Tarafsız Algoritma</span>
            </div>
          </div>

          {/* Taradığımız Mağazalar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Taranan Aktif Mağazalar
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {stores.map((s) => (
                <span
                  key={s}
                  className="bg-obsidian-900 border border-white/8 text-slate-300 px-2 py-1 rounded-lg text-[10px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Gariban Manifestosu */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Gariban Manifestosu
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px] font-sans">
              <li className="flex items-start gap-1.5">
                <span className="text-cyber-emerald font-bold">•</span>
                <span>Asla reklam alan mağazayı en üste koymayız.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyber-emerald font-bold">•</span>
                <span>Sahte indirimleri 6 aylık grafikle afişe ederiz.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyber-emerald font-bold">•</span>
                <span>Market sepetinde en kârlı kombinasyonu hesaplarız.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <div className="text-slate-500">
            © 2026 garibandan.com — Tüm hakları halkın cebinde saklıdır.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-300 hover:text-cyber-emerald transition-colors"
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
