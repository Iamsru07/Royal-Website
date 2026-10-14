import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Utensils, Receipt, Bell, Sparkles } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderTracker } from '../../components/customer/OrderTracker';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, showToast } = useRestaurant();
  const navigate = useNavigate();

  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return (
      <div className="py-12">
        <EmptyState
          icon={Receipt}
          title="Order Not Found"
          description={`We could not locate an order matching ID #${id}.`}
          actionText="View All Orders"
          onAction={() => navigate('/my-orders')}
        />
      </div>
    );
  }

  const handleCallWaiter = () => {
    showToast(`Staff notified for Table ${order.tableNumber}`, 'success');
  };

  const handleRequestWater = () => {
    showToast(`Water refill requested for Table ${order.tableNumber}`, 'info');
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-orders"
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Main Order Tracker Card */}
      <OrderTracker order={order} />

      {/* Order Details & Bill Breakdown */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900 font-serif-brand">
              Order #{order.id} Summary
            </h2>
            <p className="text-xs text-neutral-500">
              Placed on {order.createdAt} · Table {order.tableNumber}
            </p>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md">
            Payment: {order.paymentMethod} ({order.paymentStatus})
          </span>
        </div>

        {/* Item Rows */}
        <div className="divide-y divide-neutral-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-neutral-100 text-neutral-700 font-mono font-bold flex items-center justify-center text-[10px]">
                  {item.quantity}x
                </span>
                <span className="font-semibold text-neutral-900 font-serif-brand">
                  {item.foodName}
                </span>
              </div>
              <span className="font-mono text-neutral-800 font-semibold tabular-nums">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {order.specialNotes && (
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs">
            <span className="font-semibold text-neutral-700 block mb-0.5">
              Special Kitchen Notes:
            </span>
            <p className="text-neutral-500 italic">{order.specialNotes}</p>
          </div>
        )}

        {/* Financials */}
        <div className="space-y-1.5 pt-3 border-t border-neutral-100 text-xs font-mono text-neutral-600">
          <div className="flex justify-between">
            <span className="font-sans text-neutral-500">Subtotal</span>
            <span className="tabular-nums">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-sans text-neutral-500">Taxes</span>
            <span className="tabular-nums">₹{order.taxes}</span>
          </div>
          <div className="pt-2 border-t border-neutral-200/80 flex justify-between text-sm font-bold text-neutral-900">
            <span className="font-sans">Grand Total</span>
            <span className="tabular-nums">₹{order.total}</span>
          </div>
        </div>

        {/* Dining Assistance Service Buttons */}
        <div className="pt-4 border-t border-neutral-100 flex flex-wrap gap-2.5">
          <button
            onClick={handleCallWaiter}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-neutral-500" />
            <span>Call Service Staff</span>
          </button>
          <button
            onClick={handleRequestWater}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <Utensils className="w-3.5 h-3.5 text-neutral-500" />
            <span>Request Water / Cutlery</span>
          </button>
        </div>
      </div>
    </div>
  );
};
