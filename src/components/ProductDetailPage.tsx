import React, { useState } from 'react';
import { Product } from '../types';
import { analytics } from '../services/analytics';
import {
  Heart,
  ShoppingBag,
  Zap,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  onBuyNow: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>(
    product.sizes[0] || 'M'
  );
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = () => {
    analytics.trackAddToCart(product.id, product.price, 'INR');
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    analytics.trackAddToCart(product.id, product.price, 'INR');
    onBuyNow(product, selectedSize);
  };

  const handleWishlist = () => {
    if (!isWishlisted) {
      analytics.trackAddToWishlist(product.id, product.price);
    }
    onToggleWishlist(product);
  };

  const checkDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setDeliveryResult(`Standard delivery to ${pincode} by ${new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (2-3 Business Days). Free shipping applied.`);
    } else {
      setDeliveryResult('Please enter a valid 6-digit PIN code.');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back button breadcrumb */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 group transition-colors"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>BACK TO CATALOG</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-20 h-24 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImageIndex === idx
                    ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-400 opacity-80'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>

          {/* Main Showcase Image */}
          <div className="flex-1 relative aspect-[4/5] bg-[#f5f5f4] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.badges?.slice(0, 1).map((badge) => (
              <span
                key={badge}
                className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-mono font-bold px-3 py-1 rounded tracking-wider uppercase shadow-md"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category & Title */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">
              <span>{product.category}</span>
              <span className="text-slate-400">SKU: {product.sku}</span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {product.subtitle && (
              <p className="text-sm text-slate-500 mt-1">{product.subtitle}</p>
            )}

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-3 text-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-medium underline cursor-pointer">
                {product.reviewCount} customer reviews
              </span>
            </div>
          </div>

          {/* Pricing Module */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-baseline gap-3">
              <span className="font-display font-bold text-3xl text-slate-900 tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-slate-400 line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="bg-rose-600 text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Inclusive of all taxes. Free shipping on orders above ₹1,999.
            </p>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                SELECT SIZE
              </span>
              <button
                onClick={() => setShowSizeModal(true)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                    selectedSize === s
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs: Add to Cart, Buy Now, Wishlist */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>

            <button
              onClick={handleWishlist}
              className={`w-full py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isWishlisted
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-slate-300 hover:border-slate-400 text-slate-700 bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Pin Code Delivery Estimator */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              <Truck className="w-4 h-4 text-slate-600" />
              <span>Delivery Information</span>
            </div>

            <form onSubmit={checkDelivery} className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit PIN code"
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase rounded-lg transition-colors"
              >
                Check
              </button>
            </form>

            {deliveryResult && (
              <p className="text-xs text-emerald-700 font-medium mt-2 bg-emerald-50 p-2 rounded border border-emerald-200">
                {deliveryResult}
              </p>
            )}
          </div>

          {/* Product Details Specs */}
          <div className="pt-4 border-t border-slate-200 space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">
                Description
              </span>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-mono text-[10px] block">MATERIAL</span>
                <span className="font-semibold text-slate-800">{product.material}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-mono text-[10px] block">FIT</span>
                <span className="font-semibold text-slate-800">{product.fit}</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-slate-600">
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>7-Day Easy Returns</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>100% Genuine Merch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm uppercase">Standard Streetwear Sizing (Inches)</h3>
              </div>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                ✕
              </button>
            </div>

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Length</th>
                  <th className="py-2">Shoulder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr><td className="py-2 font-bold">S</td><td>38</td><td>27.5</td><td>18.5</td></tr>
                <tr><td className="py-2 font-bold">M</td><td>40</td><td>28.5</td><td>19.5</td></tr>
                <tr><td className="py-2 font-bold">L</td><td>42</td><td>29.5</td><td>20.5</td></tr>
                <tr><td className="py-2 font-bold">XL</td><td>44</td><td>30.5</td><td>21.5</td></tr>
                <tr><td className="py-2 font-bold">XXL</td><td>46</td><td>31.5</td><td>22.5</td></tr>
              </tbody>
            </table>

            <p className="text-[11px] text-slate-500">
              Note: Streetwear drop silhouettes feature a relaxed, dropped shoulder fit. Choose your standard size for an oversized aesthetic, or size down for a tailored fit.
            </p>

            <button
              onClick={() => setShowSizeModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase transition-colors"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
