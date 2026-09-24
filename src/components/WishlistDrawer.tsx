import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveWishlist,
  onSelectProduct,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h2 className="font-display font-extrabold text-lg text-slate-900 tracking-tight uppercase">
                Your Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wishlistProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-base">Your wishlist is empty</p>
                  <p className="text-xs text-slate-500 mt-1">Tap the heart icon on any product to save it here.</p>
                </div>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                          className="font-semibold text-xs text-slate-900 line-clamp-1 cursor-pointer hover:text-blue-600"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveWishlist(product)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-900 block mt-1">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onAddToCart(product, product.sizes[0] || 'M');
                        }}
                        className="w-full py-1.5 bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
