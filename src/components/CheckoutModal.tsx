import React, { useState } from 'react';
import { CartItem } from '../types';
import { analytics } from '../services/analytics';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle,
  Copy,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [formData, setFormData] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '9876543210',
    street: '42 Silicon Avenue, Tech Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('alex@okhdfcbank');
  const [transactionDetails, setTransactionDetails] = useState<{
    id: string;
    value: number;
    date: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 1999 ? 0 : 99;
  const totalAmount = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCompletePurchase = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const txnId = `GMS-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // PRD Specified GA4 Event: purchase (transaction_id, value)
      analytics.trackPurchase(txnId, totalAmount);

      setTransactionDetails({
        id: txnId,
        value: totalAmount,
        date: new Date().toLocaleString(),
      });
      setIsSubmitting(false);
      setStep('confirmed');
      onOrderSuccess();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="font-display font-extrabold text-lg uppercase tracking-tight">
              {step === 'confirmed' ? 'Order Confirmed' : 'Google Merch Checkout'}
            </h2>
          </div>
          {step !== 'confirmed' && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Checkout Steps Progress */}
        {step !== 'confirmed' && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
            <div
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-2 ${
                step === 'details'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-mono">1</span>
              <span>Shipping Details</span>
            </div>
            <div
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-2 ${
                step === 'payment'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-mono">2</span>
              <span>Payment & Review</span>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: Shipping Details */}
          {step === 'details' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('payment');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Email Address (for order receipts & GA4 attribution)
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Street Address & Landmark
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment & Order Review */}
          {step === 'payment' && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                  Select Payment Method
                </h4>
                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-semibold'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center">
                        {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <div>
                        <span className="text-xs">UPI / Google Pay (Fastest)</span>
                        <span className="block text-[10px] text-slate-500 font-normal">
                          Instant confirmation via GPay, PhonePe, Paytm
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      RECOMMENDED
                    </span>
                  </label>

                  {paymentMethod === 'upi' && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs ml-7">
                      <label className="block text-[11px] text-slate-600 font-medium mb-1">
                        Enter UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-semibold'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center">
                        {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-600" />
                        <span className="text-xs">Credit / Debit Card</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Visa / Mastercard / RuPay</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-semibold'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center">
                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-600" />
                        <span className="text-xs">Cash on Delivery (COD)</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500">Pay at your doorstep</span>
                  </label>
                </div>
              </div>

              {/* Order Summary Itemized */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Order Summary ({items.length} items)
                </h4>
                {items.map((i) => (
                  <div key={`${i.product.id}-${i.size}`} className="flex justify-between text-slate-600">
                    <span className="truncate max-w-[280px]">
                      {i.product.name} ({i.size}) × {i.quantity}
                    </span>
                    <span className="font-mono tabular-nums text-slate-900">
                      ₹{(i.product.price * i.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="font-mono tabular-nums text-emerald-600 font-bold">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Payable</span>
                  <span className="font-mono tabular-nums">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Shipping</span>
                </button>

                <button
                  onClick={handleCompletePurchase}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString('en-IN')}`}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Confirmed & Receipt View */}
          {step === 'confirmed' && transactionDetails && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono font-semibold uppercase text-emerald-600 tracking-wider">
                  Payment Successful • GA4 Purchase Dispatched
                </span>
                <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-1">
                  Thank you for your order, {formData.name}!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Your Google Merch Drop order has been booked. A tracking receipt was sent to{' '}
                  <span className="font-semibold text-slate-700">{formData.email}</span>.
                </p>
              </div>

              {/* Transaction Receipt Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs font-mono max-w-md mx-auto space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Transaction ID</span>
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <span>{transactionDetails.id}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(transactionDetails.id);
                        setCopiedTxn(true);
                        setTimeout(() => setCopiedTxn(false), 2000);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-800"
                      title="Copy transaction ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {copiedTxn && (
                  <p className="text-[10px] text-emerald-600 text-right">Copied to clipboard!</p>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-bold text-slate-900">
                    ₹{transactionDetails.value.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Address</span>
                  <span className="text-right text-slate-700 truncate max-w-[200px]">
                    {formData.street}, {formData.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Delivery</span>
                  <span className="text-slate-700 font-semibold">2–3 Business Days</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
