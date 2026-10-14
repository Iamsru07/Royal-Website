import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Receipt,
  Settings,
  LogOut,
  Flame,
  Leaf,
  ChevronRight,
  ShieldCheck,
  Check,
  CalendarDays,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const ProfilePage: React.FC = () => {
  const { user, logoutUser, orders, updateUserProfile, showToast } = useRestaurant();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const [dietaryVeg, setDietaryVeg] = useState(false);
  const [spicePref, setSpicePref] = useState<'Mild' | 'Medium' | 'Fiery'>('Medium');

  const myOrdersCount = orders.filter((o) => o.customerPhone === user.phone || user.isLoggedIn).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            {user.name ? user.name.charAt(0) : 'G'}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-serif-brand truncate">
                  {user.name || 'Guest Diner'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{user.phone || '+91 98765 43210'}</span>
                </p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-colors self-center sm:self-auto"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 pt-4 border-t border-neutral-100 text-xs">
              <div>
                <span className="font-bold text-neutral-900 tabular-nums font-mono text-sm block">
                  {myOrdersCount}
                </span>
                <span className="text-neutral-500 text-[11px]">Orders Placed</span>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <div>
                <span className="font-bold text-amber-700 text-sm block">
                  Gold Diner
                </span>
                <span className="text-neutral-500 text-[11px]">Loyalty Tier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-neutral-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Update Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Dietary Preferences Card */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 md:p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 font-serif-brand">
          Dining & Kitchen Preferences
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  Show Vegetarian Dishes by Default
                </span>
                <span className="text-[11px] text-neutral-500">
                  Pre-filters menu with pure vegetarian preparations
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={dietaryVeg}
              onChange={(e) => {
                setDietaryVeg(e.target.checked);
                showToast(
                  e.target.checked ? 'Vegetarian preference saved' : 'Showing all dishes',
                  'info'
                );
              }}
              className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  Default Spice Preference
                </span>
                <span className="text-[11px] text-neutral-500">
                  Communicated to kitchen chef when taking orders
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1 pl-11">
              {(['Mild', 'Medium', 'Fiery'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setSpicePref(level);
                    showToast(`Default spice set to ${level}`, 'info');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    spicePref === level
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation shortcuts */}
      <div className="bg-white rounded-3xl border border-neutral-100 divide-y divide-neutral-100 overflow-hidden shadow-xs">
        <Link
          to="/reservation"
          className="flex items-center justify-between p-4.5 hover:bg-neutral-50 transition-colors bg-gradient-to-r from-amber-50/40 to-white"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">
                  Table Reservation & Booking Passes
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300">
                  Pay Advance Fee
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 block">
                Reserve tables in advance, view passes & guaranteed seats
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </Link>

        <Link
          to="/my-orders"
          className="flex items-center justify-between p-4.5 hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Receipt className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-semibold text-neutral-800">
              My Order History & Receipts
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </Link>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl text-xs font-semibold transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>
    </div>
  );
};
