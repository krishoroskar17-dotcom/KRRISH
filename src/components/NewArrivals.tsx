import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface NewArrivalsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onViewAllNew: () => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  onViewAllNew,
}) => {
  const newArrivals = products
    .filter((p) => p.isNewArrival || p.badges?.includes('NEW') || p.badges?.includes('LIMITED DROP'))
    .slice(0, 4);

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-rose-600 mb-1">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Just Landed in the Store</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <span>NEW DROPS</span>
            <span role="img" aria-label="fire">🔥</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Fresh designs. Fresh Google vibes.
          </p>
        </div>

        <button
          onClick={onViewAllNew}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-blue-600 transition-colors"
        >
          <span>Explore All New Drops</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newArrivals.map((prod) => (
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
