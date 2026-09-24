import React from 'react';
import { COLLECTIONS } from '../data/products';
import { analytics } from '../services/analytics';
import { Layers, ArrowRight } from 'lucide-react';

interface CollectionsSectionProps {
  onSelectCollection: (collectionId: string) => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ onSelectCollection }) => {
  const handleCollectionClick = (col: (typeof COLLECTIONS)[0]) => {
    analytics.trackSelectCategory(`Collection: ${col.title}`);
    analytics.trackSelectPromotion(`Collection Banner: ${col.title}`);
    onSelectCollection(col.id);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-indigo-600 mb-1">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Themed Drops</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Curated Collections
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore thematic tech narratives built for the community.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS.map((col, idx) => (
          <div
            key={col.id}
            onClick={() => handleCollectionClick(col)}
            className={`group relative rounded-xl border border-slate-200 bg-white overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ${
              idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
          >
            {/* Background image & gradient */}
            <div className={`relative ${idx === 0 ? 'h-64 sm:h-72' : 'h-60'} bg-slate-900 overflow-hidden`}>
              <img
                src={col.image}
                alt={col.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-mono font-bold tracking-widest bg-white/20 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded">
                  {col.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight leading-snug">
                  {col.title}
                </h3>
                <p className="text-sm text-slate-300 font-medium mt-1">
                  {col.subtitle}
                </p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="p-4 bg-white flex items-center justify-between">
              <p className="text-xs text-slate-500 line-clamp-1 pr-4">
                {col.description}
              </p>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center text-slate-700 transition-colors shrink-0">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
