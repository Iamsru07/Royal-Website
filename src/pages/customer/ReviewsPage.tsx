import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Calendar,
  UtensilsCrossed,
  Filter,
  Plus,
  Sparkles,
  Award,
  Heart,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Smile,
  Search,
  MapPin,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Modal } from '../../components/common/Modal';
import { INITIAL_PUBLIC_REVIEWS, PublicReview } from '../../data/publicReviews';

const POPULAR_DISH_SUGGESTIONS = [
  'Paneer Tikka',
  'Dal Makhani',
  'Mutton Dum Biryani',
  'Butter Chicken',
  'Garlic Naan',
  'Gulab Jamun with Rabri',
  'Crispy Corn Chaat',
  'Virgin Mojito',
  'Chicken Tikka Masala',
  'Shahi Tukda',
];

const OCCASIONS = [
  'Family Dinner',
  'Anniversary Celebration',
  'Birthday Party',
  'Romantic Rooftop',
  'Corporate Lunch',
  'Weekend Feast',
  'Casual Dining',
];

export const ReviewsPage: React.FC = () => {
  const { showToast, settings } = useRestaurant();

  // Reviews state with localStorage persistence
  const [reviews, setReviews] = useState<PublicReview[]>(() => {
    try {
      const saved = localStorage.getItem('royal_taste_user_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_PUBLIC_REVIEWS];
      }
    } catch {}
    return INITIAL_PUBLIC_REVIEWS;
  });

  // Search, Platform Filter & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'All' | 'Google Reviews' | 'Zomato Gold' | 'TripAdvisor' | 'Dineout'>('All');
  const [starFilter, setStarFilter] = useState<'All' | '5 Stars' | '4+ Stars'>('All');
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'highest'>('helpful');

  // Helpful click tracking
  const [helpfulGiven, setHelpfulGiven] = useState<string[]>([]);

  // Modal State
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formPlatform, setFormPlatform] = useState<PublicReview['platform']>('Verified Diner');
  const [formOccasion, setFormOccasion] = useState('Family Dinner');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formDishes, setFormDishes] = useState<string[]>(['Paneer Tikka', 'Dal Makhani']);
  const [formTable, setFormTable] = useState('12');

  // Filter & Search Logic
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        // Platform filter
        if (platformFilter !== 'All' && r.platform !== platformFilter) {
          return false;
        }

        // Star filter
        if (starFilter === '5 Stars' && r.rating !== 5) return false;
        if (starFilter === '4+ Stars' && r.rating < 4) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchAuthor = r.authorName.toLowerCase().includes(q);
          const matchCity = r.city.toLowerCase().includes(q);
          const matchTitle = r.title.toLowerCase().includes(q);
          const matchComment = r.comment.toLowerCase().includes(q);
          const matchDish = r.recommendedDishes.some((d) => d.toLowerCase().includes(q));
          const matchOccasion = r.occasion.toLowerCase().includes(q);

          if (!matchAuthor && !matchCity && !matchTitle && !matchComment && !matchDish && !matchOccasion) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
        if (sortBy === 'highest') return b.rating - a.rating;
        // 'recent' fallback
        return 0;
      });
  }, [reviews, platformFilter, starFilter, searchQuery, sortBy]);

  // Overall Statistics
  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const fourStarCount = reviews.filter((r) => r.rating === 4).length;
  const fiveStarPct = Math.round((fiveStarCount / reviews.length) * 100);
  const fourStarPct = Math.round((fourStarCount / reviews.length) * 100);

  const handleHelpfulClick = (id: string) => {
    if (helpfulGiven.includes(id)) {
      showToast('You already voted this public review helpful', 'info');
      return;
    }
    setHelpfulGiven((prev) => [...prev, id]);
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    showToast('Marked as helpful! Thank you. ✓', 'success');
  };

  const handleToggleDish = (dish: string) => {
    setFormDishes((prev) =>
      prev.includes(dish) ? prev.filter((d) => d !== dish) : [...prev, dish]
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!formComment.trim()) {
      showToast('Please write your dining feedback', 'error');
      return;
    }

    const newReview: PublicReview = {
      id: `pub-rev-${Date.now()}`,
      authorName: formName.trim(),
      city: formCity.trim() || 'Verified Diner',
      avatarBg: 'bg-amber-100 text-amber-900',
      platform: formPlatform,
      rating: formRating,
      diningDate: 'Just now',
      title: formTitle.trim() || 'Exceptional Dining Experience',
      comment: formComment.trim(),
      recommendedDishes: formDishes,
      occasion: formOccasion,
      helpfulCount: 1,
      isVerifiedDiner: true,
      tableNumber: formTable.trim() || undefined,
      diningZone: 'Dine-In Guest',
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);

    // Save user-submitted public reviews
    try {
      const userCreated = updated.filter(
        (r) => !INITIAL_PUBLIC_REVIEWS.some((init) => init.id === r.id)
      );
      localStorage.setItem('royal_taste_user_reviews', JSON.stringify(userCreated));
    } catch (err) {
      console.warn('Storage error:', err);
    }

    showToast('Your public review is live! Thank you for sharing. ✓', 'success');
    setIsWriteModalOpen(false);

    // Reset Form
    setFormName('');
    setFormCity('');
    setFormTitle('');
    setFormComment('');
    setFormRating(5);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Public Testimonials & Food Critic Reviews</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif-brand tracking-tight">
            Public Reviews & Ratings
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
            Authentic, verified reviews aggregated from Google Reviews, Zomato Gold, TripAdvisor, and direct in-restaurant diners. See why diners rate us 4.8★ for slow-smoked kebabs, live rooftop seating, and seamless table pre-booking.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Public Review</span>
            </button>

            <Link
              to="/reservation"
              className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs border border-neutral-700 transition-colors"
            >
              <span>Pre-Book Table (Advance Fee ₹{settings.reservationFeePerBooking || 99})</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Aggregate Scorecards & Platform Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Aggregate Rating & Star Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block font-mono">
              Overall Public Rating
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-5xl font-extrabold font-serif-brand text-neutral-900">
                {averageRating}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-neutral-500 font-medium block">
                  Based on 1,840+ Public Diners
                </span>
              </div>
            </div>
          </div>

          {/* Star Distribution */}
          <div className="space-y-2.5 mt-6 pt-5 border-t border-neutral-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-12 font-semibold text-neutral-700">5 Stars</span>
              <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${fiveStarPct}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-neutral-500">{fiveStarPct}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-12 font-semibold text-neutral-700">4 Stars</span>
              <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${fourStarPct}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-neutral-500">{fourStarPct}%</span>
            </div>
          </div>
        </div>

        {/* Card 2 & 3: Platform Recognition Badges */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 font-serif-brand">
              Recognized Across Dining & Food Platforms
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live ratings synced with Google Business, Zomato Gold, and TripAdvisor
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5">
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Google Reviews</span>
                <span className="text-xl font-bold font-serif-brand text-neutral-900">4.9 ★</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">940+ Reviews</span>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Zomato Gold</span>
                <span className="text-xl font-bold font-serif-brand text-neutral-900">4.8 ★</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Dine-in Choice</span>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">TripAdvisor</span>
                <span className="text-xl font-bold font-serif-brand text-neutral-900">5.0 ★</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Travellers' Choice</span>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Kitchen Hygiene</span>
                <span className="text-xl font-bold font-serif-brand text-neutral-900">5.0 ★</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">FSSAI Certified</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All reviews are genuine, verified & non-incentivized</span>
            </span>
            <span className="text-neutral-400">
              Updated daily from diners across India
            </span>
          </div>
        </div>
      </div>

      {/* Search, Filter Tabs & Sort Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-100 shadow-xs space-y-4">
        {/* Row 1: Search Box & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews by dish (e.g. Biryani, Paneer Tikka), city, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400 shrink-0 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-800 focus:outline-none focus:border-amber-600"
            >
              <option value="helpful">Most Helpful 👍</option>
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating (5★)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Platform Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {(['All', 'Google Reviews', 'Zomato Gold', 'TripAdvisor', 'Dineout'] as const).map(
              (plat) => (
                <button
                  key={plat}
                  onClick={() => setPlatformFilter(plat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    platformFilter === plat
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                  }`}
                >
                  {plat}
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            {(['All', '5 Stars', '4+ Stars'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStarFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  starFilter === st
                    ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Public Reviews Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
          <span>Showing {filteredReviews.length} Verified Public Reviews</span>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="text-amber-700 font-bold hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Your Public Review</span>
          </button>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">No Reviews Matched Your Search</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try searching with another keyword or reset your platform filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPlatformFilter('All');
                setStarFilter('All');
              }}
              className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReviews.map((rev) => {
              const hasVoted = helpfulGiven.includes(rev.id);

              return (
                <article
                  key={rev.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: Avatar, Name, City, Platform Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-2xl font-bold flex items-center justify-center font-serif-brand shrink-0 ${
                            rev.avatarBg || 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {rev.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-neutral-900">
                              {rev.authorName}
                            </span>
                            {rev.isVerifiedDiner && (
                              <span title="Verified Public Diner" className="text-emerald-600 flex items-center">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            <span>{rev.city || 'Verified Diner'}</span>
                            {rev.tableNumber && <span>· Table {rev.tableNumber}</span>}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 shadow-2xs whitespace-nowrap">
                        {rev.platform}
                      </span>
                    </div>

                    {/* Stars & Title */}
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-neutral-200 text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                        "{rev.title}"
                      </h3>
                    </div>

                    {/* Comment */}
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {rev.comment}
                    </p>

                    {/* Recommended Dishes Tags */}
                    {rev.recommendedDishes.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
                          Recommended Dishes
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {rev.recommendedDishes.map((dish) => (
                            <span
                              key={dish}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 text-[11px] font-medium border border-amber-200/80"
                            >
                              <UtensilsCrossed className="w-3 h-3 text-amber-600" />
                              <span>{dish}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer: Occasion & Helpful Counter */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span className="text-[11px] text-neutral-400">{rev.occasion}</span>

                    <button
                      onClick={() => handleHelpfulClick(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        hasVoted
                          ? 'bg-amber-100 text-amber-900 font-bold'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: Write a Public Review */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        title="Write a Public Review"
        subtitle="Your review will be published publicly on our platform to help other guests discover great food."
        maxWidth="md"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              Your Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (formHoverRating || formRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setFormHoverRating(star)}
                      onMouseLeave={() => setFormHoverRating(0)}
                      onClick={() => setFormRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-neutral-200 text-neutral-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold font-mono text-neutral-700 ml-2">
                {formRating === 5 && 'Outstanding ★★★★★'}
                {formRating === 4 && 'Very Good ★★★★☆'}
                {formRating === 3 && 'Average ★★★☆☆'}
                {formRating === 2 && 'Needs Improvement ★★☆☆☆'}
                {formRating === 1 && 'Disappointing ★☆☆☆☆'}
              </span>
            </div>
          </div>

          {/* Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Aarav Mehta"
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                City / Location *
              </label>
              <input
                type="text"
                required
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="e.g. Bandra, Mumbai or Civil Lines"
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Platform Tag & Occasion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Review Source / Platform
              </label>
              <select
                value={formPlatform}
                onChange={(e) => setFormPlatform(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
              >
                <option value="Google Reviews">Google Reviews</option>
                <option value="Zomato Gold">Zomato Gold</option>
                <option value="TripAdvisor">TripAdvisor</option>
                <option value="Dineout">Dineout</option>
                <option value="Verified Diner">Verified In-Restaurant Diner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Dining Occasion
              </label>
              <select
                value={formOccasion}
                onChange={(e) => setFormOccasion(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
              >
                {OCCASIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Review Headline *
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Sublime Paneer Tikka & swift table service"
              className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Public Feedback & Comments *
            </label>
            <textarea
              required
              rows={3}
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder="Share what you loved about the food taste, atmosphere, staff attentiveness, or speed..."
              className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 focus:bg-white resize-none"
            />
          </div>

          {/* Favorite Dishes Multi-Select */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Which dishes did you enjoy the most? (Click to tag)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_DISH_SUGGESTIONS.map((dish) => {
                const isSelected = formDishes.includes(dish);
                return (
                  <button
                    type="button"
                    key={dish}
                    onClick={() => handleToggleDish(dish)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {dish} {isSelected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Publish Public Review ✓
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
