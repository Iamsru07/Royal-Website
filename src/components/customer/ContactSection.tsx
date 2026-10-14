import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Car,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export const ContactSection: React.FC = () => {
  const { settings } = useRestaurant();

  return (
    <section className="mt-8 mb-12 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-150 shadow-xs space-y-8 overflow-hidden relative">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-neutral-100 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-900 border border-emerald-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Visit Us & Concierge Services</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-brand text-neutral-900 tracking-tight">
            Plan Your Visit or Connect with Our Hosts
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Whether you are joining us for an intimate family dinner, reserving our Rooftop VIP Deck, or inquiring about private banquets, our hospitality team is ready to serve you.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(
              'Hello Royal Taste Bistro! I would like to inquire about table booking & dining.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <span>Full Contact & Inquiry Page</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </div>

      {/* 4 Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Direct Phone Call */}
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <Phone className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
            Direct Helpline
          </span>
          <a
            href={`tel:${settings.phone || '+91 98765 43210'}`}
            className="text-sm font-bold text-neutral-900 hover:text-amber-700 transition-colors font-mono block"
          >
            {settings.phone || '+91 98765 43210'}
          </a>
          <span className="text-[11px] text-neutral-500 block">
            Dine-in inquiries & modifications
          </span>
        </div>

        {/* Card 2: Operating Hours */}
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
            Operating Hours
          </span>
          <span className="text-sm font-bold text-neutral-900 block">
            12:00 PM – 11:30 PM
          </span>
          <span className="text-[11px] text-neutral-500 block">
            Lunch & Dinner (7 Days Open)
          </span>
        </div>

        {/* Card 3: Free Valet */}
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
            <Car className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
            Parking & Valet
          </span>
          <span className="text-sm font-bold text-neutral-900 block">
            Complimentary Valet
          </span>
          <span className="text-[11px] text-neutral-500 block">
            At restaurant main portico
          </span>
        </div>

        {/* Card 4: Advance Reservation */}
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
            <CalendarDays className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
            Online Pre-Booking
          </span>
          <Link
            to="/reservation"
            className="text-sm font-bold text-emerald-800 hover:text-emerald-900 transition-colors block"
          >
            Pay ₹{settings.reservationFeePerBooking || 99} Advance ›
          </Link>
          <span className="text-[11px] text-neutral-500 block">
            Guarantees zero waiting line
          </span>
        </div>
      </div>

      {/* Address & Visual Map Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800">
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Heritage Location & Directions</span>
          </div>

          <h3 className="text-xl font-bold font-serif-brand text-white">
            {settings.name || 'Royal Taste'} Bistro & Dining Lounge
          </h3>

          <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
            {settings.address || '42, Heritage Boulevard, Civil Lines, Opposite Victoria Arch, City Center, 400001'}
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400 pt-1">
            <span>📍 Landmark: Opposite Victoria Arch</span>
            <span>•</span>
            <span>🚇 Metro: 5 mins walk</span>
            <span>•</span>
            <span>♿ Wheelchair Accessible</span>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              `${settings.name || 'Royal Taste'} ${settings.address || 'Civil Lines'}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>

          <Link
            to="/contact"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl text-xs border border-neutral-700 transition-colors"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Send Us an Inquiry</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
