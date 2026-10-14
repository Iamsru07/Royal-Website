import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  CalendarDays,
  MenuSquare,
  Receipt,
  User,
  ShieldCheck,
  LogOut,
  X,
  Sparkles,
  ChevronRight,
  Clock,
  MapPin,
  LogIn,
  BookmarkCheck,
  Star,
  PhoneCall,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface CustomerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logoutUser, selectedTable, settings, reservations } = useRestaurant();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    onClose();
    navigate('/login');
  };

  const userReservationsCount = reservations.filter(
    (r) => (user.phone && r.customerPhone.includes(user.phone.replace(/\D/g, '').slice(-10))) || r.status === 'Confirmed'
  ).length;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar backdrop"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              onClose();
            }
          }}
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 transition-opacity cursor-pointer animate-in fade-in duration-200"
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Customer Navigation Sidebar"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
          <Link to="/menu" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-serif-brand leading-none">
                {settings.name}
              </h2>
              <span className="text-[10px] text-amber-300 font-medium tracking-wide">
                QR DINING & RESERVATION
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            aria-label="Close navigation sidebar"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card (Prominent after Login) */}
        <div className="p-4 bg-gradient-to-br from-amber-50/60 via-white to-neutral-50 border-b border-neutral-100">
          {user.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-neutral-900 truncate">
                    {user.name}
                  </h4>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    GOLD
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-mono truncate">
                  {user.phone || 'Diner Account'}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Logged in · Table ordering active</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Welcome Guest</h4>
                  <p className="text-[11px] text-neutral-500">Sign in to book tables & view history</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex-1 py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl text-center transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex-1 py-1.5 px-3 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl text-center transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* SPECIAL FEATURED LINK: Table Reservation (Always visible, extra highlighted when logged in) */}
          <div className="pb-1">
            <NavLink
              to="/reservation"
              onClick={onClose}
              className={({ isActive }) =>
                `group relative block p-3.5 rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400/20'
                    : 'bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-white hover:from-amber-500/15 hover:via-amber-100/60 border-amber-200/90 text-neutral-900 shadow-xs'
                }`
              }
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold tracking-tight">
                        Table Reservation
                      </span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500 text-neutral-950">
                        Pay ₹{settings.reservationFeePerBooking !== undefined ? settings.reservationFeePerBooking : 99}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 group-hover:text-neutral-700 block">
                      Book & Pay Per-Booking Advance Fee
                    </span>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-amber-600 animate-bounce shrink-0" />
              </div>

              <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-amber-900 font-semibold">
                <span>Instant Confirmation · Occupies Table</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </NavLink>
          </div>

          <div className="px-2 pt-2 pb-1 text-[10px] font-extrabold tracking-wider uppercase text-neutral-400">
            Quick Navigation
          </div>

          {/* Standard Navigation Links */}
          <NavLink
            to="/menu"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <MenuSquare className="w-4 h-4" />
              <span>Food Menu & Ordering</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </NavLink>

          <NavLink
            to="/my-orders"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Receipt className="w-4 h-4" />
              <span>My Orders & Receipts</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </NavLink>

          <NavLink
            to="/reservation?tab=my-reservations"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <BookmarkCheck className="w-4 h-4 text-amber-600" />
              <span>My Table Bookings</span>
            </div>
            {userReservationsCount > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                {userReservationsCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span>Diner Profile & Preferences</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </NavLink>

          <NavLink
            to="/reviews"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Customer Reviews & Ratings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </NavLink>

          <NavLink
            to="/contact"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Contact & Directions</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </NavLink>

        </div>

        {/* Footer / Table Info & Logout */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/70 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-600 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Current Table:</span>
            </span>
            <span className="font-bold text-neutral-900 bg-white px-2 py-0.5 rounded-lg border border-neutral-200">
              Table {selectedTable}
            </span>
          </div>

          {user.isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Account</span>
            </button>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Log In for Table Reservation</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};
