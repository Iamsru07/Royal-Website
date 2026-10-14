import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Utensils } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CartItemRow } from '../../components/customer/CartItemRow';
import { EmptyState } from '../../components/common/EmptyState';

export const CartPage: React.FC = () => {
  const {
    cart,
    clearCart,
    cartSubtotal,
    cartTaxes,
    cartTotal,
    selectedTable,
    settings,
  } = useRestaurant();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="You haven't added any dishes to your table order yet. Explore our menu to start ordering."
          actionText="Explore Delicious Menu"
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Top breadcrumb & back */}
      <div className="flex items-center justify-between">
        <Link
          to="/menu"
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-2">
            <div>
              <h1 className="text-xl font-bold text-neutral-900 font-serif-brand">
                Table Order Review
              </h1>
              <p className="text-xs text-neutral-500">
                Seated at Table <span className="font-bold text-neutral-800">{selectedTable}</span>
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
              {cart.reduce((acc, i) => acc + i.quantity, 0)} Items
            </span>
          </div>

          <div className="divide-y divide-neutral-100">
            {cart.map((item) => (
              <CartItemRow key={item.food.id} item={item} />
            ))}
          </div>

          <div className="pt-4 mt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>+ Add more items to this order</span>
            </Link>
          </div>
        </div>

        {/* Order Summary & Checkout Box */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-xs h-fit space-y-5">
          <h2 className="text-base font-bold text-neutral-900 font-serif-brand pb-3 border-b border-neutral-100">
            Order Bill Details
          </h2>

          <div className="space-y-2.5 text-xs text-neutral-600 font-mono">
            <div className="flex justify-between">
              <span className="font-sans text-neutral-500">Item Total (Subtotal)</span>
              <span className="font-semibold text-neutral-900 tabular-nums">
                ₹{cartSubtotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-neutral-500">
                GST & Service Taxes ({settings.taxRatePercent}%)
              </span>
              <span className="text-neutral-700 tabular-nums">₹{cartTaxes}</span>
            </div>
            <div className="pt-3 border-t border-neutral-200 flex justify-between text-base">
              <span className="font-bold text-neutral-900 font-sans">Total Payable</span>
              <span className="font-bold text-neutral-900 tabular-nums">₹{cartTotal}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 space-y-1">
            <p className="font-semibold">Table {selectedTable} Direct Kitchen Order</p>
            <p className="text-[11px] text-amber-700 font-light">
              Orders placed will immediately notify our kitchen chef for fresh preparation.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-md transition-all group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <Link
              to="/menu"
              className="w-full block text-center py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Continue Ordering
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
