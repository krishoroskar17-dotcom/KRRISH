import React from 'react';
import { NavigationTab } from '../types';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenGA4: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenGA4 }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 ml-1">
                Google Merchandise Store
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Streetwear & pop-culture inspired redesign for Google fans, engineers, and internet creators. Designed with GA4-driven commerce instrumentation.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenGA4}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-medium rounded-lg transition-colors"
              >
                <span>📊 Open GA4 Live Event Inspector</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Shop Drops
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li>
                <button onClick={() => onNavigate('men')} className="hover:text-slate-900 transition-colors">
                  Men&apos;s Streetwear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('women')} className="hover:text-slate-900 transition-colors">
                  Women&apos;s Streetwear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('accessories')} className="hover:text-slate-900 transition-colors">
                  Tech Accessories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('new-arrivals')} className="hover:text-slate-900 transition-colors">
                  New Drops 🔥
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sale')} className="hover:text-rose-600 transition-colors">
                  Clearance Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Collections */}
          <div>
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-slate-900 transition-colors">
                  Google Originals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-slate-900 transition-colors">
                  Tech Culture
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-slate-900 transition-colors">
                  Pixel Hardware
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-slate-900 transition-colors">
                  Android World
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-slate-900 transition-colors">
                  Work &amp; Play Everyday
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Policies */}
          <div>
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>Free Shipping above ₹1,999</li>
              <li>7-Day Hassle-Free Returns</li>
              <li>100% Genuine Certified Goods</li>
              <li>Secure 256-bit UPI &amp; Cards</li>
              <li>support@googlemerchstore.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Google Merchandise Store Redesign. Built for Product &amp; Growth Evaluation.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>GA4 Measurement Ready</span>
            <span>·</span>
            <span>Privacy &amp; Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
