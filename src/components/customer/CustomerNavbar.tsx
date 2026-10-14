import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingCart,
  User,
  ShieldCheck,
  ChevronDown,
  Search,
  Sparkles,
  ArrowRight,
  CalendarDays,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
  Menu,
  Phone,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Modal } from '../common/Modal';

interface CustomerNavbarProps {
  onSearchClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  showSearchBar?: boolean;
  onOpenSidebar?: () => void;
}

export const CustomerNavbar: React.FC<CustomerNavbarProps> = ({
  onSearchClick,
  searchQuery,
  onSearchChange,
  showSearchBar = false,
  onOpenSidebar,
}) => {
  const {
    selectedTable,
    setSelectedTable,
    tables,
    totalCartItemsCount,
    setIsCartDrawerOpen,
    bookTable,
    createReservation,
    user,
    settings,
    showToast,
  } = useRestaurant();

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'book' | 'switch'>('book');
  const [targetTable, setTargetTable] = useState(selectedTable);
  const [dinerName, setDinerName] = useState(user.name || '');
  const [dinerPhone, setDinerPhone] = useState(user.phone ? user.phone.replace(/\D/g, '').slice(-10) : '');
  const [guestsCount, setGuestsCount] = useState('2');
  const [phoneError, setPhoneError] = useState('');

  // Booking Date & Time States
  const [bookingDateOpt, setBookingDateOpt] = useState<'Today' | 'Tomorrow' | 'Custom'>('Today');
  const [customBookingDate, setCustomBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookingTimeSlot, setBookingTimeSlot] = useState('08:00 PM');
  const [bookingPaymentMethod, setBookingPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');

  const navigate = useNavigate();

  const openBookingModal = () => {
    setModalTab('book');
    setTargetTable(selectedTable);
    if (user.name) setDinerName(user.name);
    if (user.phone) setDinerPhone(user.phone.replace(/\D/g, '').slice(-10));
    setPhoneError('');
    setIsTableModalOpen(true);
  };

  const openSwitchModal = () => {
    setModalTab('switch');
    setTargetTable(selectedTable);
    setIsTableModalOpen(true);
  };

  const handlePhoneInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setDinerPhone(digits);
    setPhoneError('');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetTable) {
      showToast('Please select a dining table to book', 'error');
      return;
    }

    if (!dinerName.trim()) {
      showToast('Please enter your name for table booking', 'error');
      return;
    }

    if (!dinerPhone || dinerPhone.length !== 10) {
      const msg = `Invalid mobile number: Exactly 10 digits required (${dinerPhone.length}/10 entered)`;
      setPhoneError(msg);
      showToast(msg, 'error');
      return;
    }

    const selectedTblObj = tables.find((t) => t.tableNumber === targetTable);
    if (selectedTblObj && selectedTblObj.status === 'OCCUPIED') {
      showToast(`Table ${targetTable} is currently OCCUPIED. Please choose another table.`, 'error');
      return;
    }

    // Determine formatted date
    const today = new Date();
    let dateStr = `Today, ${today.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
    if (bookingDateOpt === 'Tomorrow') {
      const tmrw = new Date(today);
      tmrw.setDate(tmrw.getDate() + 1);
      dateStr = `Tomorrow, ${tmrw.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
    } else if (bookingDateOpt === 'Custom') {
      const [y, m, d] = customBookingDate.split('-').map(Number);
      const custom = new Date(y, m - 1, d);
      dateStr = custom.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    }

    const currentFee = settings.reservationFeePerBooking !== undefined ? settings.reservationFeePerBooking : 99;

    // Create reservation with full details (Time, Date, Fee, Online Payment)
    createReservation({
      tableNumber: targetTable,
      customerName: dinerName.trim(),
      customerPhone: `+91 ${dinerPhone}`,
      guestsCount: parseInt(guestsCount, 10) || 2,
      reservationDate: dateStr,
      timeSlot: bookingTimeSlot,
      feeAmount: currentFee,
      paymentMethod: bookingPaymentMethod,
    });

    setIsTableModalOpen(false);
    navigate(`/reservation?tab=my-reservations`);
  };

  const handleTableSwitch = (tblNumber: string) => {
    setSelectedTable(tblNumber);
    setIsTableModalOpen(false);
    showToast(`Switched active ordering to Table ${tblNumber}`, 'info');
    navigate(`/menu?table=${tblNumber}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-200">
        {/* Top Announcement / Table Context Banner on Mobile/Desktop */}
        <div className="bg-neutral-900 text-white px-4 py-1.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-xl mx-auto md:mx-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-neutral-200">
              Kitchen is accepting orders
            </span>
            <span className="text-neutral-500 hidden sm:inline">·</span>
            <span className="text-neutral-400 hidden sm:inline">
              Avg prep time {settings.defaultPrepTimeMinutes} mins
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto text-xs">
            <Link
              to="/reservation"
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Reservation (Pay ₹{settings.reservationFeePerBooking || 99})</span>
            </Link>

            <button
              onClick={openSwitchModal}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-medium transition-colors cursor-pointer"
            >
              <span>Table {selectedTable}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            <Link
              to="/contact"
              className="hidden sm:flex items-center gap-1 text-neutral-300 hover:text-white px-2 py-0.5 rounded hover:bg-neutral-800 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Contact</span>
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Side Menu Button + Restaurant Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {onOpenSidebar && (
              <button
                type="button"
                onClick={onOpenSidebar}
                aria-label="Open side navigation menu"
                className="p-2 -ml-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Open Side Menu"
              >
                <Menu className="w-5 h-5 text-neutral-900" />
                <span className="hidden xl:inline text-xs font-bold text-neutral-800">Menu & Side Bar</span>
              </button>
            )}

            <Link to="/menu" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm group-hover:bg-amber-700 transition-colors">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 font-serif-brand leading-none">
                  {settings.name}
                </span>
                <span className="text-[10px] text-neutral-400 tracking-wide font-medium">
                  QR TABLE ORDERING
                </span>
              </div>
            </Link>
          </div>

          {/* Search bar inside header if on menu or toggled */}
          {showSearchBar && onSearchChange && (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search artisanal dishes, starters, biryani..."
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white text-xs text-neutral-900 placeholder:text-neutral-400 rounded-xl border border-neutral-200/80 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/10 transition-all"
                />
              </div>
            </div>
          )}

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-neutral-600">
            <Link
              to="/menu"
              className="hover:text-amber-700 transition-colors py-1"
            >
              Menu
            </Link>
            
            {/* Dedicated Reservation link with per-booking fee badge */}
            <Link
              to="/reservation"
              className="hover:text-amber-700 transition-colors py-1 flex items-center gap-1.5 font-bold text-neutral-900"
            >
              <CalendarDays className="w-4 h-4 text-amber-600" />
              <span>Reservation</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300">
                Pay ₹{settings.reservationFeePerBooking || 99}
              </span>
            </Link>

            <button
              onClick={openBookingModal}
              className="hover:text-amber-700 transition-colors py-1 flex items-center gap-1 cursor-pointer text-neutral-600"
            >
              <span>Quick Book</span>
            </button>
            <Link
              to="/reviews"
              className="hover:text-amber-700 transition-colors py-1"
            >
              Reviews
            </Link>
            <Link
              to="/contact"
              className="hover:text-amber-700 transition-colors py-1"
            >
              Contact
            </Link>
            <Link
              to="/my-orders"
              className="hover:text-amber-700 transition-colors py-1"
            >
              My Orders
            </Link>
            <Link
              to="/profile"
              className="hover:text-amber-700 transition-colors py-1"
            >
              Profile
            </Link>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger for mobile or when not in header */}
            {onSearchClick && !showSearchBar && (
              <button
                onClick={onSearchClick}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Search food"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Profile / Login */}
            {user.isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-xs font-medium text-neutral-800"
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px]">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {user.name}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>Login</span>
              </Link>
            )}

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-all shadow-xs group cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-semibold hidden sm:inline">
                Order
              </span>
              {totalCartItemsCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 bg-amber-500 text-neutral-950 text-[10px] font-extrabold rounded-full flex items-center justify-center tabular-nums">
                  {totalCartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Book / Select Dining Table Modal */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        title={modalTab === 'book' ? 'Book a Dining Table' : 'Select Dining Table'}
        subtitle={
          modalTab === 'book'
            ? 'Booking a table immediately marks it as OCCUPIED in the Admin Panel'
            : 'Select table number for QR ordering simulation'
        }
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Modal Mode Switcher */}
          <div className="flex items-center p-1 bg-neutral-100 rounded-xl">
            <button
              type="button"
              onClick={() => setModalTab('book')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                modalTab === 'book'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
              <span>Book Table (Occupies Table)</span>
            </button>
            <button
              type="button"
              onClick={() => setModalTab('switch')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                modalTab === 'switch'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span>Quick Switch Table</span>
            </button>
          </div>

          {/* Table Seating Legend */}
          <div className="flex items-center gap-4 text-[11px] text-neutral-600 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Reserved</span>
            </div>
          </div>

          {/* Table Grid Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Select Table:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border border-neutral-100 rounded-xl bg-neutral-50/50">
              {tables.map((tbl) => {
                const isSelected = tbl.tableNumber === targetTable;
                const isOccupied = tbl.status === 'OCCUPIED';
                const isReserved = tbl.status === 'RESERVED';
                const isInactive = tbl.status === 'INACTIVE';

                return (
                  <button
                    key={tbl.id}
                    type="button"
                    disabled={isInactive}
                    onClick={() => {
                      setTargetTable(tbl.tableNumber);
                      if (modalTab === 'switch') {
                        handleTableSwitch(tbl.tableNumber);
                      }
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold ring-2 ring-amber-500/20 shadow-xs'
                        : isOccupied
                        ? 'border-red-200 bg-red-50/60 text-red-900 hover:border-red-300'
                        : isReserved
                        ? 'border-amber-200 bg-amber-50/50 text-amber-800'
                        : isInactive
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-white text-neutral-800 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold">T-{tbl.tableNumber}</span>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-0.5">
                      <Users className="w-2.5 h-2.5" />
                      <span>{tbl.capacity}</span>
                    </span>

                    {/* Status dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full absolute top-1.5 right-1.5 ${
                        tbl.status === 'AVAILABLE'
                          ? 'bg-emerald-500'
                          : tbl.status === 'OCCUPIED'
                          ? 'bg-red-500'
                          : tbl.status === 'RESERVED'
                          ? 'bg-amber-500'
                          : 'bg-neutral-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form details when in Book Mode */}
          {modalTab === 'book' && (
            <form onSubmit={handleConfirmBooking} className="space-y-3 pt-2 border-t border-neutral-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={dinerName}
                    onChange={(e) => setDinerName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-neutral-700">
                      Mobile Number
                    </label>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {dinerPhone.length}/10
                    </span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={dinerPhone}
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    placeholder="10-digit number"
                    className={`w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border focus:outline-none focus:bg-white transition-colors ${
                      phoneError
                        ? 'border-red-400'
                        : dinerPhone.length === 10
                        ? 'border-emerald-400'
                        : 'border-neutral-200 focus:border-amber-600'
                    }`}
                  />
                  {phoneError && (
                    <p className="text-[10px] text-red-600 mt-1 font-medium">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Number of Guests
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="8">8 Guests</option>
                  </select>
                </div>
              </div>

              {/* Date & Time Selection (as requested by user) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                    <span>Booking Date</span>
                  </label>
                  <div className="flex gap-1.5 mb-1.5">
                    {(['Today', 'Tomorrow', 'Custom'] as const).map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setBookingDateOpt(opt)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          bookingDateOpt === opt
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {bookingDateOpt === 'Custom' && (
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={customBookingDate}
                      onChange={(e) => setCustomBookingDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-neutral-50 text-xs rounded-lg border border-neutral-200 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Seating Time Slot</span>
                  </label>
                  <select
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white font-mono"
                  >
                    <optgroup label="Dinner Service">
                      <option value="07:00 PM">07:00 PM</option>
                      <option value="07:30 PM">07:30 PM</option>
                      <option value="08:00 PM">08:00 PM (Prime)</option>
                      <option value="08:30 PM">08:30 PM</option>
                      <option value="09:00 PM">09:00 PM</option>
                      <option value="09:30 PM">09:30 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                    </optgroup>
                    <optgroup label="Lunch Service">
                      <option value="12:30 PM">12:30 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Per-Booking Fee & Online Payment Mode Only */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-900 block">
                      Per-Booking Advance Fee
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      ✓ 100% adjusted on final food bill
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-mono font-bold text-amber-600">
                      ₹{settings.reservationFeePerBooking !== undefined ? settings.reservationFeePerBooking : 99}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block">
                      Online Only
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Select Online Payment Method (Mandatory)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI', 'Card', 'NetBanking'] as const).map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setBookingPaymentMethod(m)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                          bookingPaymentMethod === m
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                            : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Pay ₹{settings.reservationFeePerBooking !== undefined ? settings.reservationFeePerBooking : 99} Online & Confirm
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Switch mode Done button */}
          {modalTab === 'switch' && (
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
