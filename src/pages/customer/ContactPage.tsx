import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Car,
  UtensilsCrossed,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Modal } from '../../components/common/Modal';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useRestaurant();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Table Pre-Booking Query');
  const [guestsCount, setGuestsCount] = useState('2-4 Guests');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Confirmation Modal
  const [submittedInquiry, setSubmittedInquiry] = useState<{
    refId: string;
    name: string;
    phone: string;
    type: string;
  } | null>(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the online Table Pre-Booking deposit work?',
      a: `When you reserve a table on our website, a deposit of ₹${settings.reservationFeePerBooking || 99} is paid strictly online. This reserves your table, alerts our host 30 minutes before your arrival, and the full ₹${settings.reservationFeePerBooking || 99} is credited directly against your final dining bill.`,
    },
    {
      q: 'Do you offer pure vegetarian, Jain, or Halal dining options?',
      a: 'Absolutely! Our kitchen maintains dedicated vegetarian tandoors and preparation stations. Jain preparations (without onion/garlic) are freshly crafted upon request.',
    },
    {
      q: 'Is valet parking available at the restaurant?',
      a: 'Yes, we provide complimentary secure valet parking for all our dine-in guests right at the restaurant entrance.',
    },
    {
      q: 'Can we book the Rooftop Star Deck for private birthday or corporate parties?',
      a: 'Yes! Our Rooftop Star Deck and Royal AC Lounge can be reserved for private gatherings of 15 to 50 guests. Please submit an inquiry below or chat with us on WhatsApp.',
    },
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (phone.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!message.trim()) {
      showToast('Please write your message or inquiry', 'error');
      return;
    }

    setIsSubmitting(true);

    const refId = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;

    const inquiryRecord = {
      refId,
      name: name.trim(),
      phone: `+91 ${phone}`,
      email: email.trim() || undefined,
      inquiryType,
      guestsCount,
      message: message.trim(),
      date: new Date().toLocaleString(),
    };

    // Save to localStorage
    try {
      const existing = localStorage.getItem('royal_taste_inquiries');
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem('royal_taste_inquiries', JSON.stringify([inquiryRecord, ...list]));
    } catch (err) {
      console.warn('Storage error:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedInquiry({
        refId,
        name: name.trim(),
        phone: `+91 ${phone}`,
        type: inquiryType,
      });

      showToast(`Inquiry #${refId} received! Our team will contact you shortly. ✓`, 'success');

      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hospitality & Reservations Concierge</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif-brand tracking-tight">
            Contact & Directions
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
            We are here to assist you with table bookings, bespoke family celebrations, private dining lounges, or any queries regarding our royal culinary menus.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                'Hello Royal Taste Bistro! I would like to inquire about table booking & dining.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Chat</span>
            </a>

            <Link
              to="/reservation"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Pre-Book Table (₹{settings.reservationFeePerBooking || 99})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Feature Contact Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Phone */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
              Phone Helpline
            </span>
            <a
              href={`tel:${settings.phone || '+91 98765 43210'}`}
              className="text-sm font-bold text-neutral-900 hover:text-amber-600 transition-colors font-mono block mt-0.5"
            >
              {settings.phone || '+91 98765 43210'}
            </a>
            <span className="text-[11px] text-neutral-500 block">
              11:00 AM – 11:30 PM (Daily)
            </span>
          </div>
        </div>

        {/* Card 2: WhatsApp */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
              WhatsApp Concierge
            </span>
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                'Hello Royal Taste Bistro! I would like to inquire about table booking & dining.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors block mt-0.5"
            >
              Chat on WhatsApp ›
            </a>
            <span className="text-[11px] text-neutral-500 block">Instant answers & booking</span>
          </div>
        </div>

        {/* Card 3: Timings */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
              Dining Hours
            </span>
            <span className="text-sm font-bold text-neutral-900 block mt-0.5">
              12:00 PM – 11:30 PM
            </span>
            <span className="text-[11px] text-neutral-500 block">Open 7 days a week</span>
          </div>
        </div>

        {/* Card 4: Location */}
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
              Valet & Parking
            </span>
            <span className="text-sm font-bold text-neutral-900 block mt-0.5">
              Free Valet Parking
            </span>
            <span className="text-[11px] text-neutral-500 block">Entrance drive-in</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Inquiry Form + Map & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Interactive Contact / Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold font-serif-brand text-neutral-900">
              Send an Inquiry or Feedback
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Have questions about private banquets, large family reservations, or catering? Fill out the details below.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 text-xs sm:text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Mobile Number (10 Digits) *
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
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-11 pr-3.5 py-2.5 bg-neutral-50 text-xs sm:text-sm font-mono rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 text-xs sm:text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Inquiry Topic *
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 text-xs sm:text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                >
                  <option value="Table Pre-Booking Query">Table Pre-Booking Query</option>
                  <option value="Birthday / Anniversary Celebration">Birthday / Anniversary Celebration</option>
                  <option value="Private Banquet (15-50 guests)">Private Banquet (15-50 guests)</option>
                  <option value="Outdoor Catering Inquiry">Outdoor Catering Inquiry</option>
                  <option value="Feedback / Compliment">Feedback / Compliment</option>
                  <option value="Other Inquiries">Other Inquiries</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Estimated Party Size
              </label>
              <div className="flex flex-wrap gap-2">
                {['1-2 Guests', '2-4 Guests', '5-8 Guests', '9-15 Guests', '15+ Banquet'].map(
                  (size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setGuestsCount(size)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        guestsCount === size
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Your Message / Specific Requirements *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Mention preferred date, seating preference (Rooftop, Family Lounge, Ground Bistro), dietary requirements, or any questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 text-xs sm:text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting Inquiry...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Submit Inquiry to Concierge</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column (5 cols): Map Preview, Address & FAQ */}
        <div className="lg:col-span-5 space-y-6">
          {/* Location & Map Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-neutral-900 font-serif-brand">
              <MapPin className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold">Restaurant Location & Address</h2>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-xs space-y-2">
              <p className="font-bold text-neutral-900 leading-snug">
                {settings.name || 'Royal Taste'} Heritage Bistro & Lounge
              </p>
              <p className="text-neutral-600 leading-relaxed">
                {settings.address || '42, Heritage Boulevard, Civil Lines, Opposite Victoria Arch, City Center, 400001'}
              </p>
              <div className="pt-2 border-t border-neutral-200/70 flex flex-wrap gap-2 text-[11px] text-neutral-500">
                <span>📍 Landmark: Near City Heritage Arch</span>
                <span>•</span>
                <span>🚇 Metro Station: 5 mins walk</span>
              </div>
            </div>

            {/* Stylized Map View Box */}
            <div className="h-44 rounded-2xl bg-neutral-900 text-white relative overflow-hidden border border-neutral-800 flex items-center justify-center p-4">
              {/* Background Map Visual Pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#amber-400_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-neutral-950 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif-brand font-bold text-sm block">
                    Royal Taste Heritage Dining
                  </span>
                  <span className="text-[11px] text-neutral-400 block">
                    Civil Lines · MG Road Axis
                  </span>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${settings.name || 'Royal Taste'} ${settings.address || 'Civil Lines'}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-[11px] rounded-xl border border-neutral-700 transition-colors shadow-2xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/reservation"
                className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <CalendarDays className="w-4 h-4 text-amber-700" />
                <span>Reserve a Table Online (Advance Fee ₹{settings.reservationFeePerBooking || 99})</span>
              </Link>
            </div>
          </div>

          {/* Quick FAQ Section */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-neutral-900 font-serif-brand">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-2 text-xs">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div
                    key={idx}
                    className="border border-neutral-200/80 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left font-bold text-neutral-800 hover:text-amber-800 flex items-center justify-between gap-2 cursor-pointer bg-neutral-50/50"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-amber-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-3.5 bg-white border-t border-neutral-100 text-neutral-600 text-[11px] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {submittedInquiry && (
        <Modal
          isOpen={!!submittedInquiry}
          onClose={() => setSubmittedInquiry(null)}
          title="Inquiry Received Successfully!"
          subtitle="Our guest relations host will review your request and get back to you."
          maxWidth="sm"
        >
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
                Reference ID
              </span>
              <span className="text-xl font-bold font-mono text-neutral-900 block mt-0.5">
                {submittedInquiry.refId}
              </span>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-left space-y-1.5 text-neutral-700">
              <div className="flex justify-between">
                <span className="text-neutral-500">Guest Name:</span>
                <span className="font-bold">{submittedInquiry.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Contact Number:</span>
                <span className="font-mono font-bold">{submittedInquiry.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Inquiry Type:</span>
                <span className="font-semibold text-amber-800">{submittedInquiry.type}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              For urgent table modifications or same-day bookings, you can also connect directly on WhatsApp.
            </p>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSubmittedInquiry(null)}
                className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
