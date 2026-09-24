import React, { useState, useMemo } from 'react';
import { Product, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { analytics } from '../services/analytics';
import { SlidersHorizontal, RotateCcw, ChevronDown, Check } from 'lucide-react';

interface ProductListingPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  initialCategory?: string;
  initialCollection?: string;
  pageTitle?: string;
}

const CATEGORY_OPTIONS = [
  { id: 't-shirts', label: 'T-Shirts' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'drinkware', label: 'Drinkware' },
  { id: 'collectibles', label: 'Collectibles' },
];

const SIZE_OPTIONS: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];

const PRICE_TIERS = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: '0-500', label: '₹0 – ₹500', min: 0, max: 500 },
  { id: '500-1000', label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { id: '1000-2000', label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { id: '2000+', label: '₹2,000+', min: 2000, max: Infinity },
];

export const ProductListingPage: React.FC<ProductListingPageProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  initialCategory,
  initialCollection,
  pageTitle = 'Streetwear & Tech Merchandise',
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) => {
      const exists = prev.includes(catId);
      const next = exists ? prev.filter((c) => c !== catId) : [...prev, catId];
      if (!exists) {
        analytics.trackSelectCategory(catId);
      }
      return next;
    });
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedPriceTier('all');
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
        return false;
      }
      // Collection filter if set
      if (initialCollection && p.collection !== initialCollection) {
        return false;
      }
      // Size filter
      if (selectedSizes.length > 0) {
        const hasSize = p.sizes.some((s) => selectedSizes.includes(s));
        if (!hasSize) return false;
      }
      // Price tier
      const tier = PRICE_TIERS.find((t) => t.id === selectedPriceTier);
      if (tier) {
        if (p.price < tier.min || p.price > tier.max) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      // popular by default
      return b.rating * b.reviewCount - a.rating * a.reviewCount;
    });
  }, [products, selectedCategories, initialCollection, selectedSizes, selectedPriceTier, sortBy]);

  const activeFilterCount =
    selectedCategories.length + selectedSizes.length + (selectedPriceTier !== 'all' ? 1 : 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> curated drops
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="hidden sm:inline">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Left Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Side Filters (Desktop & Mobile Accordion) */}
        <aside
          className={`lg:col-span-3 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3">
                Category
              </h4>
              <div className="space-y-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-950 cursor-pointer select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{cat.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Size Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3">
                Size
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {SIZE_OPTIONS.map((size) => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-1.5 text-xs font-mono font-bold rounded border transition-colors ${
                        isChecked
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3">
                Price
              </h4>
              <div className="space-y-2">
                {PRICE_TIERS.map((tier) => {
                  const isChecked = selectedPriceTier === tier.id;
                  return (
                    <label
                      key={tier.id}
                      onClick={() => setSelectedPriceTier(tier.id)}
                      className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-950 cursor-pointer select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        }`}
                      >
                        {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className="font-mono">{tier.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side Product Grid */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500 text-sm mb-4">
                No matching merchandise found for the selected filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlistIds.has(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
