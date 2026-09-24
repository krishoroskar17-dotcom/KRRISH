import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Flame, ArrowRight } from 'lucide-react';

interface TrendingNowProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onViewAllTrending: () => void;
}

export const TrendingNow: React.FC<TrendingNowProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  onViewAllTrending,
}) => {
  // Filter 4 to 6 trending items matching the PRD examples
  const trendingProducts = products
    .filter((p) => p.isTrending || p.badges?.includes('TRENDING') || p.badges?.includes('BESTSELLER'))
    .slice(0, 6);

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-600 mb-1">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Community Favorites</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Trending Now
          </h2>
        </div>

        <button
          onClick={onViewAllTrending}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors"
        >
          <span>View All Trending</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trendingProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
            isWishlisted={wishlistIds.has(prod.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
};
