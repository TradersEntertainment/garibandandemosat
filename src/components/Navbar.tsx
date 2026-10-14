import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Flame,
  ShoppingCart,
  Tag,
  Bell,
  Sparkles,
  X,
  Terminal,
  Radio
} from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  products: Product[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenMarketBasket: () => void;
  onOpenCoupons: () => void;
  onOpenAlerts: () => void;
  alertsCount: number;
  onFilterKelepir: () => void;
  isKelepirActive: boolean;
  appMode: 'products' | 'services';
  onToggleMode: (mode: 'products' | 'services') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  products,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  onOpenMarketBasket,
  onOpenCoupons,
  onOpenAlerts,
  alertsCount,
  onFilterKelepir,
  isKelepirActive,
  appMode,
  onToggleMode,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-obsidian-950/90 backdrop-blur-2xl border-b border-white/10">
      {/* Top Telemetry Scanning Stream */}
      <div className="bg-obsidian-950/95 py-1 px-4 text-center text-[10px] sm:text-[11px] font-mono border-b border-white/5 flex items-center justify-between max-w-7xl mx-auto text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-ping" />
          <span className="text-cyber-emerald font-bold uppercase tracking-wider">
            CANLI RADAR AKTİF:
          </span>
          <span className="text-slate-300 hidden md:inline">
            Amazon TR, Hepsiburada, Trendyol, N11 ve 48 mağaza taranıyor
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="hidden sm:inline text-slate-500">[STATUS: 200_OK]</span>
          <span className="text-cyber-emerald font-bold">#HalkınFiyatMotoru</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            onSearchChange('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyber-emerald to-cyan-400 flex items-center justify-center text-obsidian-950 font-black shadow-lg shadow-cyber-emerald/20 group-hover:scale-105 transition-transform">
            <span className="text-2xl font-mono leading-none">₺</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-cyber-emerald transition-colors font-display">
                garibandan<span className="text-cyber-emerald">.com</span>
              </span>
              <span className="hidden md:inline-block text-[9px] font-mono font-bold uppercase tracking-wider bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30 px-1.5 py-0.5 rounded-md">
                3D_V2
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-wide hidden sm:block">
              Halkın Yeni Nesil Fiyat Motoru
            </div>
          </div>
        </div>

        {/* Dual Mode Switcher: Cimri (Ürünler) vs Armut (Hizmet & Usta) */}
        <div className="flex items-center bg-obsidian-900 p-1 rounded-2xl border border-white/10 text-xs font-mono font-bold">
          <button
            onClick={() => onToggleMode('products')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              appMode === 'products'
                ? 'bg-cyber-emerald text-obsidian-950 font-black shadow-lg shadow-cyber-emerald/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📦 Ürünler</span>
          </button>
          <button
            onClick={() => onToggleMode('services')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              appMode === 'services'
                ? 'bg-cyber-emerald text-obsidian-950 font-black shadow-lg shadow-cyber-emerald/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛠️ Usta & Hizmet</span>
            <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">ARMUT</span>
          </button>
        </div>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-xl mx-2 sm:mx-4">
          <div className="relative flex items-center">
            <Search
              size={17}
              className="absolute left-3.5 text-slate-400 pointer-events-none group-focus-within:text-cyber-emerald"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Ürün adı, marka veya model ara... (örn: iPhone 16, Dyson V15)"
              className="w-full bg-obsidian-900 border border-white/10 rounded-2xl pl-10 pr-12 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-cyber-emerald focus:ring-2 focus:ring-cyber-emerald/20 transition-all shadow-inner"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 text-slate-400 hover:text-white p-1"
              >
                <X size={15} />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block absolute right-3 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-obsidian-850 rounded border border-white/10 pointer-events-none">
                /
              </kbd>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2.5 border-b border-white/10 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3">
                Canlı Eşleşen Sonuçlar ({searchResults.length})
              </div>
              <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      setIsDropdownOpen(false);
                    }}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 object-contain rounded-xl bg-obsidian-950 p-1 border border-white/10"
                      />
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1 font-display">
                          {product.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {product.brand} • <span className="text-cyber-emerald">{product.storesCount} Mağaza</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-black text-cyber-emerald">
                        ₺{product.lowestPrice.toLocaleString('tr-TR')}
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase">en dip</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 font-mono">
          {/* Günün Kelepirleri */}
          <button
            onClick={onFilterKelepir}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isKelepirActive
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 ring-2 ring-rose-400'
                : 'bg-obsidian-900 text-rose-400 hover:bg-white/5 border border-rose-500/30'
            }`}
            title="Sadece Dip Fiyatlar"
          >
            <Flame size={14} className={isKelepirActive ? 'animate-bounce' : ''} />
            <span className="hidden md:inline">Kelepirler</span>
          </button>

          {/* Market Sepeti */}
          <button
            onClick={onOpenMarketBasket}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-obsidian-900 text-cyber-emerald hover:bg-white/5 border border-cyber-emerald/30 transition-all"
            title="Market Sepetini Kıyasla"
          >
            <ShoppingCart size={14} />
            <span className="hidden lg:inline">Market Sepeti</span>
          </button>

          {/* Kuponlar */}
          <button
            onClick={onOpenCoupons}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-obsidian-900 text-amber-400 hover:bg-white/5 border border-amber-500/30 transition-all"
            title="Kupon Kodları"
          >
            <Tag size={14} />
            <span className="hidden xl:inline">Kuponlar</span>
          </button>

          {/* Fiyat Alarmları */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2.5 rounded-xl bg-obsidian-900 text-slate-300 hover:text-cyber-emerald hover:bg-white/5 border border-white/10 transition-all"
            title="Fiyat Alarmları"
          >
            <Bell size={15} />
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyber-emerald text-obsidian-950 text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                {alertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
