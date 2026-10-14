import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Heart,
  MessageSquare,
  CalendarDays,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const CustomerFooter: React.FC = () => {
  const { settings } = useRestaurant();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-[#121212] text-neutral-300 border-t border-neutral-800 relative z-10 overflow-hidden">
      {/* Top Heritage Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Heritage */}
          <div className="space-y-4">
            <Link to="/menu" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-white font-serif-brand tracking-tight block">
                  {settings.name || 'Royal Taste'}
                </span>
                <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">
                  Bistro & Fine Dining
                </span>
              </div>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Experience the pinnacle of royal Indian culinary artistry. Handcrafted tandoori delicacies, slow-cooked gravies, and seamless contactless table ordering.
            </p>

            {/* Hygiene & Certification Badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FSSAI Certified Kitchen</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>4.8★ Top Rated</span>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/menu"
                  className="hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-600">›</span>
                  <span>Artisanal Food Menu</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/reservation"
                  className="hover:text-amber-400 transition-colors flex items-center gap-2 text-amber-300 font-semibold"
                >
                  <span className="text-amber-500">›</span>
                  <span>Advance Table Pre-Booking</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                    Online
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-600">›</span>
                  <span>Customer Reviews & Ratings</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-600">›</span>
                  <span>Contact & Table Directions</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="hover:text-amber-400 transition-colors flex items-center gap-2"
                >
                  <span className="text-amber-600">›</span>
                  <span>My Active Orders & Bills</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-amber-400 transition-colors flex items-center gap-2 text-neutral-400"
                >
                  <span className="text-neutral-500">›</span>
                  <span>Diner Sign In / Register</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Dining Hours & Ambience */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Dining Hours & Atmosphere
            </h3>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-200 block">Lunch Seating</span>
                  <span>12:00 PM – 03:30 PM (Daily)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-200 block">Dinner & Rooftop</span>
                  <span>07:00 PM – 11:30 PM (Daily)</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-neutral-400 space-y-1 border-t border-neutral-800">
                <p>✓ Valet Parking Available</p>
                <p>✓ 100% Halal & Pure Vegetarian Options</p>
                <p>✓ Rooftop & AC Family Lounge</p>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Reservations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Reach Out & Bookings
            </h3>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>
                  {settings.address || '42 Heritage Boulevard, Near City Centre, Civil Lines'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`tel:${settings.phone || '+91 98765 43210'}`}
                  className="hover:text-white font-mono text-neutral-200 transition-colors"
                >
                  {settings.phone || '+91 98765 43210'}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${settings.email || 'contact@royaltaste.com'}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.email || 'contact@royaltaste.com'}
                </a>
              </div>

              {/* Direct WhatsApp Chat Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hello Royal Taste Bistro! I would like to inquire about table booking & dining.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Staff Login Link */}
        <div className="mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {currentYear} {settings.name || 'Royal Taste'} Bistro. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">FSSAI Lic. No. 11523998000421</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/reviews"
              className="hover:text-neutral-300 transition-colors"
            >
              Guest Reviews
            </Link>
            <span>·</span>
            <Link
              to="/contact"
              className="hover:text-neutral-300 transition-colors"
            >
              Contact Us
            </Link>
            <span>·</span>
            {/* Staff & Admin Access option in Login */}
            <Link
              to="/login?mode=admin"
              className="flex items-center gap-1 text-neutral-400 hover:text-amber-400 transition-colors"
              title="Restaurant Staff & Administrator Login"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500 hover:text-amber-400" />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
