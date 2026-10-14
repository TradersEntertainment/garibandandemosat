import React from 'react';
import { X, Bell, Trash2, TrendingDown, ExternalLink } from 'lucide-react';
import { Product } from '../types';

export interface PriceAlertItem {
  productId: string;
  productTitle: string;
  productImage: string;
  currentLowestPrice: number;
  targetPrice: number;
  createdAt: string;
}

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: PriceAlertItem[];
  onRemoveAlert: (productId: string) => void;
  onSelectProductById: (productId: string) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onRemoveAlert,
  onSelectProductById,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Bell size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Fiyat Takip Radarım</span>
                <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-md font-extrabold">
                  {alerts.length} Aktif Takip
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Hedef fiyatına ulaşıldığında anında bildirim alacağınız ürünler
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

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500">
                <Bell size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-200">Henüz aktif fiyat alarmınız yok</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Ürün detayında veya ürün kartlarındaki zil simgesine tıklayarak hedeflediğiniz fiyatı girin, fiyat düşünce haber verelim.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.productId}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-indigo-500/40 transition-colors"
              >
                <div
                  onClick={() => {
                    onClose();
                    onSelectProductById(alert.productId);
                  }}
                  className="flex items-center gap-3 flex-1 cursor-pointer group"
                >
                  <img
                    src={alert.productImage}
                    alt={alert.productTitle}
                    className="w-12 h-12 object-contain rounded-xl bg-slate-900 border border-slate-800 p-1"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {alert.productTitle}
                    </h4>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="text-slate-400">
                        Şu An: <strong className="text-white">₺{alert.currentLowestPrice.toLocaleString('tr-TR')}</strong>
                      </span>
                      <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        Hedef: ₺{alert.targetPrice.toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveAlert(alert.productId)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Alarmı Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
