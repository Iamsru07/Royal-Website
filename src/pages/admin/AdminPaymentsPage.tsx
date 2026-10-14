import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CreditCard, Banknote, Search, Download } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { PaymentBadge } from '../../components/common/StatusBadge';
import { PaymentMethod, PaymentStatus } from '../../types';

export const AdminPaymentsPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { payments, showToast } = useRestaurant();

  const [methodFilter, setMethodFilter] = useState<'All' | PaymentMethod>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | PaymentStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = payments.filter((p) => {
    if (methodFilter !== 'All' && p.method !== methodFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.orderId.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.transactionRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleExportCSV = () => {
    showToast('Payment ledger exported to CSV successfully', 'success');
  };

  return (
    <>
      <AdminHeader
        title="Payments & Billing Ledger"
        subtitle="Track guest transactions, online payment gateways, and cash settlements"
        onMenuToggle={toggleSidebar}
        actions={
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-xs">
            <span className="text-xs font-semibold text-neutral-500 block mb-1">
              Total Settled Payments
            </span>
            <span className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
              ₹{totalCollected.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-xs">
            <span className="text-xs font-semibold text-neutral-500 block mb-1">
              Online Payments (UPI/Cards)
            </span>
            <span className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
              {payments.filter((p) => p.method === 'Online').length} Orders
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-xs">
            <span className="text-xs font-semibold text-neutral-500 block mb-1">
              Cash at Counter Settlements
            </span>
            <span className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
              {payments.filter((p) => p.method === 'Cash').length} Orders
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as 'All' | PaymentMethod)}
              className="px-3 py-2 bg-white text-xs font-semibold rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
            >
              <option value="All">All Payment Modes</option>
              <option value="Online">Online Pay</option>
              <option value="Cash">Cash at Counter</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | PaymentStatus)}
              className="px-3 py-2 bg-white text-xs font-semibold rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by order, customer, txn ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-xs text-neutral-900 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 shadow-xs"
            />
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 bg-[#FAFAFA] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {filteredPayments.map((record) => (
                  <tr key={record.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                      #{record.orderId}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-neutral-900 whitespace-nowrap font-serif-brand">
                      {record.customerName}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                      ₹{record.amount.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium">
                        {record.method === 'Online' ? (
                          <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>{record.method}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PaymentBadge status={record.status} />
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                      {record.transactionRef}
                    </td>

                    <td className="py-3.5 px-4 text-right text-neutral-500 whitespace-nowrap">
                      {record.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
