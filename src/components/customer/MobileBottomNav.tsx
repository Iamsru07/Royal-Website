import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, ShoppingBag, Receipt, User, CalendarDays } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface MobileBottomNavProps {
  onSearchClick?: () => void;
  onOpenSidebar?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({}) => {
  const { totalCartItemsCount, setIsCartDrawerOpen, settings } = useRestaurant();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-2 py-1 shadow-lg transition-transform"
    >
      <div className="grid grid-cols-5 items-center justify-around h-14 max-w-md mx-auto">
        {/* Menu Tab */}
        <NavLink
          to="/menu"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-amber-700' : 'text-neutral-500 hover:text-neutral-900'
            }`
          }
        >
          <Utensils className="w-4 h-4" />
          <span>Menu</span>
        </NavLink>

        {/* Dedicated Table Reservation Tab */}
        <NavLink
          to="/reservation"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-amber-700' : 'text-neutral-600 hover:text-neutral-900'
            }`
          }
        >
          <div className="relative">
            <CalendarDays className="w-4 h-4 text-amber-600" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span>Reserve</span>
        </NavLink>

        {/* Cart Trigger */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold text-neutral-800"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-neutral-800" />
            {totalCartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-amber-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center tabular-nums">
                {totalCartItemsCount}
              </span>
            )}
          </div>
          <span className="text-amber-900 font-bold">Cart</span>
        </button>

        {/* Orders Tab */}
        <NavLink
          to="/my-orders"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-amber-700' : 'text-neutral-500 hover:text-neutral-900'
            }`
          }
        >
          <Receipt className="w-4 h-4" />
          <span>Orders</span>
        </NavLink>

        {/* Profile Tab */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-amber-700' : 'text-neutral-500 hover:text-neutral-900'
            }`
          }
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

