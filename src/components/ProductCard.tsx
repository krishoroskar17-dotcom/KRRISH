import React, { useState } from 'react';
import { Product } from '../types';
import { analytics } from '../services/analytics';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>(product.sizes[0] || 'M');
  const [showQuickSize, setShowQuickSize] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleCardClick = () => {
    analytics.trackSelectItem(product.id, product.name);
    onSelectProduct(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isWishlisted) {
      analytics.trackAddToWishlist(product.id, product.price);
    }
    onToggleWishlist(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length > 1 && !showQuickSize) {
      setShowQuickSize(true);
      return;
    }
    confirmAddToCart(selectedSize);
  };

  const confirmAddToCart = (size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => {
    analytics.trackAddToCart(product.id, product.price, 'INR');
    onAddToCart(product, size);
    setShowQuickSize(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] bg-[#f5f5f4] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badges?.slice(0, 1).map((b) => (
            <span
              key={b}
              className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase font-mono shadow-xs ${
                b === 'TRENDING'
                  ? 'bg-amber-400 text-slate-950'
                  : b === 'BESTSELLER'
                  ? 'bg-blue-600 text-white'
                  : b === 'NEW'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-white'
              }`}
            >
              {b}
            </span>
          ))}
          {product.discountPercentage > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white font-mono shadow-xs">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 backdrop-blur-xs text-slate-700 hover:text-rose-600 hover:scale-110'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick Size Picker Drawer on hover/tap */}
        {showQuickSize && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 z-20 animate-in fade-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-2">
              <span>SELECT SIZE:</span>
              <button
                onClick={() => setShowQuickSize(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-1.5 text-xs font-mono font-bold rounded border transition-all ${
                    selectedSize === s
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => confirmAddToCart(selectedSize)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Confirm & Add ({selectedSize})</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Info Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
            <span className="uppercase tracking-wider font-mono text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="tabular-nums text-slate-700">{product.rating}</span>
              <span className="text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Subtitle / Spec */}
          {product.subtitle && (
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base text-slate-900 font-mono tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={justAdded}
            className={`px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-blue-600 text-white shadow-xs'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ADD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
