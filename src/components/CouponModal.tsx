import React, { useState } from 'react';
import { X, Tag, Copy, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { POPULAR_COUPONS } from '../data/coupons';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeStore, setActiveStore] = useState<string>('all');

  const handleCopy = (id: string, code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredCoupons = POPULAR_COUPONS.filter((coupon) => {
    if (activeStore === 'all') return true;
    return coupon.store.toLowerCase().includes(activeStore.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Tag size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Günün Kupon & İndirim Kodları</span>
                <span className="text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-extrabold">
                  Canlı Denetlendi
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ödeme adımında yapıştırabileceğiniz çalışan aktif mağaza kodları
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Store Tabs */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          {['all', 'Amazon', 'Trendyol', 'Hepsiburada', 'N11', 'Teknosa'].map((store) => (
            <button
              key={store}
              onClick={() => setActiveStore(store)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeStore === store
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {store === 'all' ? 'Tüm Mağazalar' : store}
            </button>
          ))}
        </div>

        {/* Coupons List */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {filteredCoupons.map((coupon) => {
            const isCopied = copiedId === coupon.id;
            return (
              <div
                key={coupon.id}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                      {coupon.store}
                    </span>
                    <span className="text-xs font-black text-amber-400">
                      {coupon.discount} İndirim
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{coupon.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Alt limit: <strong className="text-slate-200">{coupon.minSpend}</strong></span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {coupon.expires}
                    </span>
                  </div>
                </div>

                {/* Code Copy Button */}
                <div className="flex items-center gap-2">
                  <div className="bg-slate-900 border border-dashed border-emerald-500/40 px-3 py-2 rounded-xl font-mono text-sm font-bold text-emerald-300 tracking-wider">
                    {coupon.code}
                  </div>
                  <button
                    onClick={() => handleCopy(coupon.id, coupon.code)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                      isCopied
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
