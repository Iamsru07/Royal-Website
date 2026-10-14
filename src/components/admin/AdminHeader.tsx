import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  ExternalLink,
  Sparkles,
  CalendarDays,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  Phone,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  getReservationTimeInfo,
  playNotificationChime,
  create30MinWhatsAppLink,
} from '../../utils/notificationHelpers';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onMenuToggle,
  actions,
}) => {
  const { orders, reservations, selectedTable, settings, showToast } = useRestaurant();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  const pendingOrders = orders.filter(
    (o) => o.status === 'Received' || o.status === 'Confirmed' || o.status === 'Preparing'
  ).length;

  // Active confirmed reservations for today
  const activeTodayReservations = reservations.filter(
    (r) => r.status === 'Confirmed' || r.status === 'Seated'
  );

  // Reservations within 30 minutes (or due today)
  const urgentReservations = activeTodayReservations.map((r) => ({
    reservation: r,
    timeInfo: getReservationTimeInfo(r),
  }));

  const thirtyMinAlerts = urgentReservations.filter((item) => item.timeInfo.isWithin30Mins);
  const totalAlertsCount = thirtyMinAlerts.length + (pendingOrders > 0 ? 1 : 0);

  const handleTestChime = () => {
    playNotificationChime();
    showToast('🔔 Notification Chime Tested! 30-min alert sounds are active.', 'info');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-100 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle admin sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-900 font-serif-brand tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-neutral-500 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {actions}

        {/* 30-Minute Reservation Alert & Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
              thirtyMinAlerts.length > 0
                ? 'bg-amber-500/10 border-amber-300 text-amber-900 shadow-xs ring-2 ring-amber-400/20'
                : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
            }`}
            title="30-Minute Pre-Booking Alerts & Kitchen Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {thirtyMinAlerts.length > 0 ? (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-bounce shadow-xs">
                {thirtyMinAlerts.length}
              </span>
            ) : pendingOrders > 0 ? (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            ) : null}
          </button>

          {/* Notification Popover Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 leading-none">
                      Admin Notifications
                    </h4>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      30-Min Pre-Booking & Kitchen Alerts
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleTestChime}
                    className="p-1 text-neutral-400 hover:text-amber-700 rounded cursor-pointer"
                    title="Play Test Chime"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-700 rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SECTION 1: 30-MIN PRE-BOOKING ALERTS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                  <span className="flex items-center gap-1.5 text-amber-800">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>30-Minute Pre-Booking Alerts ({thirtyMinAlerts.length})</span>
                  </span>
                  <Link
                    to="/admin/reservations"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[10px] text-amber-600 hover:underline font-semibold"
                  >
                    View All →
                  </Link>
                </div>

                {thirtyMinAlerts.length === 0 ? (
                  <div className="p-3 bg-neutral-50 rounded-xl text-neutral-500 text-[11px] text-center">
                    No reservations due in next 30 minutes.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {thirtyMinAlerts.map(({ reservation: res, timeInfo }) => {
                      const waLink = create30MinWhatsAppLink(res, settings.name);
                      return (
                        <div
                          key={res.id}
                          className="p-3 rounded-xl bg-amber-50/70 border border-amber-300 text-neutral-800 space-y-1.5 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                                <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-mono text-[10px]">
                                  Tbl {res.tableNumber}
                                </span>
                                <span>{res.customerName}</span>
                              </div>
                              <span className="text-[10px] text-neutral-500 block">
                                {res.guestsCount} Guests · {res.timeSlot} ({res.reservationDate})
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0">
                              {timeInfo.minutesRemaining !== null && timeInfo.minutesRemaining > 0
                                ? `${timeInfo.minutesRemaining}m Left`
                                : 'Due Now!'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[10px]">
                            <span className="text-neutral-600 font-mono">
                              Fee Paid: ₹{res.feeAmount}
                            </span>
                            <div className="flex gap-1.5">
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                              >
                                Send 30m WA 💬
                              </a>
                              <Link
                                to="/admin/reservations"
                                onClick={() => setIsNotifOpen(false)}
                                className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-white font-semibold transition-colors"
                              >
                                Prepare Table
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 2: KITCHEN ORDERS */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-neutral-600">
                <span className="text-[11px] font-semibold">Kitchen Orders</span>
                <span className="px-2 py-0.5 bg-neutral-100 rounded-full font-mono text-[10px] font-bold">
                  {pendingOrders} active
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Live Active Kitchen Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-semibold text-amber-900">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
          <span>{pendingOrders} Active Orders</span>
        </div>

        {/* Quick Customer Menu Preview Link */}
        <Link
          to={`/menu?table=${selectedTable}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          title="Open customer ordering view"
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Preview Table QR</span>
        </Link>
      </div>
    </header>
  );
};
