import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  Users,
  Search,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  IndianRupee,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  Printer,
  Copy,
  Filter,
  Check,
  CreditCard,
  QrCode,
  ShieldCheck,
  UserCheck,
  UtensilsCrossed,
  Grid,
  Trash2,
  ArrowUpDown,
  FileText,
  Bell,
  Volume2,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Modal } from '../../components/common/Modal';
import { TableReservation, RestaurantTable } from '../../types';
import {
  getReservationTimeInfo,
  playNotificationChime,
  create30MinWhatsAppLink,
} from '../../utils/notificationHelpers';

export const AdminReservationsPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const {
    reservations,
    tables,
    settings,
    updateSettings,
    createReservation,
    cancelReservation,
    updateReservationStatus,
    deleteReservation,
    showToast,
  } = useRestaurant();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled'>('All');
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Tomorrow' | 'Upcoming'>('All');

  // 30-Minute Notification System State
  // Initialized with first reservation so admin immediately sees live 30-min notification in action!
  const [simulatedAlertIds, setSimulatedAlertIds] = useState<string[]>(['RT-RES-9821']);
  const [preparedTableIds, setPreparedTableIds] = useState<string[]>([]);
  const [hasPlayedChime, setHasPlayedChime] = useState(false);

  // Change Pre-Booking Fee State & Modal
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [newFeeInput, setNewFeeInput] = useState(
    (settings.reservationFeePerBooking !== undefined ? settings.reservationFeePerBooking : 99).toString()
  );

  // Manual Pre-Booking Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCustomerName, setAddCustomerName] = useState('');
  const [addCustomerPhone, setAddCustomerPhone] = useState('');
  const [addCustomerEmail, setAddCustomerEmail] = useState('');
  const [addTableNumber, setAddTableNumber] = useState(tables[0]?.tableNumber || '01');
  const [addDateOption, setAddDateOption] = useState<'Today' | 'Tomorrow' | 'Custom'>('Today');
  const [addCustomDate, setAddCustomDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [addTimeSlot, setAddTimeSlot] = useState('08:00 PM');
  const [addGuestsCount, setAddGuestsCount] = useState(2);
  const [addSpecialRequests, setAddSpecialRequests] = useState('');
  const [addFeeAmount, setAddFeeAmount] = useState(
    (settings.reservationFeePerBooking !== undefined ? settings.reservationFeePerBooking : 99).toString()
  );
  const [addPaymentMethod, setAddPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');

  // Details / Voucher View Modal
  const [viewingReservation, setViewingReservation] = useState<TableReservation | null>(null);

  // Format Helper for Date
  const getAddDateString = () => {
    const today = new Date();
    if (addDateOption === 'Today') {
      return `Today, ${today.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
    }
    if (addDateOption === 'Tomorrow') {
      const tmrw = new Date(today);
      tmrw.setDate(tmrw.getDate() + 1);
      return `Tomorrow, ${tmrw.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
    }
    const [y, m, d] = addCustomDate.split('-').map(Number);
    const custom = new Date(y, m - 1, d);
    return custom.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Helper for Table Zone Description
  const getTableZone = (num: string) => {
    const n = parseInt(num, 10);
    if (n <= 4) return 'Heritage Bistro · Ground Floor';
    if (n <= 8) return 'Window Garden View';
    if (n <= 12) return 'Royal AC Family Lounge';
    return 'Rooftop Star Deck · VIP';
  };

  // Toggle 30-min alert simulation on any booking
  const handleToggle30MinAlert = (resId: string) => {
    setSimulatedAlertIds((prev) => {
      const exists = prev.includes(resId);
      if (exists) {
        showToast(`Dismissed 30-min alert for reservation ${resId}`, 'info');
        return prev.filter((id) => id !== resId);
      } else {
        playNotificationChime();
        showToast(`🚨 30-Minute Alert Triggered for reservation ${resId}! Table prep warning active.`, 'error');
        return [...prev, resId];
      }
    });
  };

  // Toggle table prepared status
  const handleToggleTablePrepared = (resId: string) => {
    setPreparedTableIds((prev) => {
      const isPrepared = prev.includes(resId);
      if (isPrepared) {
        showToast(`Table marked: preparation still needed`, 'info');
        return prev.filter((id) => id !== resId);
      } else {
        showToast(`Table marked PREPARED, cleaned & reserved for guest arrival ✓`, 'success');
        return [...prev, resId];
      }
    });
  };

  // Handle Save Pre-Booking Fee
  const handleSaveFee = (e: React.FormEvent) => {
    e.preventDefault();
    const feeVal = parseInt(newFeeInput, 10);
    if (isNaN(feeVal) || feeVal < 0) {
      showToast('Please enter a valid pre-booking fee amount (₹0 or greater)', 'error');
      return;
    }
    updateSettings({ reservationFeePerBooking: feeVal });
    setIsFeeModalOpen(false);
    showToast(`Pre-booking fee updated to ₹${feeVal} per booking across the entire system! ✓`, 'success');
  };

  // Handle Add Manual Pre-Booking
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addCustomerName.trim()) {
      showToast('Customer name is required', 'error');
      return;
    }
    const cleanPhone = addCustomerPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    const feeNum = parseInt(addFeeAmount, 10) || settings.reservationFeePerBooking || 99;

    createReservation({
      tableNumber: addTableNumber,
      customerName: addCustomerName.trim(),
      customerPhone: `+91 ${cleanPhone}`,
      customerEmail: addCustomerEmail.trim() || undefined,
      guestsCount: addGuestsCount,
      reservationDate: getAddDateString(),
      timeSlot: addTimeSlot,
      specialRequests: addSpecialRequests.trim() || undefined,
      feeAmount: feeNum,
      paymentMethod: addPaymentMethod,
    });

    setIsAddModalOpen(false);
    // Reset form
    setAddCustomerName('');
    setAddCustomerPhone('');
    setAddCustomerEmail('');
    setAddSpecialRequests('');
    showToast(`Pre-booking created for Table ${addTableNumber} (${addCustomerName})! ✓`, 'success');
  };

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      // Status Filter
      if (statusFilter !== 'All' && res.status !== statusFilter) {
        return false;
      }

      // Date Filter
      if (dateFilter === 'Today') {
        if (!res.reservationDate.toLowerCase().includes('today')) return false;
      } else if (dateFilter === 'Tomorrow') {
        if (!res.reservationDate.toLowerCase().includes('tomorrow')) return false;
      } else if (dateFilter === 'Upcoming') {
        if (res.status === 'Completed' || res.status === 'Cancelled') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = res.id.toLowerCase().includes(q);
        const matchName = res.customerName.toLowerCase().includes(q);
        const matchPhone = res.customerPhone.toLowerCase().includes(q);
        const matchTable = res.tableNumber.toLowerCase().includes(q);
        const matchTxn = res.transactionRef.toLowerCase().includes(q);
        const matchNotes = res.specialRequests?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchTable && !matchTxn && !matchNotes) {
          return false;
        }
      }

      return true;
    });
  }, [reservations, statusFilter, dateFilter, searchQuery]);

  // Active 30-Minute Alerts list
  const active30MinReservations = useMemo(() => {
    return reservations
      .filter((r) => r.status === 'Confirmed' || r.status === 'Seated')
      .map((r) => ({
        reservation: r,
        timeInfo: getReservationTimeInfo(r, simulatedAlertIds),
      }))
      .filter((item) => item.timeInfo.isWithin30Mins);
  }, [reservations, simulatedAlertIds]);

  // Key Statistics
  const totalReservations = reservations.length;
  const confirmedCount = reservations.filter((r) => r.status === 'Confirmed').length;
  const seatedCount = reservations.filter((r) => r.status === 'Seated').length;
  const todayCount = reservations.filter(
    (r) => r.reservationDate.toLowerCase().includes('today') && r.status !== 'Cancelled'
  ).length;
  const totalFeesCollected = reservations
    .filter((r) => r.feePaymentStatus === 'Paid' && r.status !== 'Cancelled')
    .reduce((sum, r) => sum + r.feeAmount, 0);

  const currentFee = settings.reservationFeePerBooking !== undefined ? settings.reservationFeePerBooking : 99;

  return (
    <>
      <AdminHeader
        title="Pre-Bookings & Table Reservations"
        subtitle="Manage advance table bookings, 30-minute arrival notifications, guest schedules, and online pre-booking fee collections"
        onMenuToggle={toggleSidebar}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setNewFeeInput(currentFee.toString());
                setIsFeeModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
              <span>Fee: ₹{currentFee} (Change)</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Pre-Booking</span>
            </button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* 🚨 CRITICAL FEATURE: 30-MINUTE ARRIVAL NOTIFICATION ALERT CENTER */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-3xl p-5 sm:p-6 border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shadow-md animate-pulse">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-serif-brand tracking-tight">
                    30-Minute Pre-Booking Notification Alerts
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white">
                    {active30MinReservations.length} Active Alert{active30MinReservations.length === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Automated alert triggered 30 minutes before dining time so restaurant staff can prepare, clean & reserve the table.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playNotificationChime();
                  showToast('🔔 Chime sound played! 30-min alert sound is loud and clear.', 'info');
                }}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
                title="Play Audio Chime"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Chime</span>
              </button>
            </div>
          </div>

          {/* Active 30-Min Alert Cards */}
          {active30MinReservations.length === 0 ? (
            <div className="p-4 rounded-2xl bg-neutral-800/40 border border-neutral-800 text-center text-xs text-neutral-400">
              <span>All tables are clear! No pre-bookings due within the next 30 minutes. Click "Test 30m Alert" on any booking below to test.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 relative z-10">
              {active30MinReservations.map(({ reservation: res, timeInfo }) => {
                const isPrepared = preparedTableIds.includes(res.id);
                const waReminder = create30MinWhatsAppLink(res, settings.name);

                return (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-neutral-850 border border-amber-500/40 shadow-lg space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex flex-col items-center justify-center font-mono font-bold shrink-0">
                          <span className="text-[9px] uppercase leading-none text-amber-300">TABLE</span>
                          <span className="text-lg leading-none mt-0.5">{res.tableNumber}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {res.customerName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse">
                              {timeInfo.statusLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                            <span className="font-mono text-amber-400 font-semibold">{res.timeSlot}</span>
                            <span>·</span>
                            <span>{res.guestsCount} Guests</span>
                            <span>·</span>
                            <span className="font-mono">₹{res.feeAmount} Paid</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {res.specialRequests && (
                      <p className="text-[11px] text-amber-200/90 italic bg-amber-950/40 p-2 rounded-lg border border-amber-900/50">
                        "{res.specialRequests}"
                      </p>
                    )}

                    {/* Action buttons on 30-min alert */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800 text-xs">
                      {/* Prepared toggle */}
                      <button
                        onClick={() => handleToggleTablePrepared(res.id)}
                        className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isPrepared
                            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                            : 'bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400'
                        }`}
                      >
                        {isPrepared ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Table Cleaned & Prepared ✓</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Prepare Table Now</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        {/* WhatsApp 30-min reminder link */}
                        <a
                          href={waReminder}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1 transition-colors"
                          title="Send 30-Minute WhatsApp Reminder to Customer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send 30m WA Alert</span>
                        </a>

                        {/* Mark Seated */}
                        {res.status === 'Confirmed' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'Seated')}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors cursor-pointer"
                            title="Mark as Seated"
                          >
                            Mark Seated
                          </button>
                        )}

                        {/* Dismiss Alert button */}
                        <button
                          onClick={() => handleToggle30MinAlert(res.id)}
                          className="px-2 py-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Dismiss 30-Min Alert"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4 Key Metrics Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500 font-medium">Total Pre-Bookings</div>
              <div className="text-2xl font-bold font-serif-brand text-neutral-900 mt-0.5">
                {totalReservations}
              </div>
              <div className="text-[10px] text-neutral-400">All registered reservations</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500 font-medium">Today's Bookings</div>
              <div className="text-2xl font-bold font-serif-brand text-amber-600 mt-0.5">
                {todayCount}
              </div>
              <div className="text-[10px] text-amber-600/80 font-medium">Scheduled for today</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500 font-medium">Active (Confirmed / Seated)</div>
              <div className="text-2xl font-bold font-serif-brand text-emerald-600 mt-0.5">
                {confirmedCount + seatedCount}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">
                {confirmedCount} Confirmed · {seatedCount} Seated
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-2xs flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-500 font-medium">Online Fees Collected</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 mt-0.5">
                ₹{totalFeesCollected}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">
                100% Online · UPI / Cards
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Guest Name, Phone, Table #, Booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Tabs */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-xl">
              {(['All', 'Confirmed', 'Seated', 'Completed', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-neutral-900 shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Date Quick Filter */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-xl">
              {(['All', 'Today', 'Tomorrow', 'Upcoming'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDateFilter(d)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    dateFilter === d
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pre-Bookings List / Table */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-neutral-900 font-serif-brand">
                Advance Pre-Bookings Ledger ({filteredReservations.length})
              </h3>
            </div>
            <span className="text-xs text-neutral-400">
              Per-Booking Deposit: <strong className="text-neutral-700">₹{currentFee}</strong> (Online Only)
            </span>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900">No Pre-Bookings Found</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'All' || dateFilter !== 'All'
                  ? 'No reservations matched your current search filters. Try clearing your search.'
                  : 'No customer table pre-bookings recorded yet. Customers can reserve tables via the customer reservation page.'}
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setDateFilter('All');
                  }}
                  className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl"
                >
                  + Add Pre-Booking
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/80 text-neutral-500 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-100">
                    <th className="px-5 py-3">Booking ID & Table</th>
                    <th className="px-5 py-3">Customer / Guest</th>
                    <th className="px-5 py-3">Date & Seating Time</th>
                    <th className="px-5 py-3">30-Min Alert & Countdown</th>
                    <th className="px-5 py-3">Guests & Occasion</th>
                    <th className="px-5 py-3">Pre-Booking Fee (Online)</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filteredReservations.map((res) => {
                    const cleanPhone = res.customerPhone.replace(/\D/g, '');
                    const waReminderLink = create30MinWhatsAppLink(res, settings.name);
                    const timeInfo = getReservationTimeInfo(res, simulatedAlertIds);
                    const isPrepared = preparedTableIds.includes(res.id);
                    const is30MinActive = timeInfo.isWithin30Mins;

                    return (
                      <tr
                        key={res.id}
                        className={`transition-colors group ${
                          is30MinActive
                            ? 'bg-amber-50/40 hover:bg-amber-50/80 font-medium'
                            : 'hover:bg-neutral-50/80'
                        }`}
                      >
                        {/* Booking ID & Table */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl font-mono font-bold flex flex-col items-center justify-center border shrink-0 ${
                              is30MinActive
                                ? 'bg-amber-500 text-neutral-950 border-amber-600 shadow-2xs'
                                : 'bg-amber-100/70 text-amber-900 border-amber-200/80'
                            }`}>
                              <span className="text-[9px] uppercase leading-none opacity-80">Tbl</span>
                              <span className="text-sm font-extrabold leading-none">{res.tableNumber}</span>
                            </div>
                            <div>
                              <div className="font-mono font-bold text-neutral-900 flex items-center gap-1.5">
                                <span>{res.id}</span>
                              </div>
                              <span className="text-[10px] text-neutral-400 block truncate max-w-[140px]">
                                {getTableZone(res.tableNumber)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Customer / Guest */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-0.5">
                            <span className="font-bold text-neutral-900 block">
                              {res.customerName}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                              <a
                                href={`tel:${res.customerPhone}`}
                                className="hover:text-amber-700 flex items-center gap-1"
                                title="Call Guest"
                              >
                                <Phone className="w-3 h-3 text-neutral-400" />
                                <span>{res.customerPhone}</span>
                              </a>
                              <a
                                href={waReminderLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 font-sans text-[10px] font-semibold"
                                title="Send WhatsApp Message"
                              >
                                WA 💬
                              </a>
                            </div>
                            {res.customerEmail && (
                              <span className="text-[10px] text-neutral-400 block truncate max-w-[160px]">
                                {res.customerEmail}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date & Seating Time */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                              <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                              <span>{res.reservationDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-neutral-600 font-mono text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{res.timeSlot}</span>
                            </div>
                          </div>
                        </td>

                        {/* 30-Min Alert & Countdown Column */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-1.5">
                            {is30MinActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse shadow-2xs">
                                <Bell className="w-3 h-3" />
                                <span>{timeInfo.statusLabel}</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-neutral-500 font-mono">
                                {timeInfo.statusLabel}
                              </span>
                            )}

                            <div className="flex items-center gap-1">
                              {/* Quick WhatsApp 30-min Reminder */}
                              <a
                                href={waReminderLink}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center gap-1"
                                title="Send 30-Minute WhatsApp Reminder"
                              >
                                <Send className="w-2.5 h-2.5" />
                                <span>30m WA Alert</span>
                              </a>

                              {/* Test 30m Alert button */}
                              <button
                                onClick={() => handleToggle30MinAlert(res.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                                  simulatedAlertIds.includes(res.id)
                                    ? 'bg-amber-200 text-amber-900 font-bold'
                                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                                }`}
                                title="Toggle 30-Minute Notification Alert Test"
                              >
                                {simulatedAlertIds.includes(res.id) ? 'Dismiss 30m' : 'Test 30m'}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Guests & Occasion */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 font-bold text-[11px]">
                              <Users className="w-3 h-3 text-neutral-500" />
                              <span>{res.guestsCount} Guests</span>
                            </div>
                            {res.specialRequests ? (
                              <p className="text-[10px] text-neutral-500 line-clamp-1 max-w-[180px] italic">
                                "{res.specialRequests}"
                              </p>
                            ) : (
                              <span className="text-[10px] text-neutral-400 block">Standard Dining</span>
                            )}
                          </div>
                        </td>

                        {/* Pre-Booking Fee (Online) */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-neutral-900 text-sm">
                                ₹{res.feeAmount}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                PAID ONLINE
                              </span>
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono truncate max-w-[140px]">
                              {res.paymentMethod} · {res.transactionRef}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          {res.status === 'Confirmed' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span>Confirmed</span>
                            </span>
                          )}
                          {res.status === 'Seated' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                              <span>Seated (Arrived)</span>
                            </span>
                          )}
                          {res.status === 'Completed' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                              <CheckCircle2 className="w-3 h-3 text-neutral-500" />
                              <span>Completed</span>
                            </span>
                          )}
                          {res.status === 'Cancelled' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                              <XCircle className="w-3 h-3 text-red-500" />
                              <span>Cancelled</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View details button */}
                            <button
                              onClick={() => setViewingReservation(res)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                              title="View Full Booking Voucher"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Mark as Seated */}
                            {res.status === 'Confirmed' && (
                              <button
                                onClick={() => updateReservationStatus(res.id, 'Seated')}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                                title="Mark Guest as Arrived and Seated"
                              >
                                Mark Seated
                              </button>
                            )}

                            {/* Mark as Completed */}
                            {(res.status === 'Confirmed' || res.status === 'Seated') && (
                              <button
                                onClick={() => updateReservationStatus(res.id, 'Completed')}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                                title="Mark Booking as Completed"
                              >
                                Complete
                              </button>
                            )}

                            {/* Cancel */}
                            {res.status !== 'Cancelled' && res.status !== 'Completed' && (
                              <button
                                onClick={() => cancelReservation(res.id)}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                                title="Cancel Reservation & Free Table"
                              >
                                Cancel
                              </button>
                            )}

                            {/* Delete permanently */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete reservation ${res.id} permanently?`)) {
                                  deleteReservation(res.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Record"
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
          )}
        </div>
      </div>

      {/* MODAL 1: Change Pre-Booking Fee */}
      <Modal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        title="Update Table Pre-Booking Fee"
        subtitle="Set the mandatory advance fee paid by customers when reserving a dining table"
        maxWidth="md"
      >
        <form onSubmit={handleSaveFee} className="space-y-4">
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>How Pre-Booking Fee Works</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">
              Customers will see this fee when booking any table online. The payment is processed <strong>strictly online (UPI, Debit/Credit Card, Net Banking)</strong>. The exact amount is credited against their final food bill.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              Pre-Booking Fee Amount (₹ per booking)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={newFeeInput}
                onChange={(e) => setNewFeeInput(e.target.value)}
                placeholder="e.g. 99 or 149"
                className="w-full pl-8 pr-4 py-2.5 bg-neutral-50 text-base font-mono font-bold text-neutral-900 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Common settings: ₹49, ₹99, ₹149, or ₹199 per table booking.
            </p>
          </div>

          {/* Quick preset chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              Quick Suggestions
            </span>
            <div className="flex gap-2">
              {[49, 99, 149, 199, 299].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setNewFeeInput(amt.toString())}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                    newFeeInput === amt.toString()
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsFeeModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Save New Fee (₹{newFeeInput || 0})
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Add Manual Pre-Booking */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Manual Table Pre-Booking"
        subtitle="Book a table for a guest calling in or booking at reception"
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full name"
                value={addCustomerName}
                onChange={(e) => setAddCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Mobile Number (10 digits) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="98765 43210"
                  value={addCustomerPhone}
                  onChange={(e) => setAddCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-3 py-2 bg-neutral-50 text-xs font-mono rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="customer@example.com"
                value={addCustomerEmail}
                onChange={(e) => setAddCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Select Table *
              </label>
              <select
                value={addTableNumber}
                onChange={(e) => setAddTableNumber(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white font-mono"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.tableNumber}>
                    Table {t.tableNumber} ({t.capacity} Seats) - {t.status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Reservation Date *
              </label>
              <div className="flex gap-2 mb-2">
                {(['Today', 'Tomorrow', 'Custom'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setAddDateOption(opt)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                      addDateOption === opt
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {addDateOption === 'Custom' && (
                <input
                  type="date"
                  value={addCustomDate}
                  onChange={(e) => setAddCustomDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none"
                />
              )}
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Seating Time Slot *
              </label>
              <select
                value={addTimeSlot}
                onChange={(e) => setAddTimeSlot(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white font-mono"
              >
                <optgroup label="Dinner Slots">
                  <option value="07:00 PM">07:00 PM</option>
                  <option value="07:30 PM">07:30 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="08:30 PM">08:30 PM</option>
                  <option value="09:00 PM">09:00 PM</option>
                  <option value="09:30 PM">09:30 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                </optgroup>
                <optgroup label="Lunch Slots">
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Number of Guests
              </label>
              <select
                value={addGuestsCount}
                onChange={(e) => setAddGuestsCount(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} Guests
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Pre-Booking Fee (₹)
              </label>
              <input
                type="number"
                value={addFeeAmount}
                onChange={(e) => setAddFeeAmount(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs font-mono font-bold rounded-xl border border-neutral-200 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Online Payment Method (Mandatory)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['UPI', 'Card', 'NetBanking'] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setAddPaymentMethod(m)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                      addPaymentMethod === m
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    {m} (Online)
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Special Occasion / Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Birthday anniversary, window seat preferred"
                value={addSpecialRequests}
                onChange={(e) => setAddSpecialRequests(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-xs cursor-pointer"
            >
              Confirm Pre-Booking
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Full Reservation Voucher / Details */}
      {viewingReservation && (
        <Modal
          isOpen={!!viewingReservation}
          onClose={() => setViewingReservation(null)}
          title={`Booking Voucher · ${viewingReservation.id}`}
          subtitle="Full reservation details, seating allocation, and online payment record"
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Top Badge Card */}
            <div className="p-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Confirmed Table Reservation
                </span>
                <h4 className="text-xl font-bold font-serif-brand mt-0.5">
                  Table {viewingReservation.tableNumber}
                </h4>
                <span className="text-xs text-neutral-400">
                  {getTableZone(viewingReservation.tableNumber)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-neutral-400 block">Advance Fee</span>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  ₹{viewingReservation.feeAmount}
                </span>
                <span className="text-[10px] text-emerald-400 block">✓ Paid Online</span>
              </div>
            </div>

            {/* 30-Minute Status Callout */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="font-bold text-amber-950 block">30-Minute Notification Alert</span>
                  <span className="text-[10px] text-amber-800">
                    {simulatedAlertIds.includes(viewingReservation.id)
                      ? '⚠️ 30-Min Alert Active: Table preparation needed'
                      : 'Scheduled alert will trigger 30 minutes before dining time.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleToggle30MinAlert(viewingReservation.id)}
                className="px-2.5 py-1 bg-amber-600 text-white font-bold text-[10px] rounded-lg shadow-2xs hover:bg-amber-700 cursor-pointer"
              >
                {simulatedAlertIds.includes(viewingReservation.id) ? 'Dismiss Alert' : 'Trigger 30m Alert'}
              </button>
            </div>

            {/* Details Grid */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Guest Name</span>
                <span className="font-bold text-neutral-900">{viewingReservation.customerName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Contact Number</span>
                <span className="font-mono font-semibold text-neutral-900 flex items-center gap-1.5">
                  <span>{viewingReservation.customerPhone}</span>
                  <a
                    href={`tel:${viewingReservation.customerPhone}`}
                    className="p-1 rounded bg-neutral-200 text-neutral-700 hover:text-amber-800"
                    title="Call"
                  >
                    <Phone className="w-3 h-3" />
                  </a>
                </span>
              </div>

              {viewingReservation.customerEmail && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Email</span>
                  <span className="text-neutral-900">{viewingReservation.customerEmail}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Reservation Date</span>
                <span className="font-bold text-neutral-900">{viewingReservation.reservationDate}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Seating Time</span>
                <span className="font-bold text-neutral-900">{viewingReservation.timeSlot}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Number of Guests</span>
                <span className="font-semibold text-neutral-900">{viewingReservation.guestsCount} Persons</span>
              </div>

              {viewingReservation.specialRequests && (
                <div className="border-t border-neutral-200/80 pt-2 text-[11px]">
                  <span className="text-neutral-500 block">Special Requests / Occasion:</span>
                  <span className="font-medium text-neutral-900 italic">
                    "{viewingReservation.specialRequests}"
                  </span>
                </div>
              )}

              <div className="border-t border-neutral-200/80 pt-2 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Payment Mode</span>
                  <span className="font-semibold text-neutral-900">{viewingReservation.paymentMethod} (Strictly Online)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Transaction Ref</span>
                  <span className="font-mono text-[11px] text-neutral-700">{viewingReservation.transactionRef}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Current Status</span>
                  <span className="font-bold text-amber-700">{viewingReservation.status}</span>
                </div>
              </div>
            </div>

            {/* Print & Action Footer */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <a
                href={create30MinWhatsAppLink(viewingReservation, settings.name)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send 30m WA Alert</span>
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewingReservation(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print Voucher</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
