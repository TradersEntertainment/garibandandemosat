import React, { useState } from 'react';
import {
  X,
  Star,
  Truck,
  CreditCard,
  ExternalLink,
  Bell,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  RotateCw,
  Box
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

  const [activeTab, setActiveTab] = useState<'magazalar' | '3d' | 'gecmis' | 'ozellikler'>('magazalar');
  const [storeFilter, setStoreFilter] = useState<'all' | 'freeShipping' | 'installments'>('all');
  const [targetAlertPrice, setTargetAlertPrice] = useState<string>(
    (product.lowestPrice * 0.95).toFixed(0)
  );
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [is3dSpinning, setIs3dSpinning] = useState<boolean>(true);

  const filteredOffers = product.offers.filter((offer) => {
    if (storeFilter === 'freeShipping') return offer.shippingFee === 0;
    if (storeFilter === 'installments') return offer.installments.toLowerCase().includes('peşin');
    return true;
  });

  const bestOffer = product.offers[0];
  const maxOfferPrice = Math.max(...product.offers.map((o) => o.price));
  const maxSavings = maxOfferPrice - product.lowestPrice;

  const handleStoreRedirect = (offer: StoreOffer) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0df5a2', '#34f8b9', '#6366f1', '#f59e0b'],
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-obsidian-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-4 cyber-border-gradient">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-obsidian-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Sparkles size={13} />
              GARİBAN_DENETİM // ID: #{product.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white bg-obsidian-850 hover:bg-white/10 rounded-xl transition-colors relative"
              title="Bağlantıyı Kopyala"
            >
              <Share2 size={16} />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-cyber-emerald text-obsidian-950 text-[10px] font-mono font-bold px-2 py-1 rounded shadow whitespace-nowrap">
                  Kopyalandı!
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-obsidian-850 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Top Product Hero Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Image Preview with 3D Spin capability */}
            <div className="md:col-span-5 bg-gradient-to-b from-obsidian-950 to-obsidian-900 rounded-3xl p-6 border border-white/8 flex items-center justify-center relative group min-h-[260px] overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className={`max-h-60 w-auto object-contain transition-all duration-300 ${
                  is3dSpinning ? 'animate-spin-slow' : 'group-hover:scale-105'
                }`}
              />

              <div className="absolute top-3 left-3 bg-obsidian-950/90 backdrop-blur-md border border-white/10 text-xs font-mono font-bold px-2.5 py-1 rounded-xl text-slate-300">
                {product.brand}
              </div>

              {/* 3D Spin Toggle on preview */}
              <button
                onClick={() => setIs3dSpinning(!is3dSpinning)}
                className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 border transition-all ${
                  is3dSpinning
                    ? 'bg-cyber-emerald text-obsidian-950 border-cyber-emerald shadow-lg'
                    : 'bg-obsidian-950/90 text-slate-300 border-white/10'
                }`}
              >
                <RotateCw size={11} className={is3dSpinning ? 'animate-spin' : ''} />
                <span>{is3dSpinning ? '3D Dönüyor' : '3D Döndür'}</span>
              </button>

              {product.discountPercentage && product.discountPercentage > 0 && (
                <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-mono font-black px-2.5 py-1 rounded-xl shadow flex items-center gap-1">
                  <TrendingDown size={14} />
                  -%{product.discountPercentage}
                </div>
              )}
            </div>

            {/* Title & Quick Stats */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-2 font-mono">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={15} className="fill-amber-400" />
                  <span className="font-bold text-white text-sm">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400">
                  ({product.reviewCount} kullanıcı değerlendirmesi)
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight font-display">
                {product.title}
              </h2>

              {/* Price & Savings Pill */}
              <div className="bg-obsidian-950 border border-cyber-emerald/30 rounded-2xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-cyber-emerald uppercase tracking-wider">
                      En Dip Fiyat Garantisi
                    </span>
                    <div className="text-3xl font-black text-white font-mono tracking-tight mt-0.5">
                      ₺{product.lowestPrice.toLocaleString('tr-TR')}
                    </div>
                  </div>
                  {maxSavings > 0 && (
                    <div className="text-right font-mono">
                      <span className="text-[11px] text-slate-400">Piyasa Zirvesine Kıyasla:</span>
                      <div className="text-sm font-bold text-cyber-emerald bg-cyber-emerald/10 px-2.5 py-1 rounded-xl border border-cyber-emerald/20 mt-0.5">
                        ₺{maxSavings.toLocaleString('tr-TR')} Cebinizde!
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald"></span>
                  En ucuz teklif: <strong className="text-white">{bestOffer?.storeName}</strong> ({bestOffer?.sellerName})
                </div>
              </div>

              {/* AI Verdict Box */}
              <div className="bg-obsidian-950/80 rounded-2xl p-4 border border-white/8 text-xs font-sans">
                <div className="flex items-center gap-2 text-cyber-emerald font-bold mb-1 font-mono">
                  <Sparkles size={14} />
                  <span>Gariban Yapay Zeka Tavsiyesi:</span>
                  <span className="px-2 py-0.5 rounded-md bg-cyber-emerald/15 text-cyber-emerald font-semibold text-[11px]">
                    {product.garibanVerdict}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{product.aiAdvice}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('magazalar')}
              className={`pb-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'magazalar'
                  ? 'border-cyber-emerald text-cyber-emerald'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>Mağaza Fiyatları ({product.offers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={`pb-3 px-4 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === '3d'
                  ? 'border-cyber-emerald text-cyber-emerald'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Box size={14} />
              <span>3D 360° İnceleme</span>
            </button>
            <button
              onClick={() => setActiveTab('gecmis')}
              className={`pb-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'gecmis'
                  ? 'border-cyber-emerald text-cyber-emerald'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>Fiyat Geçmişi</span>
            </button>
            <button
              onClick={() => setActiveTab('ozellikler')}
              className={`pb-3 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'ozellikler'
                  ? 'border-cyber-emerald text-cyber-emerald'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>Teknik Özellikler</span>
            </button>
          </div>

          {/* Tab 1: Store Comparison List */}
          {activeTab === 'magazalar' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="text-slate-400">
                  Toplam <span className="text-white font-bold">{product.offers.length}</span> mağaza teklifi listeleniyor
                </div>
                <div className="flex items-center gap-1.5 bg-obsidian-950 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setStoreFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      storeFilter === 'all'
                        ? 'bg-cyber-emerald text-obsidian-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    onClick={() => setStoreFilter('freeShipping')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      storeFilter === 'freeShipping'
                        ? 'bg-cyber-emerald text-obsidian-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ücretsiz Kargo
                  </button>
                  <button
                    onClick={() => setStoreFilter('installments')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      storeFilter === 'installments'
                        ? 'bg-cyber-emerald text-obsidian-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Peşin Taksit
                  </button>
                </div>
              </div>

              {/* Offer Rows */}
              <div className="divide-y divide-white/8 border border-white/10 rounded-2xl overflow-hidden bg-obsidian-950/50">
                {filteredOffers.map((offer, index) => {
                  const isLowest = index === 0;
                  return (
                    <div
                      key={offer.id}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        isLowest
                          ? 'bg-cyber-emerald/5 border-l-4 border-l-cyber-emerald'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="space-y-1 sm:max-w-[40%]">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-white font-display">
                            {offer.storeName}
                          </span>
                          {offer.badge && (
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                offer.badge === 'En Ucuz'
                                  ? 'bg-cyber-emerald text-obsidian-950'
                                  : 'bg-cyber-indigo/20 text-cyber-indigo border border-cyber-indigo/30'
                              }`}
                            >
                              {offer.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                          <span>Satıcı: <span className="text-slate-200">{offer.sellerName}</span></span>
                          <span className="flex items-center text-amber-400 gap-0.5">
                            <Star size={11} className="fill-amber-400" />
                            {offer.sellerRating}
                          </span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-3 sm:gap-1 text-xs text-slate-300 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Truck size={13} className="text-slate-400" />
                          <span>
                            {offer.shippingFee === 0 ? (
                              <strong className="text-cyber-emerald">Ücretsiz Kargo</strong>
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

                      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/8">
                        <div className="text-right font-mono">
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
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg ${
                            isLowest
                              ? 'bg-cyber-emerald hover:bg-cyber-mint text-obsidian-950 shadow-cyber-emerald/20 scale-102'
                              : 'bg-obsidian-850 hover:bg-white/10 text-white'
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
              <div className="bg-obsidian-950 p-5 rounded-2xl border border-cyber-indigo/30 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-cyber-indigo font-bold text-sm font-mono">
                      <Bell size={16} />
                      <span>Fiyat Düşünce Anında Bildirim Alın</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 font-sans">
                      Bu ürün belirlediğiniz hedef fiyatın altına indiğinde e-posta veya anlık bildirim alın.
                    </p>
                  </div>

                  <form onSubmit={handleCreateAlert} className="flex items-center gap-2 w-full sm:w-auto font-mono">
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">₺</span>
                      <input
                        type="number"
                        value={targetAlertPrice}
                        onChange={(e) => setTargetAlertPrice(e.target.value)}
                        placeholder="Hedef Fiyat"
                        className="bg-obsidian-900 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-sm text-white w-32 focus:outline-none focus:border-cyber-indigo"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyber-indigo hover:bg-indigo-500 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Bell size={13} />
                      <span>Alarm Kur</span>
                    </button>
                  </form>
                </div>
                {alertSuccess && (
                  <div className="mt-3 text-xs text-cyber-emerald flex items-center gap-1.5 font-mono animate-in fade-in">
                    <CheckCircle2 size={14} />
                    <span>Alarm kuruldu! Fiyat ₺{Number(targetAlertPrice).toLocaleString('tr-TR')} altına indiğinde haber verilecek.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: 3D Turntable View */}
          {activeTab === '3d' && (
            <div className="bg-obsidian-950 rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />

              <div className="relative z-10 max-w-md mx-auto space-y-4">
                <span className="text-[11px] font-mono text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  3D TURNTABLE MODEL PREVIEW
                </span>

                <div className="w-64 h-64 mx-auto relative flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{
                      transform: is3dSpinning ? 'rotateY(360deg)' : 'none',
                      transition: is3dSpinning ? 'transform 3s linear infinite' : 'transform 0.3s',
                    }}
                    className={`max-h-full max-w-full object-contain ${
                      is3dSpinning ? 'animate-spin-slow' : ''
                    }`}
                  />
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIs3dSpinning(!is3dSpinning)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-emerald text-obsidian-950 font-mono font-bold text-xs uppercase"
                  >
                    <RotateCw size={14} className={is3dSpinning ? 'animate-spin' : ''} />
                    <span>{is3dSpinning ? 'Dönüşü Durdur' : '360° Otomatik Döndür'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 font-mono">
                  Gerçek boyutlu CAD / 3D doku simülasyonu
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Price History Chart */}
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
                <div className="bg-obsidian-950 p-4 rounded-2xl border border-white/8 text-xs font-sans">
                  <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5 font-display">
                    <AlertCircle size={14} className="text-amber-400" />
                    Fiyat Şişirme Kontrolü
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    Garibandan.com algoritmaları son 6 aylık fiyat grafiğini inceledi. Kampanya öncesi sahte zam taktiği bu üründe <strong>tespit edilmedi</strong>. İndirim gerçektir.
                  </p>
                </div>

                <div className="bg-obsidian-950 p-4 rounded-2xl border border-white/8 text-xs font-sans">
                  <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5 font-display">
                    <HelpCircle size={14} className="text-cyber-emerald" />
                    Satın Almak İçin Doğru Zaman mı?
                  </h4>
                  <p className="text-slate-400 leading-relaxed font-mono">
                    Şu anki teklif (₺{product.lowestPrice.toLocaleString('tr-TR')}), 6 aylık ortalama ₺{product.priceHistory.averagePrice.toLocaleString('tr-TR')}\'nin <strong>altındadır</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Technical Specs */}
          {activeTab === 'ozellikler' && (
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-obsidian-950/50">
              <div className="p-4 bg-obsidian-950 border-b border-white/10 font-bold text-sm text-white font-display">
                Ürün Teknik Özellikleri
              </div>
              <div className="divide-y divide-white/5 text-xs font-mono">
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <div key={idx} className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
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
