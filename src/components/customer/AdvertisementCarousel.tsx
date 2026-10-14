import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Tag,
  ArrowRight,
  Copy,
  Check,
  Hand,
} from 'lucide-react';
import { AdvertisementBanner, FoodCategory } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';

interface AdvertisementCarouselProps {
  advertisements: AdvertisementBanner[];
  onSelectCategory?: (category: FoodCategory) => void;
}

export const AdvertisementCarousel: React.FC<AdvertisementCarouselProps> = ({
  advertisements,
  onSelectCategory,
}) => {
  const { showToast } = useRestaurant();
  const activeAds = advertisements.filter((ad) => ad.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Drag and swipe states
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const hasDraggedRef = useRef(false);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide every 5.5 seconds (resets when user interacts)
  const resetAutoSlide = useCallback(() => {
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
    }
    if (activeAds.length > 1) {
      autoSlideTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activeAds.length);
      }, 5500);
    }
  }, [activeAds.length]);

  useEffect(() => {
    resetAutoSlide();
    return () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    };
  }, [resetAutoSlide]);

  if (activeAds.length === 0) return null;

  // Move slide helper
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    resetAutoSlide();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
    resetAutoSlide();
  };

  // --- Touch event handlers (Finger swipe on mobile/tablet) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeAds.length <= 1) return;
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
    hasDraggedRef.current = false;
    setIsDragging(true);
    setDragOffset(0);
    if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startXRef.current;
    const diffY = currentY - startYRef.current;

    // Detect direction on initial movement
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    // Only drag horizontally if user is swiping horizontally (allows normal vertical page scroll)
    if (isHorizontalSwipeRef.current) {
      hasDraggedRef.current = Math.abs(diffX) > 10;
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const swipeThreshold = 50;
    if (dragOffset < -swipeThreshold) {
      nextSlide();
    } else if (dragOffset > swipeThreshold) {
      prevSlide();
    } else {
      resetAutoSlide();
    }
    setDragOffset(0);
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  };

  // --- Mouse drag handlers (Cursor drag on desktop/laptop) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeAds.length <= 1) return;
    // Don't drag if middle or right click
    if (e.button !== 0) return;
    startXRef.current = e.clientX;
    hasDraggedRef.current = false;
    setIsDragging(true);
    setDragOffset(0);
    if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diffX = e.clientX - startXRef.current;
    if (Math.abs(diffX) > 6) {
      hasDraggedRef.current = true;
    }
    setDragOffset(diffX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const swipeThreshold = 50;
    if (dragOffset < -swipeThreshold) {
      nextSlide();
    } else if (dragOffset > swipeThreshold) {
      prevSlide();
    } else {
      resetAutoSlide();
    }
    setDragOffset(0);
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    if (hasDraggedRef.current) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code "${code}" copied! Apply at checkout.`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCtaClick = (e: React.MouseEvent, category?: FoodCategory) => {
    e.stopPropagation();
    if (hasDraggedRef.current) return;
    if (category && onSelectCategory) {
      onSelectCategory(category);
      showToast(`Showing ${category} menu`, 'info');
    }
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden shadow-xl border border-neutral-800 bg-neutral-950 select-none ${
        activeAds.length > 1 ? 'cursor-grab active:cursor-grabbing touch-pan-y' : ''
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sliding Carousel Track (smooth transitions + finger/cursor drag following) */}
      <div
        className="flex w-full will-change-transform"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          transition: isDragging ? 'none' : 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {activeAds.map((ad, index) => (
          <div
            key={ad.id}
            className={`min-w-full w-full shrink-0 relative min-h-[220px] sm:min-h-[260px] md:min-h-[280px] flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-r ${ad.bgGradient}`}
          >
            {/* Background Backdrop Image */}
            {ad.imageUrl && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  draggable={false}
                  className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
              </div>
            )}

            {/* Content Box */}
            <div className="relative z-10 max-w-xl text-white pointer-events-auto">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/25 border border-amber-400/40 text-amber-300 backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{ad.badge}</span>
                </span>

                {ad.couponCode && (
                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(e, ad.couponCode!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 text-white transition-colors backdrop-blur-xs cursor-pointer"
                    title="Click to copy promo coupon"
                  >
                    <Tag className="w-3 h-3 text-amber-400" />
                    <span>CODE: {ad.couponCode}</span>
                    {copiedCode === ad.couponCode ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-neutral-400" />
                    )}
                  </button>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif-brand tracking-tight text-white mb-2 leading-tight">
                {ad.title}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-6 line-clamp-2 sm:line-clamp-3">
                {ad.subtitle}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => handleCtaClick(e, ad.targetCategory)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer group/btn"
                >
                  <span>{ad.ctaText || 'View Featured Dishes'}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-950 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {ad.couponCode && (
                  <span className="hidden sm:inline text-[11px] text-neutral-400 font-medium">
                    Tap code to copy
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Dots Indicator & Swipe Hint (No < > arrows) */}
            <div className="relative z-10 flex items-center justify-between pt-4 mt-2 border-t border-white/10 pointer-events-auto">
              <div className="flex items-center gap-2">
                {activeAds.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(dotIdx);
                      resetAutoSlide();
                    }}
                    className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                      dotIdx === currentIndex
                        ? 'w-7 bg-amber-400 shadow-xs shadow-amber-400/50'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
                <span className="text-[11px] text-neutral-400 font-mono ml-2">
                  {currentIndex + 1} / {activeAds.length}
                </span>
              </div>

              {/* Gentle swipe prompt for finger/cursor hint */}
              {activeAds.length > 1 && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-200/80 font-medium tracking-wide">
                  <Hand className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                  <span className="hidden xs:inline">Slide with finger or cursor</span>
                  <span className="xs:hidden">Slide</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
