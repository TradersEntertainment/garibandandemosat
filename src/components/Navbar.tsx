import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Flame,
  ShoppingCart,
  Tag,
  Bell,
  Sparkles,
  TrendingDown,
  X,
  ExternalLink,
  ChevronRight
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
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to focus search
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

  // Filter products for dropdown
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 py-1.5 px-4 text-center text-[11px] font-medium border-b border-emerald-900/40 flex items-center justify-center gap-2">
        <span className="flex items-center gap-1 text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          CANLI FİYAT RADARI:
        </span>
        <span className="text-slate-300 hidden sm:inline">
          Bugün 52.840 ürün fiyatı tarandı • Trendyol, Amazon, Hepsiburada ve 45+ mağaza aktif
        </span>
        <span className="text-slate-300 sm:hidden">
          52.840 ürün fiyatı tarandı!
        </span>
        <span className="text-emerald-400 font-bold ml-1">#GaribanınDostu</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            onSearchChange('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="text-2xl leading-none">₺</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                garibandan<span className="text-emerald-400">.com</span>
              </span>
              <span className="hidden md:inline-block text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                v2.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
              Halkın Akıllı Fiyat Karşılaştırma Motoru
            </div>
          </div>
        </div>

        {/* Global Search Bar with Live Suggestions */}
        <div ref={searchRef} className="relative flex-1 max-w-xl mx-2 sm:mx-4">
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute left-3.5 text-slate-400 pointer-events-none group-focus-within:text-emerald-400"
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
              placeholder="Ürün adı, marka veya model ara... (örn: iPhone 16, Dyson V15, Fairy)"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-10 pr-12 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 text-slate-400 hover:text-white p-1"
              >
                <X size={15} />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block absolute right-3 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 rounded border border-slate-700 pointer-events-none">
                /
              </kbd>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
                Bulunan Eşleşmeler
              </div>
              <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      setIsDropdownOpen(false);
                    }}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white line-clamp-1">
                          {product.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {product.brand} • <span className="text-emerald-400">{product.storesCount} Mağaza</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-400">
                        ₺{product.lowestPrice.toLocaleString('tr-TR')}
                      </div>
                      <div className="text-[10px] text-slate-500">en ucuz</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Günün Kelepirleri Filter Toggle */}
          <button
            onClick={onFilterKelepir}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isKelepirActive
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 ring-2 ring-rose-400'
                : 'bg-slate-900 text-rose-400 hover:bg-slate-800 border border-rose-500/30'
            }`}
            title="Sadece Son 6 Ayın En Dip Fiyatları"
          >
            <Flame size={15} className={isKelepirActive ? 'animate-bounce' : ''} />
            <span className="hidden md:inline">Günün Kelepirleri</span>
          </button>

          {/* Market Sepeti Button */}
          <button
            onClick={onOpenMarketBasket}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-emerald-400 hover:bg-slate-800 border border-emerald-500/30 transition-all"
            title="Market Sepetini Kıyasla (Migros, Şok, A101)"
          >
            <ShoppingCart size={15} />
            <span className="hidden lg:inline">Market Sepeti</span>
          </button>

          {/* Kuponlar Button */}
          <button
            onClick={onOpenCoupons}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 border border-amber-500/30 transition-all"
            title="Çalışan Kupon Kodları"
          >
            <Tag size={15} />
            <span className="hidden xl:inline">Kuponlar</span>
          </button>

          {/* Fiyat Alarmları Button */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-indigo-400 hover:bg-slate-800 border border-slate-700/80 transition-all"
            title="Kayıtlı Fiyat Alarmları"
          >
            <Bell size={16} />
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                {alertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
