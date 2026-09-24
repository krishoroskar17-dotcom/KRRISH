import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { analytics } from '../services/analytics';
import { Search, X, ArrowRight, Flame } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const POPULAR_SEARCHES = ['Pixel', 'Chrome Hoodie', 'Android', 'Dino', 'Mug', 'Backpack'];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query.trim().length >= 2) {
      const timer = setTimeout(() => {
        // PRD Specified GA4 Event: search (search_term)
        analytics.trackSearch(query.trim());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const filtered = query.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.collection.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Pixel tees, Chrome hoodies, collectibles..."
            className="flex-1 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 text-xs font-mono"
            >
              CLEAR
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular searches suggestions */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px] shrink-0">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>POPULAR:</span>
          </div>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium shrink-0 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="max-h-[380px] overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type to search across all Google merchandise drops and accessories.
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No merchandise matching &quot;{query}&quot;. Try searching for &quot;Pixel&quot; or &quot;Hoodie&quot;.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    analytics.trackSelectItem(item.id, item.name);
                    onSelectProduct(item);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all group"
                >
                  <div className="w-12 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      {item.category}
                    </span>
                    <h4 className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-xs font-bold font-mono text-slate-800">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
