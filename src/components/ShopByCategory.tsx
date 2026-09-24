import React from 'react';
import { CATEGORIES } from '../data/products';
import { analytics } from '../services/analytics';
import { ArrowUpRight } from 'lucide-react';

interface ShopByCategoryProps {
  onSelectCategory: (categoryId: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onSelectCategory }) => {
  const handleCategoryClick = (cat: (typeof CATEGORIES)[0]) => {
    // PRD Specified GA4 Event: select_category (category_name) and select_item
    analytics.trackSelectCategory(cat.name);
    analytics.trackSelectItem(`cat-${cat.id}`, `Category: ${cat.name}`);
    onSelectCategory(cat.id);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-600 mb-1">
            <span>Essential Departments</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Shop By Category
          </h2>
        </div>
        <p className="text-sm text-slate-500 max-w-md">
          Curated streetwear silhouettes, developer staples, and lifestyle collectibles engineered with Google design principles.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Category Image */}
            <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              {/* Category Emoji Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-xs">
                {cat.icon}
              </div>

              {/* Category Name overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-display font-bold text-lg leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-300 font-mono">
                  {cat.count}+ drops
                </span>
              </div>
            </div>

            {/* Shop Now Action */}
            <div className="p-3 bg-white border-t border-slate-100">
              <button
                onClick={() => handleCategoryClick(cat)}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-900 text-slate-900 hover:text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Shop Now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
