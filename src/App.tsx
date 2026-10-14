import React, { useState, useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Sparkles,
  Flame,
  Truck,
  Store,
  ShieldAlert,
  Search,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { Product } from './types';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DealsSection } from './components/DealsSection';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { MarketBasketModal } from './components/MarketBasketModal';
import { CouponModal } from './components/CouponModal';
import { PriceAlertModal, PriceAlertItem } from './components/PriceAlertModal';
import { Footer } from './components/Footer';

export function App() {
  // Navigation & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'garibanScore' | 'lowestPrice' | 'highestDiscount' | 'rating'>('garibanScore');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [isKelepirOnly, setIsKelepirOnly] = useState<boolean>(false);
  const [onlyFreeShipping, setOnlyFreeShipping] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(100000);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMarketBasketOpen, setIsMarketBasketOpen] = useState<boolean>(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState<boolean>(false);

  // Price Alerts State with LocalStorage
  const [alerts, setAlerts] = useState<PriceAlertItem[]>(() => {
    try {
      const saved = localStorage.getItem('gariban_alerts');
      return saved ? JSON.parse(saved) : [
        {
          productId: 'p-1',
          productTitle: 'Apple iPhone 16 Pro 256GB Çöl Titanyum',
          productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
          currentLowestPrice: 77499,
          targetPrice: 74999,
          createdAt: 'Dün'
        },
        {
          productId: 'p-2',
          productTitle: 'Dyson V15 Detect Absolute Şarjlı Dikey Süpürge',
          productImage: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
          currentLowestPrice: 24999,
          targetPrice: 22999,
          createdAt: '3 gün önce'
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gariban_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }, [alerts]);

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesBrand && !matchesTags) {
          return false;
        }
      }

      // Kelepir flag
      if (isKelepirOnly && !product.isKelepir) {
        return false;
      }

      // Free shipping
      if (onlyFreeShipping && !product.freeShippingAvailable) {
        return false;
      }

      // Store filter
      if (selectedStore !== 'all') {
        const sellsInStore = product.offers.some((o) => o.storeName === selectedStore);
        if (!sellsInStore) return false;
      }

      // Price limit
      if (product.lowestPrice > priceRange) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'lowestPrice') return a.lowestPrice - b.lowestPrice;
      if (sortBy === 'highestDiscount') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: Gariban Score
      return b.garibanScore - a.garibanScore;
    });
  }, [
    selectedCategory,
    searchQuery,
    isKelepirOnly,
    onlyFreeShipping,
    selectedStore,
    priceRange,
    sortBy,
  ]);

  // Add Alert handler
  const handleAddAlert = (product: Product, targetPrice?: number) => {
    const target = targetPrice || Math.round(product.lowestPrice * 0.95);
    setAlerts((prev) => {
      const exists = prev.find((a) => a.productId === product.id);
      if (exists) {
        return prev.map((a) => (a.productId === product.id ? { ...a, targetPrice: target } : a));
      }
      return [
        {
          productId: product.id,
          productTitle: product.title,
          productImage: product.image,
          currentLowestPrice: product.lowestPrice,
          targetPrice: target,
          createdAt: 'Az önce'
        },
        ...prev
      ];
    });
    showToast(`₺${target.toLocaleString('tr-TR')} hedefli fiyat alarmı kuruldu!`);
  };

  const handleRemoveAlert = (productId: string) => {
    setAlerts((prev) => prev.filter((a) => a.productId !== productId));
    showToast('Fiyat alarmı silindi.');
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedStore('all');
    setIsKelepirOnly(false);
    setOnlyFreeShipping(false);
    setPriceRange(100000);
    setSortBy('garibanScore');
  };

  const allStoresList = ['all', 'Amazon TR', 'Trendyol', 'Hepsiburada', 'Teknosa', 'MediaMarkt', 'N11', 'Pazarama'];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        products={PRODUCTS}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectProduct={setSelectedProduct}
        onOpenMarketBasket={() => setIsMarketBasketOpen(true)}
        onOpenCoupons={() => setIsCouponModalOpen(true)}
        onOpenAlerts={() => setIsPriceAlertModalOpen(true)}
        alertsCount={alerts.length}
        onFilterKelepir={() => setIsKelepirOnly((prev) => !prev)}
        isKelepirActive={isKelepirOnly}
      />

      {/* Hero Section */}
      <Hero
        onQuickSearch={(tag) => {
          setSearchQuery(tag);
          window.scrollTo({ top: 480, behavior: 'smooth' });
        }}
        onOpenMarketBasket={() => setIsMarketBasketOpen(true)}
        onFilterKelepir={() => setIsKelepirOnly(true)}
      />

      {/* Daily Deals / Kelepir Section */}
      <DealsSection
        products={PRODUCTS}
        onSelectProduct={setSelectedProduct}
      />

      {/* Sticky Category Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Catalog & Filter Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Filters and Sort Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">
              {filteredProducts.length} Ürün Bulundu
            </span>
            {isKelepirOnly && (
              <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Flame size={12} />
                Günün Kelepirleri Aktif
              </span>
            )}
            {searchQuery && (
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">
                "{searchQuery}" araması
              </span>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Store Select Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Store size={14} className="text-slate-400" />
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">Tüm Mağazalar</option>
                {allStoresList.filter(s => s !== 'all').map((store) => (
                  <option key={store} value={store} className="bg-slate-900">
                    {store}
                  </option>
                ))}
              </select>
            </div>

            {/* Free Shipping Filter Toggle */}
            <button
              onClick={() => setOnlyFreeShipping((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                onlyFreeShipping
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Truck size={14} />
              <span>Ücretsiz Kargo</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="garibanScore" className="bg-slate-900">Gariban Skoru (F/P Canavarı)</option>
                <option value="lowestPrice" className="bg-slate-900">En Düşük Fiyat</option>
                <option value="highestDiscount" className="bg-slate-900">En Yüksek İndirim (%)</option>
                <option value="rating" className="bg-slate-900">En Yüksek Puan</option>
              </select>
            </div>

            {/* Reset Filters button */}
            {(selectedCategory !== 'all' || searchQuery || selectedStore !== 'all' || isKelepirOnly || onlyFreeShipping) && (
              <button
                onClick={handleResetFilters}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                title="Filtreleri Temizle"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Aradığınız kriterde ürün bulunamadı</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Filtreleri esneterek veya arama teriminizi değiştirerek tekrar arama yapabilirsiniz.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              Tüm Ürünleri Göster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
                onSetAlert={(p) => {
                  setSelectedProduct(p);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSetAlert={(prod, target) => handleAddAlert(prod, target)}
      />

      {/* Market Basket Modal */}
      <MarketBasketModal
        isOpen={isMarketBasketOpen}
        onClose={() => setIsMarketBasketOpen(false)}
      />

      {/* Coupons Modal */}
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
      />

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isPriceAlertModalOpen}
        onClose={() => setIsPriceAlertModalOpen(false)}
        alerts={alerts}
        onRemoveAlert={handleRemoveAlert}
        onSelectProductById={(id) => {
          const found = PRODUCTS.find((p) => p.id === id);
          if (found) setSelectedProduct(found);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
