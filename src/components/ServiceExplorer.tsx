import React, { useState } from 'react';
import {
  Wrench,
  Sparkles,
  ShieldCheck,
  Star,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { ServiceItem } from '../types';
import { SERVICES } from '../data/services';

interface ServiceExplorerProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServiceExplorer: React.FC<ServiceExplorerProps> = ({ onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [serviceSearch, setServiceSearch] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Tüm Hizmetler' },
    { id: 'temizlik', label: '🧹 Ev Temizliği & Yıkama' },
    { id: 'tamir', label: '🔧 Tesisat & Kombi Tamiri' },
    { id: 'elektronik', label: '📱 Telefon & Ekran Servisi' },
    { id: 'boya', label: '🎨 Boya & Badana' },
    { id: 'cilingir', label: '🔑 7/24 Acil Çilingir' },
    { id: 'nakliyat', label: '🚚 Nakliyat & Kamyonet' },
  ];

  const filteredServices = SERVICES.filter((service) => {
    if (selectedCategory !== 'all' && service.category !== selectedCategory) {
      return false;
    }
    if (serviceSearch.trim()) {
      const q = serviceSearch.toLowerCase().trim();
      const matchesTitle = service.title.toLowerCase().includes(q);
      const matchesDesc = service.shortDesc.toLowerCase().includes(q);
      const matchesTags = service.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesDesc && !matchesTags) return false;
    }
    return true;
  });

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-300">
      {/* Banner / Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 border border-white/10 p-6 sm:p-10 overflow-hidden cyber-border-gradient">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyber-emerald/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-obsidian-950 border border-cyber-emerald/40 text-cyber-emerald text-xs font-mono font-bold">
            <Sparkles size={13} className="animate-spin-slow" />
            <span>ARMUT + CİMRİ FÜZYONU // KOMİSYONSUZ USTA RADARI</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-tight">
            Armut'ta Saatlerce Teklif Beklemeyin. <br />
            <span className="bg-gradient-to-r from-cyber-emerald via-cyber-mint to-cyan-400 bg-clip-text text-transparent">
              En Ucuz Taban Fiyatı Hemen Görün.
            </span>
          </h2>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Armut'un ustalardan kestiği %25 komisyonu aradan çıkardık. Temizlik, tesisat, telefon tamiri, kombi bakımı ve nakliyat için semtinizdeki en hesaplı ustaları sabit net fiyattan listeleyin.
          </p>

          {/* Quick Search */}
          <div className="pt-2 max-w-md">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3.5 text-slate-400" />
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Hizmet veya arıza ara (örn: ev temizliği, su kaçağı, kombi)..."
                className="w-full bg-obsidian-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyber-emerald"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 font-mono text-xs">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-cyber-emerald text-obsidian-950 shadow-lg shadow-cyber-emerald/20'
                  : 'bg-obsidian-900 text-slate-300 hover:text-white hover:bg-white/5 border border-white/8'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredServices.map((service) => {
          const cheapestProvider = service.providers[0];
          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group relative bg-obsidian-850/90 rounded-3xl border border-white/8 overflow-hidden hover:border-cyber-emerald/40 hover:shadow-2xl hover:shadow-cyber-emerald/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              {/* Image preview */}
              <div className="relative w-full h-44 overflow-hidden bg-obsidian-950">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent opacity-90" />

                <div className="absolute top-3 left-3 bg-obsidian-950/90 backdrop-blur-md border border-cyber-emerald/30 text-cyber-emerald text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl">
                  {service.categoryLabel}
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star size={11} className="fill-amber-400" />
                    {cheapestProvider ? cheapestProvider.rating : '4.9'}
                  </span>
                  <span className="bg-cyber-emerald text-obsidian-950 font-black px-2 py-0.5 rounded-md text-[10px]">
                    ₺{service.savings.toLocaleString('tr-TR')} KÂR
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug font-display group-hover:text-cyber-mint transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 font-sans leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Price block */}
                <div className="pt-3 border-t border-white/8">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Armut Ortalama:</span>
                    <span className="text-slate-400 line-through">
                      ₺{service.armutAveragePrice.toLocaleString('tr-TR')}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono font-bold text-cyber-emerald">
                        Gariban Taban Fiyat
                      </div>
                      <div className="text-xl font-black text-white font-mono tracking-tight">
                        ₺{service.baseFloorPrice.toLocaleString('tr-TR')}
                        <span className="text-[10px] text-slate-400 font-normal"> / {service.unit}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectService(service);
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-cyber-emerald hover:bg-cyber-mint text-obsidian-950 text-xs font-mono font-black uppercase rounded-xl shadow-md transition-all transform active:scale-95"
                    >
                      <span>Hesapla</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
