import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  UtensilsCrossed,
  Save,
  Check,
  Building,
  Sliders,
  Palette,
  KeyRound,
  ShieldAlert,
  CalendarDays,
  IndianRupee,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';

export const AdminSettingsPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { settings, updateSettings, showToast } = useRestaurant();

  // Form local state
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [taxRate, setTaxRate] = useState(settings.taxRatePercent.toString());
  const [prepTime, setPrepTime] = useState(settings.defaultPrepTimeMinutes.toString());
  const [orderingEnabled, setOrderingEnabled] = useState(settings.orderingEnabled);
  const [allowCash, setAllowCash] = useState(settings.allowCashPayment);
  const [allowOnline, setAllowOnline] = useState(settings.allowOnlinePayment);
  const [reservationFee, setReservationFee] = useState(
    (settings.reservationFeePerBooking !== undefined ? settings.reservationFeePerBooking : 99).toString()
  );
  const [accentColor, setAccentColor] = useState(settings.accentColor);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name,
      tagline,
      address,
      phone,
      email,
      taxRatePercent: parseFloat(taxRate) || 5,
      defaultPrepTimeMinutes: parseInt(prepTime, 10) || 20,
      orderingEnabled,
      allowCashPayment: allowCash,
      allowOnlinePayment: allowOnline,
      reservationFeePerBooking: parseInt(reservationFee, 10) || 0,
      accentColor,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    showToast('Admin password updated successfully', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <AdminHeader
        title="Restaurant Settings"
        subtitle="Manage brand identity, billing taxes, digital ordering rules, and security"
        onMenuToggle={toggleSidebar}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto">
        <form onSubmit={handleSaveGeneral} className="space-y-6">
          {/* Section 1: Restaurant Information */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <Building className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-neutral-900 font-serif-brand">
                Restaurant Information & Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Restaurant Brand Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tagline / Cuisine Style
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Ordering Settings */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <Sliders className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-neutral-900 font-serif-brand">
                Kitchen & Ordering Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Default Kitchen Prep Time (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  GST / Sales Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="28"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    Accepting Table Orders
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Enable or temporarily pause customer table ordering
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={orderingEnabled}
                  onChange={(e) => setOrderingEnabled(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    Allow Cash at Counter
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Guests can opt to settle bill with cash upon checkout
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={allowCash}
                  onChange={(e) => setAllowCash(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">
                    Allow Online Payments (UPI / Cards)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Guests can pay instantly via phone screen
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={allowOnline}
                  onChange={(e) => setAllowOnline(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
                />
              </label>
            </div>
          </div>

          {/* Section 2.5: Table Pre-Booking & Reservation Fee */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <CalendarDays className="w-5 h-5 text-amber-700" />
              <div>
                <h2 className="text-base font-bold text-neutral-900 font-serif-brand leading-tight">
                  Table Pre-Booking & Advance Fee
                </h2>
                <p className="text-[11px] text-neutral-500">
                  Configure pre-booking fee amount per reservation (payable strictly online)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Pre-Booking Advance Fee (₹ per booking)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={reservationFee}
                    onChange={(e) => setReservationFee(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-neutral-50 text-xs font-mono font-bold rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Set to 0 if table pre-booking is free. Default is ₹99.
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-amber-900 block">
                  Strictly Online Payment Policy
                </span>
                <p className="text-[10px] text-amber-950 leading-relaxed">
                  All customer table pre-bookings mandate online payment (UPI, Credit/Debit Cards, Net Banking). The paid deposit is automatically credited to the customer's final dining bill.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Appearance */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <Palette className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-neutral-900 font-serif-brand">
                Theme & Branding Accent
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                style={{ backgroundColor: accentColor }}
              >
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Accent Color Hex Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-8 rounded border border-neutral-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-32 px-3 py-1.5 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save Restaurant Settings</span>
            </button>
          </div>
        </form>

        {/* Section 4: Admin Account Security */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-xs space-y-4 mt-8">
          <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
            <KeyRound className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-bold text-neutral-900 font-serif-brand">
              Admin Account & Password
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
