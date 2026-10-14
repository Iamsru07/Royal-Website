import React, { useState } from 'react';
import { Outlet, useSearchParams, Link, useLocation } from 'react-router-dom';
import { CustomerNavbar } from '../components/customer/CustomerNavbar';
import { CustomerSidebar } from '../components/customer/CustomerSidebar';
import { MobileBottomNav } from '../components/customer/MobileBottomNav';
import { CartDrawer } from '../components/customer/CartDrawer';
import { CustomerFooter } from '../components/customer/CustomerFooter';
import { ToastContainer } from '../components/common/ToastContainer';
import { useRestaurant } from '../context/RestaurantContext';
import { CalendarDays, Sparkles } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { setSelectedTable, user, settings } = useRestaurant();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Sync table parameter if present in query string
  React.useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setSelectedTable(tableParam);
    }
  }, [searchParams, setSelectedTable]);

  const bookingFee = settings.reservationFeePerBooking || 99;
  const isReservationPage = location.pathname.startsWith('/reservation');

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB] text-neutral-900 pb-20 md:pb-6 relative">
      <CustomerNavbar
        onSearchClick={() => setIsSearchActive((prev) => !prev)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      {/* Customer Slide-out Navigation Sidebar (Opens from side) */}
      <CustomerSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Floating / Sticky Side Quick Option for Table Reservation on Desktop (Visible after login and for all diners) */}
      {!isReservationPage && (
        <aside
          aria-label="Quick reservation access"
          className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-30 flex-col"
        >
          <Link
            to="/reservation"
            className="group flex items-center gap-2 py-3 px-3.5 bg-neutral-900 hover:bg-neutral-950 text-white rounded-r-2xl shadow-xl border-y border-r border-amber-500/40 hover:border-amber-400 transition-all transform hover:translate-x-1"
          >
            <div className="relative">
              <CalendarDays className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-extrabold tracking-wide uppercase text-amber-300 flex items-center gap-1">
                <span>Reserve Table</span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </span>
              <span className="text-[10px] text-neutral-300 font-medium">
                Pay ₹{bookingFee} Advance Fee
              </span>
            </div>
          </Link>
        </aside>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <CustomerFooter />

      <MobileBottomNav
        onSearchClick={() => {
          const searchInput = document.getElementById('customer-food-search');
          if (searchInput) {
            searchInput.focus();
          }
        }}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />
      
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};
