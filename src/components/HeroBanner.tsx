import React from 'react';
import { HERO_IMAGE } from '../data/products';
import { analytics } from '../services/analytics';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  const handleHeroClick = () => {
    analytics.trackSelectPromotion('Google Merch Drop - Wear What You Search For');
    onShopNow();
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[520px] lg:min-h-[580px]">
        {/* Left Copy & CTA */}
        <div className="lg:col-span-6 flex flex-col justify-center px-6 py-12 sm:px-10 lg:py-16 z-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autumn/Winter 2026 Capsule</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-white uppercase mb-4 text-balance">
            Google <br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              Merch Drop.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-md mb-8 font-normal leading-relaxed">
            Wear What You Search For. Heavyweight streetwear crafted for developers, creators, and internet culture pioneers.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={handleHeroClick}
              className="group inline-flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-xl font-bold text-sm tracking-wide uppercase hover:bg-slate-100 transition-all shadow-lg hover:shadow-white/10"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-4 px-2 py-1 text-xs text-slate-400 font-mono">
              <span>01 / 05 Drops</span>
              <span>·</span>
              <span>Limited 450 GSM Terry</span>
            </div>
          </div>
        </div>

        {/* Right Hero Lifestyle Photography */}
        <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full">
          <img
            src={HERO_IMAGE}
            alt="Google Merch Streetwear Drop Models"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center filter saturate-[1.05]"
          />
          {/* Subtle gradient overlay to smoothly blend with text area */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-transparent lg:to-transparent opacity-80 lg:opacity-60" />

          {/* Floating collection sticker */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-lg text-xs font-semibold shadow-xl border border-white/50 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Google Originals × Street Series</span>
          </div>
        </div>
      </div>
    </section>
  );
};
