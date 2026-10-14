import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CartItemRow } from './CartItemRow';
import { EmptyState } from '../common/EmptyState';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cartSubtotal,
    cartTaxes,
    cartTotal,
    selectedTable,
    clearCart,
  } = useRestaurant();

  const navigate = useNavigate();

  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-neutral-100 bg-[#FAFAFA]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 font-serif-brand">
                  Your Table Order
                </h3>
                <p className="text-[11px] text-amber-700 font-medium">
                  Ordering from Table {selectedTable}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-1.5 text-xs text-neutral-400 hover:text-red-600 transition-colors"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  icon={ShoppingBag}
                  title="Your cart is empty"
                  description="Explore our authentic menu and add your favorite dishes to begin your feast."
                  actionText="Browse Menu"
                  onAction={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/menu');
                  }}
                />
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {cart.map((item) => (
                  <CartItemRow key={item.food.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer with Calculations and Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-neutral-100 bg-[#FAFAFA] p-6 space-y-3.5">
              <div className="space-y-1.5 text-xs text-neutral-600 font-mono">
                <div className="flex justify-between">
                  <span className="font-sans text-neutral-500">Subtotal</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">
                    ₹{cartSubtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-neutral-500">
                    Restaurant GST & Service Taxes
                  </span>
                  <span className="text-neutral-700 tabular-nums">₹{cartTaxes}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200/80 flex justify-between text-sm">
                  <span className="font-bold text-neutral-900 font-sans">
                    Grand Total
                  </span>
                  <span className="font-bold text-neutral-900 text-base tabular-nums">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-md transition-all group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Continue Adding Dishes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
