import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  AlertCircle,
  BookmarkCheck,
  UtensilsCrossed,
  Phone,
  User,
  Info,
  ChevronRight,
  XCircle,
  Receipt,
  FileCheck,
  Star,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { RestaurantTable, TableReservation } from '../../types';
import { Modal } from '../../components/common/Modal';

export const ReservationPage: React.FC = () => {
  const {
    tables,
    user,
    settings,
    createReservation,
    cancelReservation,
    reservations,
    setSelectedTable,
    showToast,
  } = useRestaurant();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') === 'my-reservations' ? 'my-reservations' : 'book';

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState<'Today' | 'Tomorrow' | 'DayAfter' | 'Custom'>('Today');
  const [customDate, setCustomDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('08:00 PM');
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('');
  const [dinerName, setDinerName] = useState(user.name || '');
  const [dinerPhone, setDinerPhone] = useState(
    user.phone ? user.phone.replace(/\D/g, '').slice(-10) : ''
  );
  const [dinerEmail, setDinerEmail] = useState(user.email || '');
  const [specialOccasion, setSpecialOccasion] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiApp, setUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'ScanQR'>('ScanQR');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Success Modal
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);

  // Sync user info if user state updates
  useEffect(() => {
    if (user.isLoggedIn) {
      if (!dinerName && user.name) setDinerName(user.name);
      if (!dinerPhone && user.phone) setDinerPhone(user.phone.replace(/\D/g, '').slice(-10));
      if (!dinerEmail && user.email) setDinerEmail(user.email);
    }
  }, [user]);

  // Default pre-select first available table
  useEffect(() => {
    if (!selectedTableNumber && tables.length > 0) {
      const firstAvail = tables.find((t) => t.status === 'AVAILABLE');
      if (firstAvail) {
        setSelectedTableNumber(firstAvail.tableNumber);
      }
    }
  }, [tables, selectedTableNumber]);

  const bookingFee = settings.reservationFeePerBooking || 99;

  // Date formatted string
  const getFormattedDateString = () => {
    const today = new Date();
    if (selectedDate === 'Today') {
      return `Today, ${today.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
    }
    if (selectedDate === 'Tomorrow') {
      const tmrw = new Date(today);
      tmrw.setDate(tmrw.getDate() + 1);
      return `Tomorrow, ${tmrw.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
    }
    if (selectedDate === 'DayAfter') {
      const dayAfter = new Date(today);
      dayAfter.setDate(dayAfter.getDate() + 2);
      return dayAfter.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    }
    const [y, m, d] = customDate.split('-').map(Number);
    const custom = new Date(y, m - 1, d);
    return custom.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handlePhoneInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setDinerPhone(digits);
    setPhoneError('');
  };

  const handleConfirmAndPay = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTableNumber) {
      showToast('Please select a dining table for reservation', 'error');
      return;
    }

    const tblObj = tables.find((t) => t.tableNumber === selectedTableNumber);
    if (tblObj && tblObj.status === 'OCCUPIED') {
      showToast(
        `Table ${selectedTableNumber} is already occupied. Please select an available table.`,
        'error'
      );
      return;
    }

    if (!dinerName.trim()) {
      showToast('Please enter your full name for the booking', 'error');
      return;
    }

    if (!dinerPhone || dinerPhone.length !== 10) {
      const msg = `Invalid mobile number: Exactly 10 digits required (${dinerPhone.length}/10 entered)`;
      setPhoneError(msg);
      showToast(msg, 'error');
      return;
    }

    // Process payment simulation
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const reservationDateStr = getFormattedDateString();
      const combinedNotes = [
        specialOccasion ? `Occasion: ${specialOccasion}` : '',
        specialRequests ? `Notes: ${specialRequests}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const newRes = createReservation({
        tableNumber: selectedTableNumber,
        customerName: dinerName.trim(),
        customerPhone: `+91 ${dinerPhone}`,
        customerEmail: dinerEmail.trim() || undefined,
        guestsCount,
        reservationDate: reservationDateStr,
        timeSlot: selectedTimeSlot,
        specialRequests: combinedNotes,
        feeAmount: bookingFee,
        paymentMethod,
      });

      setConfirmedReservation(newRes);
    }, 1200);
  };

  // Lunch & Dinner time slots
  const lunchSlots = ['12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM'];
  const dinnerSlots = [
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM',
    '09:30 PM',
    '10:00 PM',
  ];

  // Helper for Table Zone Description
  const getTableZone = (num: string) => {
    const n = parseInt(num, 10);
    if (n <= 4) return 'Heritage Bistro · Ground Floor';
    if (n <= 8) return 'Window Garden View';
    if (n <= 12) return 'Royal AC Family Lounge';
    return 'Rooftop Star Deck · VIP';
  };

  // Filter user's reservations
  const userReservations = reservations.filter((r) => {
    if (user.phone && r.customerPhone.includes(user.phone.replace(/\D/g, '').slice(-10))) {
      return true;
    }
    return true; // Show all or matched for rich experience
  });

  return (
    <div className="max-w-6xl mx-auto py-2 sm:py-4 space-y-6">
      {/* Top Banner / Heading */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-6 sm:p-8 shadow-xl border border-neutral-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>GUARANTEED SEATING & INSTANT TABLE OCCUPANCY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-brand tracking-tight">
              Table Reservation & Advance Booking
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Reserve your favourite dining table at {settings.name}. A nominal booking deposit of{' '}
              <strong className="text-amber-400 font-bold">₹{bookingFee}</strong> per booking secures your table
              and is <strong className="text-white underline">100% adjusted on your final food bill</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-semibold">
                Per-Booking Deposit
              </span>
              <div className="text-3xl font-mono font-extrabold text-amber-400 mt-0.5">
                ₹{bookingFee}
              </div>
              <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
                ✓ 100% Credited to Dining Bill
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-neutral-800 text-xs">
          <button
            onClick={() => setSearchParams({ tab: 'book' })}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'book'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Book Table & Pay Fee</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'my-reservations' })}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'my-reservations'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>My Bookings ({reservations.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BOOK TABLE & PAY FEE */}
      {activeTab === 'book' && (
        <form onSubmit={handleConfirmAndPay} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Selections (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Date & Guests & Time */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-serif-brand">
                    Select Date, Seating Time & Guests
                  </h3>
                  <p className="text-xs text-neutral-500">Choose when you plan to dine with us</p>
                </div>
              </div>

              {/* Date selection chips */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700">Reservation Date</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Today', 'Tomorrow', 'DayAfter', 'Custom'] as const).map((d) => {
                    const today = new Date();
                    let label = 'Today';
                    let sub = today.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    if (d === 'Tomorrow') {
                      label = 'Tomorrow';
                      const tmrw = new Date(today);
                      tmrw.setDate(tmrw.getDate() + 1);
                      sub = tmrw.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    } else if (d === 'DayAfter') {
                      label = 'In 2 Days';
                      const da = new Date(today);
                      da.setDate(da.getDate() + 2);
                      sub = da.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    } else if (d === 'Custom') {
                      label = 'Pick Date';
                      sub = 'Calendar';
                    }

                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setSelectedDate(d)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedDate === d
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200 text-neutral-800'
                        }`}
                      >
                        <span className="block text-xs font-bold">{label}</span>
                        <span
                          className={`block text-[11px] ${
                            selectedDate === d ? 'text-amber-400' : 'text-neutral-500'
                          }`}
                        >
                          {sub}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedDate === 'Custom' && (
                  <div className="pt-2">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                )}
              </div>

              {/* Guests Count Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Number of Guests ({guestsCount} {guestsCount === 1 ? 'person' : 'people'})</span>
                  </label>
                  <span className="text-[11px] text-neutral-500">Tables filtered accordingly</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setGuestsCount(num)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        guestsCount === num
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Choose Seating Time Slot</span>
                </label>

                {/* Lunch */}
                <div>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Lunch Service
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {lunchSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          selectedTimeSlot === slot
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dinner */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Dinner Service
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {dinnerSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          selectedTimeSlot === slot
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Live Dining Table Selection (Floor Map) */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 font-serif-brand">
                      Select Table to Occupy
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Chosen table will be marked OCCUPIED in the admin panel upon booking
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="hidden sm:flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </span>
                  <span className="flex items-center gap-1 text-red-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>Occupied</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Reserved</span>
                  </span>
                </div>
              </div>

              {/* Table Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {tables.map((tbl) => {
                  const isAvailable = tbl.status === 'AVAILABLE';
                  const isSelected = selectedTableNumber === tbl.tableNumber;
                  const isOccupied = tbl.status === 'OCCUPIED';
                  const isReserved = tbl.status === 'RESERVED';

                  return (
                    <button
                      type="button"
                      key={tbl.id}
                      disabled={!isAvailable && !isSelected}
                      onClick={() => {
                        if (isAvailable) setSelectedTableNumber(tbl.tableNumber);
                      }}
                      className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 cursor-pointer ${
                        isSelected
                          ? 'border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/50 shadow-sm'
                          : isAvailable
                          ? 'border-neutral-200 hover:border-amber-400 bg-white hover:bg-neutral-50'
                          : 'border-neutral-200 bg-neutral-100 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`font-mono font-bold text-xs px-2 py-0.5 rounded-lg ${
                            isSelected
                              ? 'bg-amber-600 text-white'
                              : isAvailable
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-400 text-white'
                          }`}
                        >
                          T{tbl.tableNumber}
                        </span>

                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        )}

                        {!isSelected && isOccupied && (
                          <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded-md">
                            Occupied
                          </span>
                        )}

                        {!isSelected && isReserved && (
                          <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md">
                            Reserved
                          </span>
                        )}

                        {!isSelected && isAvailable && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                            Available
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-800">
                          <Users className="w-3 h-3 text-neutral-400" />
                          <span>{tbl.capacity} Seater</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 truncate block mt-0.5">
                          {getTableZone(tbl.tableNumber)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedTableNumber && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Selected <strong>Table {selectedTableNumber}</strong> ({getTableZone(selectedTableNumber)})
                    </span>
                  </div>
                  <span className="font-bold text-amber-800">Guaranteed Seat</span>
                </div>
              )}
            </div>

            {/* Step 3: Diner Details */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-serif-brand">
                    Guest Information & Special Occasion
                  </h3>
                  <p className="text-xs text-neutral-500">Details for restaurant greeting & dining bill credit</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Primary Diner Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Mehta"
                      value={dinerName}
                      onChange={(e) => setDinerName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    10-Digit Mobile Phone *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500 font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98765 43210"
                      value={dinerPhone}
                      onChange={(e) => handlePhoneInput(e.target.value)}
                      className={`w-full pl-12 pr-3 py-2.5 bg-neutral-50 text-xs font-mono rounded-xl border focus:outline-none ${
                        phoneError ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-amber-600'
                      }`}
                    />
                  </div>
                  {phoneError ? (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{phoneError}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-neutral-400 mt-1">Strictly 10 digits required for SMS & confirmation</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={dinerEmail}
                    onChange={(e) => setDinerEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Special Occasion
                  </label>
                  <select
                    value={specialOccasion}
                    onChange={(e) => setSpecialOccasion(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 text-neutral-800"
                  >
                    <option value="">Casual Dining</option>
                    <option value="Birthday Celebration">Birthday Celebration 🎂</option>
                    <option value="Wedding Anniversary">Wedding Anniversary 💐</option>
                    <option value="Candlelight Date">Romantic Candlelight Date 🕯️</option>
                    <option value="Business Meeting">Business Lunch / Dinner 💼</option>
                    <option value="Family Gathering">Family Gathering 👨‍👩‍👧‍👦</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Special Dietary / Seating Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Quiet corner table, baby high-chair needed, less spicy preparations..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Per-Booking Fee Payment & Summary (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xs space-y-5 sticky top-20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-serif-brand">
                    Booking Fee & Payment
                  </h3>
                  <span className="text-[11px] text-neutral-500">Pay advance to confirm table</span>
                </div>
              </div>

              {/* Reservation summary card */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Selected Table</span>
                  <span className="font-bold text-neutral-900 font-mono">
                    {selectedTableNumber ? `Table ${selectedTableNumber}` : 'None'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Date</span>
                  <span className="font-semibold text-neutral-900">{getFormattedDateString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Seating Time</span>
                  <span className="font-semibold text-neutral-900">{selectedTimeSlot}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Guests</span>
                  <span className="font-semibold text-neutral-900">{guestsCount} Guests</span>
                </div>

                <div className="border-t border-neutral-200/80 pt-2.5 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Per-Booking Advance Fee</span>
                    <span className="font-mono font-bold text-neutral-900">₹{bookingFee}.00</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-emerald-700">
                    <span>Adjustment on Dining Bill</span>
                    <span>-₹{bookingFee}.00 (100% credited)</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-sm font-bold">
                    <span>Payable Now</span>
                    <span className="text-amber-600 font-mono text-base">₹{bookingFee}.00</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-800">
                    Online Payment Method
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Strictly Online Only
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  To prevent no-shows and hold your table, advance booking fee is payable exclusively via Online Payment (UPI, Card, Net Banking). No cash option for reservations.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Card', 'NetBanking'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        paymentMethod === method
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {/* Method Specific details */}
                {paymentMethod === 'UPI' && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3">
                    <div className="flex gap-2">
                      {(['ScanQR', 'GPay', 'PhonePe', 'Paytm'] as const).map((app) => (
                        <button
                          type="button"
                          key={app}
                          onClick={() => setUpiApp(app)}
                          className={`flex-1 py-1.5 px-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                            upiApp === app
                              ? 'bg-amber-600 text-white shadow-2xs'
                              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>

                    {upiApp === 'ScanQR' ? (
                      <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-neutral-200">
                        <div className="w-32 h-32 bg-neutral-900 rounded-lg p-2 text-white flex flex-col items-center justify-center shadow-xs">
                          <QrCode className="w-24 h-24 text-amber-400" />
                          <span className="text-[9px] font-mono tracking-wider text-neutral-300">
                            UPI ID: royal@upi
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-600 mt-2 font-medium">
                          Scan to pay <strong>₹{bookingFee}</strong> with any UPI app
                        </span>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Enter your UPI ID / VPA
                        </label>
                        <input
                          type="text"
                          placeholder={`${dinerPhone || '9876543210'}@okhdfcbank`}
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-3 py-2 bg-white text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 font-mono"
                        />
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-200 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-200 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          maxLength={3}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-200 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NetBanking' && (
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Choose Your Bank
                    </label>
                    <select className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-200">
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Security note */}
              <div className="flex items-start gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  256-bit encrypted secure transaction. Instant table status update in admin panel.
                </span>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                    <span>Processing Payment of ₹{bookingFee}...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{bookingFee} & Confirm Reservation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Verified Public Diners Social Proof Card */}
              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-2 text-xs mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5 font-serif-brand">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Public Diners Love (4.8★)</span>
                  </span>
                  <Link to="/reviews" className="text-[11px] font-bold text-amber-800 hover:text-amber-900">
                    Read 1,840+ Reviews ›
                  </Link>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed italic">
                  "Pre-booking Table 12 in advance with ₹99 gave us zero waiting time on a busy weekend. The table was prepared with clean cutlery and prompt greeting!"
                </p>
                <div className="flex items-center justify-between text-[10px] text-amber-800/80 font-medium pt-1 border-t border-amber-200/60">
                  <span>— Aarav Mehta, Google Review</span>
                  <span className="text-emerald-700 font-bold">✓ Verified Pre-Booking</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: MY RESERVATIONS */}
      {activeTab === 'my-reservations' && (
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 font-serif-brand">
                Your Table Bookings & Passes
              </h2>
              <p className="text-xs text-neutral-500">
                Track reservations, seating status, and advance deposit receipts
              </p>
            </div>

            <button
              onClick={() => setSearchParams({ tab: 'book' })}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              + Reserve Another Table
            </button>
          </div>

          {userReservations.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <CalendarDays className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-sm font-bold text-neutral-800">No Reservations Found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                You haven&apos;t reserved a dining table yet. Book now to get guaranteed seating and occupy your table.
              </p>
              <button
                onClick={() => setSearchParams({ tab: 'book' })}
                className="mt-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
              >
                Book Table (Pay ₹{bookingFee})
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userReservations.map((res) => {
                const isConfirmed = res.status === 'Confirmed';
                const isCancelled = res.status === 'Cancelled';

                return (
                  <div
                    key={res.id}
                    className={`rounded-2xl border p-5 shadow-xs transition-all space-y-3 flex flex-col justify-between ${
                      isCancelled
                        ? 'bg-neutral-50 border-neutral-200 opacity-60'
                        : 'bg-white border-amber-200/90 ring-1 ring-amber-400/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm px-2.5 py-1 bg-neutral-900 text-white rounded-xl">
                            T{res.tableNumber}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-neutral-900 font-serif-brand">
                              Table {res.tableNumber}
                            </h4>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              Ref: {res.id}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-neutral-100 my-2">
                        <div>
                          <span className="text-neutral-400 text-[10px] block font-semibold">DATE & TIME</span>
                          <span className="font-bold text-neutral-800">{res.reservationDate}</span>
                          <span className="text-amber-700 font-semibold block text-[11px]">{res.timeSlot}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-[10px] block font-semibold">GUESTS & DINER</span>
                          <span className="font-bold text-neutral-800">{res.customerName}</span>
                          <span className="text-neutral-500 text-[11px] block">{res.guestsCount} Guests</span>
                        </div>
                      </div>

                      {/* Fee and status */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-600">
                          Advance Deposit: <strong className="text-emerald-700">₹{res.feeAmount} (PAID)</strong>
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Txn: {res.transactionRef}
                        </span>
                      </div>

                      {res.specialRequests && (
                        <div className="mt-2 text-[11px] text-neutral-500 bg-neutral-50 p-2 rounded-lg">
                          {res.specialRequests}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTable(res.tableNumber);
                          navigate(`/menu?table=${res.tableNumber}`);
                        }}
                        className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                        <span>Order Food for Table {res.tableNumber}</span>
                      </button>

                      {isConfirmed && (
                        <button
                          onClick={() => cancelReservation(res.id)}
                          className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL & PASS */}
      {confirmedReservation && (
        <Modal
          isOpen={Boolean(confirmedReservation)}
          onClose={() => setConfirmedReservation(null)}
          title="Table Reserved Successfully!"
          subtitle="Your booking deposit has been processed and your dining table is now OCCUPIED"
          maxWidth="md"
        >
          <div className="space-y-5 text-neutral-900">
            {/* Ticket Pass Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950 text-white shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <span className="font-serif-brand font-bold text-sm tracking-wide text-amber-300">
                    {settings.name}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  ✓ CONFIRMED & OCCUPIED
                </span>
              </div>

              <div className="flex items-center justify-between border-y border-neutral-800 py-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                    DINING TABLE
                  </span>
                  <span className="text-2xl font-mono font-extrabold text-white">
                    Table {confirmedReservation.tableNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                    BOOKING REF
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-400">
                    {confirmedReservation.id}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-neutral-400 text-[10px] block">DATE & TIME</span>
                  <span className="font-semibold text-neutral-200">
                    {confirmedReservation.reservationDate} · {confirmedReservation.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">PRIMARY GUEST</span>
                  <span className="font-semibold text-neutral-200">
                    {confirmedReservation.customerName} ({confirmedReservation.guestsCount} Guests)
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400">
                  Advance Fee Paid: <strong className="text-emerald-400 font-mono">₹{confirmedReservation.feeAmount}</strong>
                </span>
                <span className="text-[10px] text-amber-300">100% Credited to Bill</span>
              </div>
            </div>

            {/* Note regarding table status */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Admin System Updated:</strong> Table {confirmedReservation.tableNumber} has been marked as{' '}
                <strong className="text-red-700">OCCUPIED</strong> in the restaurant admin panel and floor plan.
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const tbl = confirmedReservation.tableNumber;
                  setConfirmedReservation(null);
                  setSelectedTable(tbl);
                  navigate(`/menu?table=${tbl}`);
                }}
                className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Pre-Order Dishes for Table {confirmedReservation.tableNumber}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmedReservation(null);
                  setSearchParams({ tab: 'my-reservations' });
                }}
                className="py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                View My Bookings
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
