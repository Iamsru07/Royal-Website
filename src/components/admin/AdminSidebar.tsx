import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Receipt,
  CalendarDays,
  Grid,
  MenuSquare,
  Image as ImageIcon,
  Users,
  CreditCard,
  Megaphone,
  Settings,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Orders', path: '/admin/orders', icon: Receipt },
  { name: 'Pre-Bookings', path: '/admin/reservations', icon: CalendarDays },
  { name: 'Tables', path: '/admin/tables', icon: Grid },
  { name: 'Menu Items', path: '/admin/menu', icon: MenuSquare },
  { name: 'Dish Photos & Gallery', path: '/admin/gallery', icon: ImageIcon },
  { name: 'Categories', path: '/admin/categories', icon: UtensilsCrossed },
  { name: 'User Details', path: '/admin/customers', icon: Users },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  { name: 'Promotions', path: '/admin/advertisements', icon: Megaphone },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { settings, orders, reservations, showToast } = useRestaurant();
  const navigate = useNavigate();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Received' || o.status === 'Confirmed' || o.status === 'Preparing'
  ).length;

  const activeReservationsCount = reservations.filter(
    (r) => r.status === 'Confirmed' || r.status === 'Seated'
  ).length;

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('royal_taste_admin_authenticated');
      localStorage.removeItem('royal_taste_admin_authenticated');
    } catch (err) {
      console.warn('Storage error:', err);
    }
    showToast('Admin logged out successfully', 'info');
    navigate('/login?mode=admin');
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#121212] text-neutral-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-serif-brand leading-none">
              {settings.name}
            </h2>
            <span className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase">
              Admin Console
            </span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="md:hidden text-neutral-400 hover:text-white p-1"
          aria-label="Close admin menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1.5">
          Restaurant Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-100'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.name === 'Orders' && pendingOrdersCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 tabular-nums font-mono">
                  {pendingOrdersCount}
                </span>
              )}
              {item.name === 'Pre-Bookings' && activeReservationsCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 tabular-nums font-mono">
                  {activeReservationsCount}
                </span>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 mt-4 border-t border-neutral-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1.5">
            Customer View
          </div>
          <Link
            to="/menu"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-amber-400 hover:bg-neutral-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4" />
              <span>Customer QR Menu</span>
            </div>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">
              Live
            </span>
          </Link>
        </div>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/50">
        <div className="flex items-center justify-between px-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-600/30 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Restaurant Manager</p>
              <p className="text-[10px] text-neutral-400 truncate">manager@royaltaste.com</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-neutral-800/80 hover:bg-red-950/60 hover:text-red-400 text-neutral-300 rounded-xl text-xs font-medium transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 z-30">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
