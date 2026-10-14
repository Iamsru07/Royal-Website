import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Banknote,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { VegNonVegBadge } from '../../components/common/StatusBadge';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTaxes,
    cartTotal,
    selectedTable,
    createOrder,
    user,
    settings,
    showToast,
  } = useRestaurant();

  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user.name || 'Aarav Mehta');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online'>('Online');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect back to menu
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h2 className="text-xl font-bold font-serif-brand text-neutral-900 mb-2">
          Your order is empty
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/menu"
          className="inline-flex px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      showToast('Please provide your name and mobile number', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement delay for UX polish
    setTimeout(() => {
      const order = createOrder({
        customerName,
        customerPhone,
        paymentMethod,
        specialNotes,
      });

      setIsSubmitting(false);
      showToast('Order sent to kitchen! ✓', 'success');
      navigate('/order-success', { state: { orderId: order.id } });
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/menu"
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
          <span>Table {selectedTable} Dining</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 p-6 md:p-8 shadow-xs">
        <div className="mb-6 pb-4 border-b border-neutral-100">
          <h1 className="text-2xl font-bold text-neutral-900 font-serif-brand">
            Confirm & Place Order
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Orders are sent straight to the chef's kitchen display for instant preparation.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {/* Section 1: Customer Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 text-xs sm:text-sm text-neutral-900 rounded-xl border border-neutral-200 focus:border-amber-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Mobile Number (for live order SMS/updates)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 text-xs sm:text-sm text-neutral-900 rounded-xl border border-neutral-200 focus:border-amber-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Table details */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 block">
                Serving Table
              </span>
              <span className="text-base font-bold text-neutral-900 font-serif-brand">
                Table {selectedTable}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-neutral-500 block">Estimated Prep</span>
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>20–25 mins</span>
              </span>
            </div>
          </div>

          {/* Section 3: Kitchen Notes */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Special Kitchen Instructions (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Less spicy, no onions, extra cutlery, dressing on the side..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 text-xs text-neutral-900 rounded-xl border border-neutral-200 focus:border-amber-600 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Section 4: Order Summary items */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Selected Dishes ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h3>
            <div className="bg-neutral-50 rounded-2xl p-4 divide-y divide-neutral-200/60 border border-neutral-100">
              {cart.map((item) => (
                <div key={item.food.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <VegNonVegBadge type={item.food.foodType} size="sm" />
                    <span className="font-semibold text-neutral-900 font-serif-brand">
                      {item.food.name}
                    </span>
                    <span className="text-neutral-400 font-mono">× {item.quantity}</span>
                  </div>
                  <span className="font-mono font-semibold text-neutral-800 tabular-nums">
                    ₹{item.food.price * item.quantity}
                  </span>
                </div>
              ))}

              <div className="pt-3 mt-2 space-y-1 text-xs text-neutral-500 font-mono">
                <div className="flex justify-between">
                  <span className="font-sans">Subtotal</span>
                  <span className="tabular-nums">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans">Taxes & GST ({settings.taxRatePercent}%)</span>
                  <span className="tabular-nums">₹{cartTaxes}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200/80 flex justify-between text-sm text-neutral-900 font-bold">
                  <span className="font-sans">Grand Total</span>
                  <span className="tabular-nums">₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Payment Method */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Payment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Online Pay Option */}
              <div
                onClick={() => setPaymentMethod('Online')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === 'Online'
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 font-serif-brand">
                      Pay Online (UPI / Card)
                    </h4>
                    {paymentMethod === 'Online' && (
                      <CheckCircle2 className="w-4 h-4 text-amber-700" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Pay instantly via Google Pay, PhonePe, Paytm, or Credit/Debit Card.
                  </p>
                </div>
              </div>

              {/* Cash at Counter Option */}
              <div
                onClick={() => setPaymentMethod('Cash')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === 'Cash'
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-neutral-100 text-neutral-800 shrink-0 mt-0.5">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 font-serif-brand">
                      Cash at Counter
                    </h4>
                    {paymentMethod === 'Cash' && (
                      <CheckCircle2 className="w-4 h-4 text-amber-700" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Pay at the billing counter or with your server upon completion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Place Order CTA */}
          <div className="pt-4 border-t border-neutral-100 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-2xl text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Order to Kitchen...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Send Order to Kitchen (₹{cartTotal})</span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Table order securely linked to Table {selectedTable}</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
