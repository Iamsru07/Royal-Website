import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Printer,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { OrderStatusBadge, PaymentBadge } from '../../components/common/StatusBadge';
import { Order, OrderStatus } from '../../types';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';

const filterStatuses: (OrderStatus | 'All')[] = [
  'All',
  'Received',
  'Confirmed',
  'Preparing',
  'Ready',
  'Served',
  'Completed',
  'Cancelled',
];

export const AdminOrdersPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { orders, updateOrderStatus, showToast } = useRestaurant();

  const [activeTab, setActiveTab] = useState<OrderStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status transitions
  const advanceStatus = (order: Order) => {
    const sequence: OrderStatus[] = [
      'Received',
      'Confirmed',
      'Preparing',
      'Ready',
      'Served',
      'Completed',
    ];
    const currentIndex = sequence.indexOf(order.status);
    if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      updateOrderStatus(order.id, nextStatus);
    }
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'Cancelled');
  };

  const handlePrintTicket = (order: Order) => {
    showToast(`Printing Kitchen Ticket (KOT) for Order #${order.id}`, 'info');
    window.print();
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab !== 'All' && order.status !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.toLowerCase().includes(q);
      const matchTable = order.tableNumber.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchTable) return false;
    }
    return true;
  });

  return (
    <>
      <AdminHeader
        title="Kitchen & Table Orders"
        subtitle="Manage live orders, advance preparation stages, and dispatch food"
        onMenuToggle={toggleSidebar}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Status Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-neutral-100/80 rounded-2xl w-full sm:w-auto">
            {filterStatuses.map((tab) => {
              const count =
                tab === 'All'
                  ? orders.length
                  : orders.filter((o) => o.status === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === tab
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-mono ${
                      activeTab === tab
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-neutral-200/70 text-neutral-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by order #, table, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-xs text-neutral-900 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 shadow-xs"
            />
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 bg-[#FAFAFA] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Ordered Dishes</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4 text-right">Manage Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                        #{order.id}
                        <span className="block text-[10px] text-neutral-400 font-normal font-sans">
                          {order.createdAt}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-neutral-900 block font-serif-brand">
                          {order.customerName}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {order.customerPhone}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/60 font-mono font-bold rounded-md">
                          T-{order.tableNumber}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-[240px]">
                        <div className="space-y-0.5">
                          {order.items.map((i, idx) => (
                            <div key={idx} className="truncate text-[11px]">
                              <span className="font-medium text-neutral-800">{i.foodName}</span>{' '}
                              <span className="text-neutral-400 font-mono">× {i.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                        ₹{order.total}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-neutral-800">{order.paymentMethod}</span>
                          <PaymentBadge status={order.paymentStatus} />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="View details"
                            aria-label={`View order ${order.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handlePrintTicket(order)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="Print KOT Ticket"
                            aria-label={`Print ticket for ${order.id}`}
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                            <button
                              onClick={() => advanceStatus(order)}
                              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-[11px] transition-colors"
                            >
                              Next &rarr;
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Filter}
            title="No orders found"
            description={`There are currently no orders in status "${activeTab}".`}
            actionText="Show All Orders"
            onAction={() => setActiveTab('All')}
          />
        )}
      </div>

      {/* Order Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.id}`}
          subtitle={`Placed ${selectedOrder.createdAt} · Table ${selectedOrder.tableNumber}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
              <div>
                <span className="text-xs text-neutral-400 block">Diner</span>
                <span className="text-xs font-bold text-neutral-900">
                  {selectedOrder.customerName}
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  {selectedOrder.customerPhone}
                </span>
              </div>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>

            <div className="border border-neutral-100 rounded-xl p-3 bg-white space-y-2">
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Kitchen Items
              </h4>
              <div className="divide-y divide-neutral-100">
                {selectedOrder.items.map((i, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between text-xs">
                    <span>
                      {i.foodName} <span className="font-mono text-neutral-400">× {i.quantity}</span>
                    </span>
                    <span className="font-mono font-semibold tabular-nums">
                      ₹{i.price * i.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.specialNotes && (
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Chef Instructions:</span>
                <p>{selectedOrder.specialNotes}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
              <span className="text-xs font-bold text-neutral-700">Total Payable</span>
              <span className="text-base font-bold font-mono text-neutral-900">
                ₹{selectedOrder.total}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handlePrintTicket(selectedOrder)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ticket</span>
              </button>

              {selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Cancelled' && (
                <button
                  onClick={() => {
                    advanceStatus(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold"
                >
                  Advance to Next Stage
                </button>
              )}

              {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Completed' && (
                <button
                  onClick={() => {
                    cancelOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
