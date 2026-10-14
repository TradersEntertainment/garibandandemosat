import React, { useState, useRef } from 'react';
import { Star, Bell, ArrowRight, ShieldCheck, TrendingDown, Store, Sparkles, RotateCw, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onSetAlert: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onSetAlert,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [is3dSpinning, setIs3dSpinning] = useState(false);

  const priceDifference = product.highestPrice - product.lowestPrice;
  const bestOffer = product.offers[0];

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);

    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const toggle3dSpin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIs3dSpinning(!is3dSpinning);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(product)}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className="card-3d-wrap group relative flex flex-col bg-obsidian-850/90 rounded-3xl border border-white/8 overflow-hidden hover:border-cyber-emerald/40 hover:shadow-2xl hover:shadow-cyber-emerald/10 transition-all duration-200 cursor-pointer"
    >
      {/* Specular Glare Effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-30"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(13, 245, 162, 0.25) 0%, transparent 60%)`,
          opacity: glarePosition.opacity,
        }}
      />

      {/* Top Badges Bar */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
        {/* Gariban Score Badge with Cyber Styling */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-black shadow-lg bg-obsidian-950/90 border border-cyber-emerald/40 text-cyber-emerald backdrop-blur-md">
          <Sparkles size={12} className="animate-pulse" />
          <span>{product.garibanScore}</span>
          <span className="text-[10px] text-slate-400">/10</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* 3D Spin Toggle Button */}
          <button
            onClick={toggle3dSpin}
            title={is3dSpinning ? '3D Dönüşü Durdur' : '3D 360° Döndür'}
            className={`p-1.5 rounded-xl backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1 border transition-all ${
              is3dSpinning
                ? 'bg-cyber-emerald text-obsidian-950 border-cyber-emerald shadow-lg shadow-cyber-emerald/20'
                : 'bg-obsidian-950/80 text-slate-300 hover:text-cyber-emerald border-white/10'
            }`}
          >
            <RotateCw size={12} className={is3dSpinning ? 'animate-spin' : ''} />
            <span className="text-[10px]">3D</span>
          </button>

          {/* Discount Badge */}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="flex items-center gap-0.5 bg-rose-500 text-white text-xs font-mono font-black px-2 py-1 rounded-xl shadow-md">
              <TrendingDown size={12} />
              -%{product.discountPercentage}
            </span>
          )}

          {/* Quick Alert Bell */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetAlert(product);
            }}
            title="Fiyat Alarmı Kur"
            className="p-1.5 rounded-xl bg-obsidian-950/80 backdrop-blur-md text-slate-400 hover:text-cyber-emerald border border-white/10 transition-colors"
          >
            <Bell size={13} />
          </button>
        </div>
      </div>

      {/* Image Showcase Stage with 3D Spin capability */}
      <div className="relative w-full pt-[75%] bg-gradient-to-b from-obsidian-950 to-obsidian-900/60 overflow-hidden flex items-center justify-center p-5">
        {/* Subtle radial light in background */}
        <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />

        <img
          src={product.image}
          alt={product.title}
          style={{
            transform: is3dSpinning
              ? 'scale(1.08) rotateY(360deg)'
              : undefined,
            transition: is3dSpinning ? 'transform 3s linear infinite' : 'transform 0.4s ease-out',
          }}
          className={`absolute inset-0 w-full h-full object-contain p-6 transform group-hover:scale-105 transition-transform duration-300 ${
            is3dSpinning ? 'animate-spin-slow' : ''
          }`}
          loading="lazy"
        />

        {/* Free Shipping Tag */}
        {product.freeShippingAvailable && (
          <div className="absolute bottom-2.5 left-3.5 bg-obsidian-950/90 backdrop-blur-md text-cyber-emerald border border-cyber-emerald/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
            <ShieldCheck size={11} />
            ÜCRETSİZ KARGO
          </div>
        )}

        {/* 3D Spin Active Indicator */}
        {is3dSpinning && (
          <div className="absolute bottom-2.5 right-3.5 bg-cyber-emerald text-obsidian-950 text-[10px] font-mono font-black px-2 py-0.5 rounded-lg animate-pulse">
            3D DÖNÜYOR
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Reviews */}
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="font-bold text-cyber-emerald uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-slate-300">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="font-bold text-white">{product.rating}</span>
              <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-cyber-mint transition-colors font-display">
            {product.title}
          </h3>

          {/* Telemetry pill */}
          <div className="mt-2.5 flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Store size={12} className="text-slate-500" />
              {product.storesCount} Mağaza
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-cyber-emerald truncate font-semibold">
              {product.garibanVerdict}
            </span>
          </div>
        </div>

        {/* Pricing & Footer Block */}
        <div className="mt-4 pt-3.5 border-t border-white/8">
          {/* Price difference callout */}
          {priceDifference > 0 && (
            <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Arbitraj Farkı:</span>
              <span className="font-bold text-cyber-emerald">
                ₺{priceDifference.toLocaleString('tr-TR')} cepte!
              </span>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400">
                En Dip Teklif
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                  ₺{product.lowestPrice.toLocaleString('tr-TR')}
                </span>
                {product.previousPrice && (
                  <span className="text-xs text-slate-500 line-through font-mono">
                    ₺{product.previousPrice.toLocaleString('tr-TR')}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                {bestOffer ? bestOffer.storeName : 'Amazon TR'}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="flex items-center gap-1 px-3.5 py-2.5 bg-cyber-emerald hover:bg-cyber-mint text-obsidian-950 text-xs font-mono font-black uppercase tracking-wider rounded-xl shadow-lg shadow-cyber-emerald/15 transition-all transform active:scale-95"
            >
              <span>İncele</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
