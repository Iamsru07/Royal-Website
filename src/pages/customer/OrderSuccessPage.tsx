import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Check, Clock, Utensils, Receipt, Sparkles, ChefHat } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, selectedTable } = useRestaurant();

  const stateOrderId = location.state?.orderId;
  const recentOrder = stateOrderId
    ? orders.find((o) => o.id === stateOrderId)
    : orders[0];

  const orderNumber = recentOrder ? recentOrder.id : 'RT-1024';
  const tableNumber = recentOrder ? recentOrder.tableNumber : selectedTable || '12';
  const prepTime = recentOrder ? recentOrder.estimatedPrepTime : 22;

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 px-4 text-center">
      {/* Success Icon Badge with pulse effect */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg ring-8 ring-emerald-50">
          <Check className="w-10 h-10 stroke-[2.5]" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 w-fit mx-auto mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Kitchen Ticket Generated</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif-brand mb-2">
        Order Placed Successfully!
      </h1>
      <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-8">
        Your order has been transmitted directly to our kitchen staff. Sit back and relax while our chefs freshly prepare your meal.
      </p>

      {/* Order Info Card */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xs text-left mb-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Order Number</span>
            <span className="text-base font-bold text-neutral-900 font-mono">
              #{orderNumber}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-neutral-400 block font-medium">Dining Table</span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-base font-bold text-neutral-900 font-serif-brand">
                Table {tableNumber}
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 font-mono">
                Occupied
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950 font-serif-brand">
              Estimated Preparation Time
            </h4>
            <p className="text-sm font-bold text-amber-800 font-mono mt-0.5">
              {prepTime}–{prepTime + 5} minutes
            </p>
          </div>
        </div>

        {recentOrder && recentOrder.items && (
          <div className="pt-2">
            <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Dishes in this order
            </h5>
            <div className="space-y-1.5 text-xs text-neutral-600">
              {recentOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span>
                    {item.foodName} <span className="text-neutral-400 font-mono">× {item.quantity}</span>
                  </span>
                  <span className="font-mono text-neutral-900 font-semibold tabular-nums">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-neutral-100 flex justify-between font-bold text-neutral-900">
                <span>Total Amount</span>
                <span className="font-mono text-sm tabular-nums">₹{recentOrder.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => navigate(`/order/${orderNumber}`)}
          className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <Receipt className="w-4 h-4 text-amber-400" />
          <span>Track Order Progress</span>
        </button>

        <Link
          to={`/menu?table=${tableNumber}`}
          className="w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Utensils className="w-4 h-4 text-neutral-500" />
          <span>Back to Menu</span>
        </Link>
      </div>
    </div>
  );
};
