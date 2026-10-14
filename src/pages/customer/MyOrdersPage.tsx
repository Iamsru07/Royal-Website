import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Receipt, ArrowRight, Clock, ChefHat, Filter } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { OrderStatus } from '../../types';

export const MyOrdersPage: React.FC = () => {
  const { orders } = useRestaurant();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  const filteredOrders = orders.filter((order) => {
    if (filter === 'Active') {
      return (
        order.status === 'Received' ||
        order.status === 'Confirmed' ||
        order.status === 'Preparing' ||
        order.status === 'Ready' ||
        order.status === 'Served'
      );
    }
    if (filter === 'Completed') {
      return order.status === 'Completed' || order.status === 'Cancelled';
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 font-serif-brand">
            My Table Orders
          </h1>
          <p className="text-xs text-neutral-500">
            Track live kitchen progress and review your dining order history
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'All'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter('Active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'Active'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('Completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'Completed'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Past Orders
          </button>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => {
            const isActive =
              order.status === 'Received' ||
              order.status === 'Confirmed' ||
              order.status === 'Preparing' ||
              order.status === 'Ready' ||
              order.status === 'Served';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-xs hover:border-neutral-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900 font-mono">
                          Order #{order.id}
                        </span>
                        <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                          Table {order.tableNumber}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">
                        {order.createdAt}
                      </span>
                    </div>

                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1.5 my-4 pt-2 border-t border-neutral-100">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-neutral-700"
                      >
                        <span className="truncate pr-2">
                          {item.foodName}{' '}
                          <span className="text-neutral-400 font-mono">× {item.quantity}</span>
                        </span>
                        <span className="font-mono text-neutral-500 tabular-nums">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Total</span>
                    <span className="text-sm font-bold text-neutral-900 font-mono tabular-nums">
                      ₹{order.total}
                    </span>
                  </div>

                  <Link
                    to={`/order/${order.id}`}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    <span>{isActive ? 'Track Live' : 'View Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Receipt}
          title="No orders found"
          description="You don't have any orders matching this filter."
          actionText="Order from Menu"
          onAction={() => navigate('/menu')}
        />
      )}
    </div>
  );
};
