import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  UserCheck,
  Phone,
  Mail,
  Award,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Trash2,
  Calendar,
  ShoppingBag,
  IndianRupee,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { Customer } from '../../types';

export const AdminCustomersPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { customers, addCustomer, updateCustomer, deleteCustomer, showToast } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'VIP' | 'Inactive'>('All');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [selectedUserDetails, setSelectedUserDetails] = useState<Customer | null>(null);

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserStatus, setNewUserStatus] = useState<'Active' | 'VIP' | 'Inactive'>('Active');

  const togglePasswordVisibility = (customerId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [customerId]: !prev[customerId],
    }));
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = newUserPhone.replace(/\D/g, '').slice(0, 10);
    if (cleanDigits.length !== 10) {
      showToast('Invalid mobile number: Exactly 10 digits required', 'error');
      return;
    }
    if (!newUserName.trim()) {
      showToast('Please enter the user full name', 'error');
      return;
    }
    if (!newUserPassword.trim()) {
      showToast('Please enter a password for this user', 'error');
      return;
    }

    // Check duplicate
    const exists = customers.find((c) => c.phone.replace(/\D/g, '').slice(-10) === cleanDigits);
    if (exists) {
      showToast(`User with mobile ${cleanDigits} already exists (${exists.name})`, 'error');
      return;
    }

    const formattedPhone = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;
    addCustomer({
      name: newUserName.trim(),
      phone: formattedPhone,
      password: newUserPassword.trim(),
      email: newUserEmail.trim() || `${newUserName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      totalOrders: 0,
      totalSpend: 0,
      lastOrderDate: 'Just added',
      status: newUserStatus,
      createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    });

    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserPhone('');
    setNewUserPassword('');
    setNewUserEmail('');
    setNewUserStatus('Active');
  };

  const filteredCustomers = customers.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const cleanDigits = searchQuery.replace(/\D/g, '');
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (cleanDigits && c.phone.replace(/\D/g, '').includes(cleanDigits)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  const totalRegisteredUsers = customers.length;
  const totalVIPUsers = customers.filter((c) => c.status === 'VIP').length;
  const totalActiveUsers = customers.filter((c) => c.status === 'Active').length;
  const totalUserSpend = customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);

  return (
    <>
      <AdminHeader
        title="User Details & Registered Accounts"
        subtitle="All registered diners, 10-digit mobile numbers, passwords, profile details & dining history saved in system"
        onMenuToggle={toggleSidebar}
        actions={
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border border-neutral-700"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Add New User</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Metric Cards Grid for User Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">Total Registered Users</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 font-serif-brand mt-2">
              {totalRegisteredUsers}
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              100% saved in Admin Database
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">Active Diners</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 font-serif-brand mt-2">
              {totalActiveUsers}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              Regular table diners
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">VIP Diners</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 font-serif-brand mt-2">
              {totalVIPUsers}
            </div>
            <span className="text-[11px] text-purple-600 font-medium mt-1 block">
              High-value repeat diners
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">Total User Spend</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 font-serif-brand mt-2">
              ₹{totalUserSpend.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Aggregated across all users
            </span>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search user details by name, 10-digit mobile, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 text-xs text-neutral-900 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['All', 'Active', 'VIP', 'Inactive'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {st === 'All' ? `All Users (${customers.length})` : st}
              </button>
            ))}
          </div>
        </div>

        {/* User Details Table */}
        {filteredCustomers.length > 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 bg-[#FAFAFA] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">User Profile</th>
                    <th className="py-3 px-4">10-Digit Mobile</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-center">Orders</th>
                    <th className="py-3 px-4 text-right">Total Spent</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filteredCustomers.map((cust) => {
                    const isPassVisible = visiblePasswords[cust.id];
                    const rawDigits = cust.phone.replace(/\D/g, '').slice(-10);

                    return (
                      <tr key={cust.id} className="hover:bg-neutral-50/80 transition-colors">
                        {/* User Profile */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                              {cust.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-neutral-900 font-serif-brand block">
                                {cust.name}
                              </span>
                              {cust.email && (
                                <span className="text-[11px] text-neutral-400">
                                  {cust.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 10-Digit Mobile Number */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="font-mono font-bold text-neutral-900">
                              {cust.phone}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono text-[10px]">
                              {rawDigits}
                            </span>
                          </div>
                        </td>

                        {/* Password with Eye Toggle */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-neutral-100 px-2 py-0.5 rounded text-[11px] font-semibold text-neutral-800">
                              {isPassVisible ? cust.password || 'password123' : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(cust.id)}
                              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors cursor-pointer"
                              title={isPassVisible ? 'Hide password' : 'Show password'}
                            >
                              {isPassVisible ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Registered Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-neutral-500 font-medium">
                          <div className="flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-neutral-400" />
                            <span>{cust.createdAt || cust.lastOrderDate}</span>
                          </div>
                        </td>

                        {/* Total Orders */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                          {cust.totalOrders}
                        </td>

                        {/* Total Spent */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                          ₹{cust.totalSpend.toLocaleString('en-IN')}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <select
                            value={cust.status}
                            onChange={(e) =>
                              updateCustomer(cust.id, {
                                status: e.target.value as 'Active' | 'VIP' | 'Inactive',
                              })
                            }
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                              cust.status === 'VIP'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : cust.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            }`}
                          >
                            <option value="Active">Active</option>
                            <option value="VIP">VIP</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedUserDetails(cust)}
                              className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                              title="View complete user details"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => deleteCustomer(cust.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete user record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={UserCheck}
            title="No User Details Found"
            description={`No user record matches your search "${searchQuery}".`}
            actionText="Clear Search"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
            }}
          />
        )}
      </div>

      {/* View Complete User Details Modal */}
      {selectedUserDetails && (
        <Modal
          isOpen={!!selectedUserDetails}
          onClose={() => setSelectedUserDetails(null)}
          title="User Details (यूज़र का पूरा डेटा)"
          subtitle={`Account ID: ${selectedUserDetails.id}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/70">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                {selectedUserDetails.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-neutral-900 font-serif-brand">
                  {selectedUserDetails.name}
                </h3>
                <span className="text-xs text-neutral-500 block">
                  {selectedUserDetails.email || 'No email attached'}
                </span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                  {selectedUserDetails.status} Diner
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-[11px] text-neutral-500 font-medium block mb-1">
                  10-Digit Mobile
                </span>
                <span className="font-mono font-bold text-neutral-900">
                  {selectedUserDetails.phone}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-[11px] text-neutral-500 font-medium block mb-1">
                  Saved Password
                </span>
                <span className="font-mono font-bold text-neutral-900">
                  {selectedUserDetails.password || 'password123'}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-[11px] text-neutral-500 font-medium block mb-1">
                  Total Orders
                </span>
                <span className="font-mono font-bold text-neutral-900">
                  {selectedUserDetails.totalOrders} dining orders
                </span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-[11px] text-neutral-500 font-medium block mb-1">
                  Total Lifetime Spend
                </span>
                <span className="font-mono font-bold text-amber-700">
                  ₹{selectedUserDetails.totalSpend.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs">
              <span className="text-[11px] text-neutral-500 font-medium block mb-1">
                Registration / Last Visit
              </span>
              <span className="text-neutral-800 font-medium">
                {selectedUserDetails.createdAt ? `Registered on ${selectedUserDetails.createdAt}` : selectedUserDetails.lastOrderDate}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserDetails(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <Modal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          title="Add New User (नया यूज़र जोड़ें)"
          subtitle="Create customer account with 10-digit mobile number & password"
          maxWidth="sm"
        >
          <form onSubmit={handleAddUserSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  Mobile Number (Strictly 10 Digits) *
                </label>
                {newUserPhone.length === 10 && (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>10 Digits Valid</span>
                  </span>
                )}
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 bg-white font-mono"
              />
              {newUserPhone.length > 0 && newUserPhone.length < 10 && (
                <p className="text-[10px] text-red-600 mt-1">
                  ⚠️ Invalid: 10 digits required ({newUserPhone.length}/10)
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Password *
              </label>
              <input
                type="text"
                required
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="e.g. secret123"
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Account Status
              </label>
              <select
                value={newUserStatus}
                onChange={(e) => setNewUserStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 bg-white"
              >
                <option value="Active">Active</option>
                <option value="VIP">VIP</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2 border-t border-neutral-100">
              <button
                type="submit"
                className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>Save User Details</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
