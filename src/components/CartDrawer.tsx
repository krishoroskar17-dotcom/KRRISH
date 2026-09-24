import React, { useEffect } from 'react';
import { CartItem } from '../types';
import { analytics } from '../services/analytics';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Gift } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onProceedToCheckout: () => void;
  onViewCatalog: () => void;
}

const FREE_SHIPPING_THRESHOLD = 1999;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onViewCatalog,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingDifference = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (isOpen) {
      // PRD Specified GA4 Event: view_cart (value, items)
      analytics.trackViewCart(subtotal, items);
    }
  }, [isOpen, subtotal, items]);

  const handleCheckoutClick = () => {
    // PRD Specified GA4 Event: begin_checkout (value, items)
    analytics.trackBeginCheckout(subtotal, items);
    onProceedToCheckout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-900" />
              <h2 className="font-display font-extrabold text-lg text-slate-900 tracking-tight uppercase">
                Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar (PRD Section 9 requirement) */}
          <div className="bg-blue-50/70 border-b border-blue-100 p-3.5 px-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1.5">
              <Gift className="w-4 h-4 text-blue-600 shrink-0" />
              {freeShippingDifference === 0 ? (
                <span className="text-emerald-700">🎉 Congratulations! You have unlocked FREE shipping!</span>
              ) : (
                <span>🎁 Add ₹{freeShippingDifference.toLocaleString('en-IN')} more to unlock free shipping.</span>
              )}
            </div>
            <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  freeShippingDifference === 0 ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-base">Your cart is empty</p>
                  <p className="text-xs text-slate-500 mt-1">Discover fresh drops and add your favorites.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onViewCatalog();
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-xs text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.size)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                          Size: {item.size}
                        </span>
                        <span>₹{item.product.price.toLocaleString('en-IN')} each</span>
                      </div>
                    </div>

                    {/* Quantity and Line Total */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      {/* Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-slate-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-xs text-slate-900 font-mono tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Subtotal & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Delivery</span>
                  <span className="font-mono tabular-nums text-emerald-600 font-semibold">
                    {freeShippingDifference === 0 ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums">
                    ₹{(subtotal + (freeShippingDifference === 0 ? 0 : 99)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onViewCatalog();
                  }}
                  className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  View Catalog
                </button>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 font-mono">
                Encrypted 256-Bit Checkout • Real-time GA4 Tracking
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
