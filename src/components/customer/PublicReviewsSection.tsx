import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  UtensilsCrossed,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { INITIAL_PUBLIC_REVIEWS, PublicReview } from '../../data/publicReviews';

export const PublicReviewsSection: React.FC = () => {
  const [reviews] = useState<PublicReview[]>(() => {
    try {
      const saved = localStorage.getItem('royal_taste_user_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_PUBLIC_REVIEWS];
      }
    } catch {}
    return INITIAL_PUBLIC_REVIEWS;
  });

  const [activePlatformFilter, setActivePlatformFilter] = useState<'All' | 'Google Reviews' | 'Zomato Gold' | 'TripAdvisor'>('All');

  const filtered = reviews.filter((r) => {
    if (activePlatformFilter === 'All') return true;
    return r.platform === activePlatformFilter;
  });

  return (
    <section className="mt-14 mb-8 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-150 shadow-xs space-y-8 overflow-hidden relative">
      {/* Top Banner & Trust Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-neutral-100 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Public Diners Voice · 1,840+ Verified Reviews</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-brand text-neutral-900 tracking-tight">
            Loved by Connoisseurs & Families Across India
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Read unfiltered opinions from real diners who have dined at Royal Taste. Discover what fellow guests love about our slow-cooked tandoori recipes, serene rooftop ambience, and advance table pre-booking.
          </p>
        </div>

        {/* Aggregate Badges & CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-base font-serif-brand">
              4.8
            </div>
            <div className="text-left text-xs leading-tight">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-neutral-500 font-medium block mt-0.5">
                Top Rated on Google & Zomato
              </span>
            </div>
          </div>

          <Link
            to="/reviews"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs"
          >
            <span>View All Public Reviews</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </div>

      {/* Platform Tabs Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl overflow-x-auto text-xs">
          {(['All', 'Google Reviews', 'Zomato Gold', 'TripAdvisor'] as const).map((plat) => (
            <button
              key={plat}
              onClick={() => setActivePlatformFilter(plat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activePlatformFilter === plat
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>

        <Link
          to="/reviews"
          className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write a Public Review</span>
        </Link>
      </div>

      {/* Featured Public Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.slice(0, 6).map((rev) => (
          <div
            key={rev.id}
            className="bg-neutral-50/70 hover:bg-white rounded-3xl p-5 border border-neutral-200/70 hover:border-amber-400/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
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
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{rev.city || 'Verified Diner'}</span>
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-700 shadow-2xs whitespace-nowrap">
                  {rev.platform}
                </span>
              </div>

              {/* Stars & Title */}
              <div>
                <div className="flex items-center gap-1 mb-1">
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
                <h3 className="text-xs font-bold text-neutral-900 leading-snug">
                  "{rev.title}"
                </h3>
              </div>

              {/* Comment */}
              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-4">
                {rev.comment}
              </p>
            </div>

            {/* Bottom: Recommended Dishes & Occasion */}
            <div className="pt-3 border-t border-neutral-200/60 space-y-2">
              <div className="flex flex-wrap gap-1">
                {rev.recommendedDishes.map((dish) => (
                  <span
                    key={dish}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] font-medium text-neutral-800"
                  >
                    <UtensilsCrossed className="w-2.5 h-2.5 text-amber-600" />
                    <span>{dish}</span>
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>{rev.occasion}</span>
                <span className="font-mono">{rev.diningDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-0.5 text-center sm:text-left">
          <span className="text-base font-bold font-serif-brand block">
            Had a Great Meal with Us? Share Your Public Experience!
          </span>
          <span className="text-xs text-amber-100">
            Leave a verified dining review and help fellow foodies find their next favorite dish.
          </span>
        </div>

        <Link
          to="/reviews"
          className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          ★ Write a Public Review
        </Link>
      </div>
    </section>
  );
};
