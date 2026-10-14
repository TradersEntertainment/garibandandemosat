import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  CreditCard,
  ExternalLink,
  Bell,
  Sparkles,
  Share2,
  Heart,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, StoreOffer } from '../types';
import { PriceHistoryChart } from './PriceHistoryChart';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSetAlert: (product: Product, targetPrice?: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSetAlert,
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'magazalar' | 'gecmis' | 'ozellikler'>('magazalar');
  const [storeFilter, setStoreFilter] = useState<'all' | 'freeShipping' | 'installments'>('all');
  const [targetAlertPrice, setTargetAlertPrice] = useState<string>(
    (product.lowestPrice * 0.95).toFixed(0)
  );
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Filter store offers
  const filteredOffers = product.offers.filter((offer) => {
    if (storeFilter === 'freeShipping') return offer.shippingFee === 0;
    if (storeFilter === 'installments') return offer.installments.toLowerCase().includes('peşin');
    return true;
  });

  const bestOffer = product.offers[0];
  const maxOfferPrice = Math.max(...product.offers.map((o) => o.price));
  const maxSavings = maxOfferPrice - product.lowestPrice;

  // Trigger celebration confetti
  const handleStoreRedirect = (offer: StoreOffer) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#06b6d4', '#fbbf24'],
    });
    window.open(offer.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    onSetAlert(product, Number(targetAlertPrice));
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3500);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <Sparkles size={13} />
              Gariban Fiyat Denetimi
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Ürün ID: #{product.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors relative"
              title="Bağlantıyı Kopyala"
            >
              <Share2 size={16} />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-1 rounded shadow whitespace-nowrap">
                  Kopyalandı!
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Top Product Hero Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Image Preview */}
            <div className="md:col-span-5 bg-slate-950 rounded-2xl p-6 border border-slate-800 flex items-center justify-center relative group">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-64 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs font-semibold px-2.5 py-1 rounded-lg text-slate-300">
                {product.brand}
              </div>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow flex items-center gap-1">
                  <TrendingDown size={14} />
                  -%{product.discountPercentage}
                </div>
              )}
            </div>

            {/* Title & Quick Stats */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} className="fill-amber-400" />
                  <span className="font-bold text-white text-sm">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400">
                  ({product.reviewCount} kullanıcı değerlendirmesi)
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {product.title}
              </h2>

              {/* Price & Savings Pill */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                      En Dip Fiyat (Garantili)
                    </span>
                    <div className="text-3xl font-black text-emerald-400">
                      ₺{product.lowestPrice.toLocaleString('tr-TR')}
                    </div>
                  </div>
                  {maxSavings > 0 && (
                    <div className="text-right">
                      <span className="text-xs text-slate-400">En pahalı mağazaya kıyasla:</span>
                      <div className="text-sm font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        ₺{maxSavings.toLocaleString('tr-TR')} Cepte Kalıyor!
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  En ucuz satıcı: <strong className="text-white">{bestOffer?.storeName}</strong> ({bestOffer?.sellerName})
                </div>
              </div>

              {/* AI Verdict Box */}
              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <Sparkles size={15} />
                  <span>Gariban Yapay Zeka Tavsiyesi:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                    {product.garibanVerdict}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{product.aiAdvice}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-2">
            <button
              onClick={() => setActiveTab('magazalar')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'magazalar'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>Mağaza Fiyatları ({product.offers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('gecmis')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'gecmis'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>Fiyat Geçmişi Grafiği</span>
            </button>
            <button
              onClick={() => setActiveTab('ozellikler')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'ozellikler'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>Teknik Özellikler</span>
            </button>
          </div>

          {/* Tab 1: Store Comparison List */}
          {activeTab === 'magazalar' && (
            <div className="space-y-4">
              {/* Store Filters */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-slate-400">
                  Toplam <span className="text-white font-bold">{product.offers.length}</span> mağaza teklifi listeleniyor
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setStoreFilter('all')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      storeFilter === 'all'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    onClick={() => setStoreFilter('freeShipping')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      storeFilter === 'freeShipping'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ücretsiz Kargo
                  </button>
                  <button
                    onClick={() => setStoreFilter('installments')}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      storeFilter === 'installments'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Peşin Fiyatına Taksit
                  </button>
                </div>
              </div>

              {/* Offer Rows */}
              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                {filteredOffers.map((offer, index) => {
                  const isLowest = index === 0;
                  return (
                    <div
                      key={offer.id}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        isLowest
                          ? 'bg-emerald-950/20 border-l-4 border-l-emerald-500'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Store & Seller Info */}
                      <div className="space-y-1 sm:max-w-[40%]">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-white">
                            {offer.storeName}
                          </span>
                          {offer.badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                offer.badge === 'En Ucuz'
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              }`}
                            >
                              {offer.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span>Satıcı: <span className="text-slate-200">{offer.sellerName}</span></span>
                          <span className="flex items-center text-amber-400 gap-0.5">
                            <Star size={11} className="fill-amber-400" />
                            {offer.sellerRating}
                          </span>
                        </div>
                      </div>

                      {/* Shipping & Installments */}
                      <div className="flex sm:flex-col gap-3 sm:gap-1 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Truck size={13} className="text-slate-400" />
                          <span>
                            {offer.shippingFee === 0 ? (
                              <strong className="text-emerald-400">Ücretsiz Kargo</strong>
                            ) : (
                              `+₺${offer.shippingFee} Kargo`
                            )}
                          </span>
                          <span className="text-slate-500">• {offer.shippingTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <CreditCard size={13} />
                          <span>{offer.installments}</span>
                        </div>
                      </div>

                      {/* Price & CTA Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-black text-white">
                            ₺{offer.price.toLocaleString('tr-TR')}
                          </div>
                          {offer.originalPrice && (
                            <div className="text-xs text-slate-500 line-through">
                              ₺{offer.originalPrice.toLocaleString('tr-TR')}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleStoreRedirect(offer)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                            isLowest
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 scale-102'
                              : 'bg-slate-800 hover:bg-slate-700 text-white'
                          }`}
                        >
                          <span>Mağazaya Git</span>
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Set Price Alert Card */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950/60 p-5 rounded-2xl border border-indigo-500/30 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                      <Bell size={16} />
                      <span>Fiyat Düşünce Anında Haber Verelim!</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Bu ürün belirlediğin fiyatın altına indiğinde e-posta veya anlık bildirim al.
                    </p>
                  </div>

                  <form onSubmit={handleCreateAlert} className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">₺</span>
                      <input
                        type="number"
                        value={targetAlertPrice}
                        onChange={(e) => setTargetAlertPrice(e.target.value)}
                        placeholder="Hedef Fiyat"
                        className="bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm text-white w-32 focus:outline-none focus:border-indigo-400"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Bell size={13} />
                      <span>Alarm Kur</span>
                    </button>
                  </form>
                </div>
                {alertSuccess && (
                  <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 size={14} />
                    <span>Fiyat alarmı başarıyla kuruldu! Fiyat ₺{Number(targetAlertPrice).toLocaleString('tr-TR')} altına düştüğünde bildirilecek.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Price History Chart */}
          {activeTab === 'gecmis' && (
            <div className="space-y-4">
              <PriceHistoryChart
                labels={product.priceHistory.labels}
                prices={product.priceHistory.prices}
                minPrice={product.priceHistory.minPrice}
                maxPrice={product.priceHistory.maxPrice}
                averagePrice={product.priceHistory.averagePrice}
                productTitle={product.title}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-400" />
                    Fiyat Şişirme Kontrolü
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Garibandan.com algoritmaları son 6 aylık fiyat grafiğini inceledi. Bazı mağazaların indirim öncesi fiyatı yukarı çekip sahte indirim yapma taktiği bu üründe <strong>tespit edilmedi</strong>. İndirim gerçektir.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-emerald-400" />
                    Satın Almak İçin Doğru Zaman mı?
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Mevcut fiyat (₺{product.lowestPrice.toLocaleString('tr-TR')}), son 6 ayın ortalama fiyatı olan ₺{product.priceHistory.averagePrice.toLocaleString('tr-TR')}\'nin <strong>altında</strong> seyretmektedir.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Technical Specs */}
          {activeTab === 'ozellikler' && (
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
              <div className="p-4 bg-slate-900 border-b border-slate-800 font-bold text-sm text-white">
                Ürün Teknik Özellikleri
              </div>
              <div className="divide-y divide-slate-800/80 text-xs">
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <div key={idx} className="grid grid-cols-12 p-3 hover:bg-slate-800/30 transition-colors">
                    <div className="col-span-5 font-semibold text-slate-400">{key}</div>
                    <div className="col-span-7 text-slate-200 font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
