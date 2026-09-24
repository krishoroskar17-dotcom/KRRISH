import React from 'react';
import { NavigationTab } from '../types';
import { Search, Heart, ShoppingBag, User, Activity } from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onToggleGA4: () => void;
  isGA4Open: boolean;
  eventCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount,
  onToggleGA4,
  isGA4Open,
  eventCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top promotional utility strip */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium">
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>FREE SHIPPING ON ORDERS OVER ₹1,999 • STREETWEAR DROP &apos;26</span>
        </div>
        <div className="sm:hidden text-[11px] truncate">
          FREE SHIPPING OVER ₹1,999 • DROP &apos;26
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleGA4}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              isGA4Open
                ? 'bg-emerald-400 text-slate-950 font-semibold'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
            }`}
          >
            <Activity className="w-3 h-3 animate-pulse" />
            <span>GA4 Debugger ({eventCount})</span>
          </button>
        </div>
      </div>

      {/* Main 3-Zone Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single element brand mark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group flex items-center gap-2 text-slate-900 focus:outline-none"
        >
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
          </div>
          <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            Google Merch
          </span>
        </button>

        {/* Zone 2: Navigation Links (MEN | WOMEN | ACCESSORIES | COLLECTIONS | NEW ARRIVALS | SALE) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('men')}
            className={`transition-colors hover:text-slate-950 ${
              currentTab === 'men' ? 'text-slate-950 underline underline-offset-8 decoration-2 decoration-blue-600 font-bold' : ''
            }`}
          >
            Men
          </button>
          <button
            onClick={() => onNavigate('women')}
            className={`transition-colors hover:text-slate-950 ${
              currentTab === 'women' ? 'text-slate-950 underline underline-offset-8 decoration-2 decoration-blue-600 font-bold' : ''
            }`}
          >
            Women
          </button>
          <button
            onClick={() => onNavigate('accessories')}
            className={`transition-colors hover:text-slate-950 ${
              currentTab === 'accessories' ? 'text-slate-950 underline underline-offset-8 decoration-2 decoration-blue-600 font-bold' : ''
            }`}
          >
            Accessories
          </button>
          <button
            onClick={() => onNavigate('collections')}
            className={`transition-colors hover:text-slate-950 ${
              currentTab === 'collections' ? 'text-slate-950 underline underline-offset-8 decoration-2 decoration-blue-600 font-bold' : ''
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => onNavigate('new-arrivals')}
            className={`transition-colors hover:text-slate-950 flex items-center gap-1 ${
              currentTab === 'new-arrivals' ? 'text-slate-950 underline underline-offset-8 decoration-2 decoration-blue-600 font-bold' : ''
            }`}
          >
            <span>New Arrivals</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
          </button>
          <button
            onClick={() => onNavigate('sale')}
            className={`transition-colors hover:text-red-600 ${
              currentTab === 'sale' ? 'text-red-600 underline underline-offset-8 decoration-2 decoration-red-600 font-bold' : 'text-red-600'
            }`}
          >
            Sale
          </button>
        </nav>

        {/* Zone 3: Actions (Search, Account, Wishlist, Cart) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
            title="Search merchandise"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenAccount}
            className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex"
            title="Account & Orders"
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenWishlist}
            className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors relative"
            title="Cart"
            aria-label="Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">CART</span>
            {cartCount > 0 && (
              <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-4 overflow-x-auto text-xs uppercase font-semibold text-slate-600 no-scrollbar">
        <button
          onClick={() => onNavigate('home')}
          className={`shrink-0 ${currentTab === 'home' ? 'text-slate-950 font-bold border-b border-slate-950 pb-0.5' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => onNavigate('men')}
          className={`shrink-0 ${currentTab === 'men' ? 'text-slate-950 font-bold border-b border-slate-950 pb-0.5' : ''}`}
        >
          Men
        </button>
        <button
          onClick={() => onNavigate('women')}
          className={`shrink-0 ${currentTab === 'women' ? 'text-slate-950 font-bold border-b border-slate-950 pb-0.5' : ''}`}
        >
          Women
        </button>
        <button
          onClick={() => onNavigate('accessories')}
          className={`shrink-0 ${currentTab === 'accessories' ? 'text-slate-950 font-bold border-b border-slate-950 pb-0.5' : ''}`}
        >
          Accessories
        </button>
        <button
          onClick={() => onNavigate('collections')}
          className={`shrink-0 ${currentTab === 'collections' ? 'text-slate-950 font-bold border-b border-slate-950 pb-0.5' : ''}`}
        >
          Collections
        </button>
        <button
          onClick={() => onNavigate('new-arrivals')}
          className={`shrink-0 text-blue-600 ${currentTab === 'new-arrivals' ? 'font-bold border-b border-blue-600 pb-0.5' : ''}`}
        >
          New Drops
        </button>
        <button
          onClick={() => onNavigate('sale')}
          className={`shrink-0 text-red-600 ${currentTab === 'sale' ? 'font-bold border-b border-red-600 pb-0.5' : ''}`}
        >
          Sale
        </button>
      </div>
    </header>
  );
};
