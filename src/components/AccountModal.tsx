import React from 'react';
import { X, User, Package, MapPin, ShieldCheck, Mail, Phone } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCount: number;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, orderCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold font-mono">
              AR
            </div>
            <div>
              <h3 className="font-display font-bold text-base leading-tight">Alex Rivera</h3>
              <p className="text-xs text-slate-400 font-mono">Google Developer Community Member</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">ORDERS PLACED</span>
              <span className="font-display font-bold text-2xl text-slate-900">{orderCount}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">MERCH REWARDS</span>
              <span className="font-display font-bold text-2xl text-blue-600">850 pts</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-900">Profile Details</h4>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>alex.rivera@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Bengaluru, Karnataka (560103)</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Official Google Merchandise Account</span>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Connected to Google Merchandise Store Streetwear Redesign (Autumn/Winter 2026 Collection).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
