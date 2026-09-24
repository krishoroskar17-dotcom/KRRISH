import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, NavigationTab } from './types';
import { PRODUCTS } from './data/products';
import { analytics } from './services/analytics';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ShopByCategory } from './components/ShopByCategory';
import { TrendingNow } from './components/TrendingNow';
import { NewArrivals } from './components/NewArrivals';
import { CollectionsSection } from './components/CollectionsSection';
import { ProductListingPage } from './components/ProductListingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AccountModal } from './components/AccountModal';
import { GA4Debugger } from './components/GA4Debugger';
import { Footer } from './components/Footer';
import { Activity } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>(undefined);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string | undefined>(undefined);

  // Cart & Wishlist state with localStorage initialization
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gms_cart_items');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    // Default initial mock items matching PRD Section 9:
    // "Google T-Shirt × 1 ₹999, Google Mug × 1 ₹599"
    return [
      { product: PRODUCTS[0], size: 'L', quantity: 1 },
      { product: PRODUCTS[3], size: 'M', quantity: 1 },
    ];
  });

  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gms_wishlist_ids');
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch {
          // fallback
        }
      }
    }
    return new Set(['chrome-hoodie-02']);
  });

  // UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isGA4Open, setIsGA4Open] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const [orderCount, setOrderCount] = useState(1);

  // Persist cart & wishlist
  useEffect(() => {
    localStorage.setItem('gms_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('gms_wishlist_ids', JSON.stringify(Array.from(wishlistIds)));
  }, [wishlistIds]);

  // Subscribe to GA4 analytics events count
  useEffect(() => {
    const unsub = analytics.subscribe((events) => {
      setEventCount(events.length);
    });
    return unsub;
  }, []);

  // GA4 Track page_view when tab or product changes
  useEffect(() => {
    let pagePath = '/';
    if (selectedProduct) {
      pagePath = `/product/${selectedProduct.id}`;
    } else if (currentTab !== 'home') {
      pagePath = `/${currentTab}`;
      if (selectedCategoryFilter) {
        pagePath += `?category=${selectedCategoryFilter}`;
      } else if (selectedCollectionFilter) {
        pagePath += `?collection=${selectedCollectionFilter}`;
      }
    }
    // PRD Specified GA4 Event: page_view (page_path)
    analytics.trackPageView(pagePath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab, selectedProduct, selectedCategoryFilter, selectedCollectionFilter]);

  // Navigation handlers
  const handleNavigate = (tab: NavigationTab) => {
    setSelectedProduct(null);
    setSelectedCategoryFilter(undefined);
    setSelectedCollectionFilter(undefined);
    setCurrentTab(tab);
  };

  const handleSelectCategoryFromHome = (catId: string) => {
    setSelectedProduct(null);
    setSelectedCollectionFilter(undefined);
    setSelectedCategoryFilter(catId);
    setCurrentTab('catalog');
  };

  const handleSelectCollectionFromHome = (colId: string) => {
    setSelectedProduct(null);
    setSelectedCategoryFilter(undefined);
    setSelectedCollectionFilter(colId);
    setCurrentTab('catalog');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    // Open cart drawer to give immediate feedback as per PRD
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => {
    handleAddToCart(product, size);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, size: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  };

  const wishlistProducts = useMemo(() => {
    return PRODUCTS.filter((p) => wishlistIds.has(p.id));
  }, [wishlistIds]);

  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  // Filtered products according to active tab
  const tabProducts = useMemo(() => {
    if (currentTab === 'men') {
      return PRODUCTS.filter((p) => p.gender === 'men' || p.gender === 'unisex');
    }
    if (currentTab === 'women') {
      return PRODUCTS.filter((p) => p.gender === 'women' || p.gender === 'unisex');
    }
    if (currentTab === 'accessories') {
      return PRODUCTS.filter((p) => p.category === 'accessories' || p.category === 'drinkware');
    }
    if (currentTab === 'new-arrivals') {
      return PRODUCTS.filter((p) => p.isNewArrival);
    }
    if (currentTab === 'sale') {
      return PRODUCTS.filter((p) => p.discountPercentage >= 25);
    }
    return PRODUCTS;
  }, [currentTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900">
      {/* Primary Top Bar */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onToggleGA4={() => setIsGA4Open(!isGA4Open)}
        isGA4Open={isGA4Open}
        eventCount={eventCount}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isWishlisted={wishlistIds.has(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : currentTab === 'home' ? (
          <div>
            {/* Section 1: Promotional Hero Banner */}
            <HeroBanner onShopNow={() => handleNavigate('catalog')} />

            {/* Section 2: Shop By Category */}
            <ShopByCategory onSelectCategory={handleSelectCategoryFromHome} />

            {/* Section 3: Trending Now */}
            <TrendingNow
              products={PRODUCTS}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onViewAllTrending={() => handleNavigate('catalog')}
            />

            {/* Section 5: New Arrivals (NEW DROPS 🔥) */}
            <NewArrivals
              products={PRODUCTS}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onViewAllNew={() => handleNavigate('new-arrivals')}
            />

            {/* Section 6: Collections */}
            <CollectionsSection onSelectCollection={handleSelectCollectionFromHome} />
          </div>
        ) : (
          /* Catalog / PLP View for Navigation tabs */
          <ProductListingPage
            products={tabProducts}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            initialCategory={selectedCategoryFilter}
            initialCollection={selectedCollectionFilter}
            pageTitle={
              currentTab === 'men'
                ? "Men's Streetwear Collection"
                : currentTab === 'women'
                ? "Women's Streetwear Collection"
                : currentTab === 'accessories'
                ? 'Tech Accessories & Gear'
                : currentTab === 'collections'
                ? 'All Curated Google Collections'
                : currentTab === 'new-arrivals'
                ? 'New Drops 🔥 (Latest Releases)'
                : currentTab === 'sale'
                ? 'Official Clearance & Offers'
                : 'All Streetwear Merchandise'
            }
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onViewCatalog={() => {
          setIsCartOpen(false);
          handleNavigate('catalog');
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={() => {
          setCartItems([]);
          setOrderCount((prev) => prev + 1);
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={handleSelectProduct}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orderCount={orderCount}
      />

      {/* GA4 Live Event Inspector */}
      <GA4Debugger isOpen={isGA4Open} onClose={() => setIsGA4Open(false)} />

      {/* Floating GA4 quick trigger button */}
      {!isGA4Open && (
        <button
          onClick={() => setIsGA4Open(true)}
          className="fixed bottom-5 right-5 z-40 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-full shadow-2xl border border-slate-700 text-xs font-mono flex items-center gap-2 transition-transform hover:scale-105"
          title="Open GA4 Event Inspector"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>GA4 Live Stream ({eventCount})</span>
        </button>
      )}

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenGA4={() => setIsGA4Open(true)}
      />
    </div>
  );
}
