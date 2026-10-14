import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Clock,
  Phone,
  CheckCircle2,
  Sparkles,
  MapPin,
  Wrench,
  Calculator,
  MessageCircle,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ServiceItem, ServiceProvider } from '../types';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookService?: (serviceTitle: string, providerName: string, price: number) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService,
}) => {
  if (!service) return null;

  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    service.options[0]?.id || ''
  );
  const [bookedProvider, setBookedProvider] = useState<string | null>(null);

  const selectedOption =
    service.options.find((opt) => opt.id === selectedOptionId) || service.options[0];
  const multiplier = selectedOption ? selectedOption.multiplier : 1.0;

  // Dynamically calculate adjusted floor price based on user selection
  const calculatedFloorPrice = Math.round(service.baseFloorPrice * multiplier);
  const calculatedArmutPrice = Math.round(service.armutAveragePrice * multiplier);
  const calculatedSavings = calculatedArmutPrice - calculatedFloorPrice;

  const handleContactProvider = (provider: ServiceProvider) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0df5a2', '#34f8b9', '#6366f1', '#eab308'],
    });

    setBookedProvider(provider.id);
    if (onBookService) {
      onBookService(service.title, provider.name, Math.round(provider.price * multiplier));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-obsidian-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-4 cyber-border-gradient">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-obsidian-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyber-emerald/10 border border-cyber-emerald/30 flex items-center justify-center text-cyber-emerald">
              <Wrench size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyber-emerald uppercase tracking-wider bg-cyber-emerald/10 border border-cyber-emerald/20 px-2 py-0.5 rounded">
                  {service.categoryLabel}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                  #GaribanUstaRadarı
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-display">
                {service.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-obsidian-850 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Top Hero & Live Floor Price Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 h-48 rounded-2xl overflow-hidden relative border border-white/10 group">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white font-mono flex items-center gap-1.5 bg-obsidian-950/80 backdrop-blur-md p-2 rounded-xl border border-white/10">
                <ShieldCheck size={14} className="text-cyber-emerald shrink-0" />
                <span className="line-clamp-1">{service.guaranteeText}</span>
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {service.shortDesc}
              </p>

              {/* Price comparison card */}
              <div className="bg-obsidian-950 p-4 rounded-2xl border border-cyber-emerald/30">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-cyber-emerald tracking-wider">
                      Gariban Taban Fiyatı (Sabit)
                    </span>
                    <div className="text-3xl font-black text-white font-mono tracking-tight">
                      ₺{calculatedFloorPrice.toLocaleString('tr-TR')}
                      <span className="text-xs text-slate-400 font-normal ml-1">/ {service.unit}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400">Armut Ortalama Teklifi:</span>
                    <div className="text-sm font-bold text-slate-400 line-through">
                      ₺{calculatedArmutPrice.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-xs font-black text-cyber-emerald mt-0.5">
                      +₺{calculatedSavings.toLocaleString('tr-TR')} Cepte Kalıyor!
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-ping" />
                  <span>Teklif beklemek yok. Ustayla aracısız, doğrudan komisyonsuz fiyat.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator: Options selector */}
          {service.options.length > 0 && (
            <div className="space-y-3 bg-obsidian-950/60 p-4 sm:p-5 rounded-2xl border border-white/8">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                <Calculator size={14} className="text-cyber-emerald" />
                <span>Hizmet Kapsamını Seçin (Fiyat Anında Güncellenir):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {service.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const optPrice = Math.round(service.baseFloorPrice * option.multiplier);
                  return (
                    <div
                      key={option.id}
                      onClick={() => setSelectedOptionId(option.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyber-emerald/10 border-cyber-emerald shadow-lg shadow-cyber-emerald/10'
                          : 'bg-obsidian-900 border-white/8 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold text-white font-display mb-0.5">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-[10px] text-slate-400 font-sans mb-1.5">
                          {option.description}
                        </div>
                      )}
                      <div className="text-sm font-mono font-black text-cyber-emerald">
                        ₺{optPrice.toLocaleString('tr-TR')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Providers List (Ustalar & Servisler) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white">
                Bölgenizdeki Onaylı Ustalar & Servisler ({service.providers.length})
              </span>
              <span className="text-slate-400 text-[11px]">
                En düşük fiyata göre sıralandı
              </span>
            </div>

            <div className="divide-y divide-white/8 border border-white/10 rounded-2xl overflow-hidden bg-obsidian-950/60">
              {service.providers.map((provider) => {
                const adjustedPrice = Math.round(provider.price * multiplier);
                const isBooked = bookedProvider === provider.id;

                return (
                  <div
                    key={provider.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                  >
                    {/* Provider Info */}
                    <div className="flex items-center gap-3.5">
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="w-12 h-12 rounded-2xl object-cover bg-obsidian-900 border border-white/10"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white font-display">
                            {provider.name}
                          </h4>
                          <span className="text-[10px] font-mono font-bold bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30 px-2 py-0.2 rounded-md">
                            {provider.verifiedBadge}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-sans">
                          {provider.businessName}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star size={11} className="fill-amber-400" />
                            {provider.rating}
                          </span>
                          <span>•</span>
                          <span>{provider.completedJobsCount} iş tamamladı</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-slate-400">
                            <MapPin size={11} />
                            {provider.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Response & Guarantee */}
                    <div className="text-xs font-mono text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-cyber-emerald font-semibold">
                        <Clock size={12} />
                        <span>{provider.responseTime}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {provider.warrantyDays > 0 ? `${provider.warrantyDays} Gün İşçilik Garantisi` : 'Anında Teslim'}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/8">
                      <div className="text-right font-mono">
                        <div className="text-xl font-black text-white">
                          ₺{adjustedPrice.toLocaleString('tr-TR')}
                        </div>
                        <div className="text-[10px] text-cyber-emerald font-bold">
                          Komisyonsuz Net
                        </div>
                      </div>

                      <button
                        onClick={() => handleContactProvider(provider)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg ${
                          isBooked
                            ? 'bg-cyber-emerald text-obsidian-950 font-black'
                            : 'bg-cyber-emerald hover:bg-cyber-mint text-obsidian-950'
                        }`}
                      >
                        {isBooked ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Usta Arandı!</span>
                          </>
                        ) : (
                          <>
                            <Phone size={13} />
                            <span>Hemen Ara / Randevu</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why Garibandan vs Armut Notice */}
          <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/8 text-xs font-sans text-slate-400 space-y-1.5">
            <div className="font-bold text-white font-mono flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyber-emerald" />
              <span>Neden Armut Yerine Garibandan Usta Radarı?</span>
            </div>
            <p className="leading-relaxed">
              Armut'ta talep açtığınızda ustadan %20-25 komisyon kesildiği için ustalar fiyatı şişirir ve saatlerce teklif beklemeniz gerekir. Garibandan'da komisyon sıfırdır; doğrudan en ucuz taban fiyattan doğrulanmış ustalara ulaşırsınız.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
