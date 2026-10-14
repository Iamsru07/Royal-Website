import React, { useState, useEffect, useRef } from 'react';
import { Clock, Plus, Minus, Flame, Sparkles, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { FoodItem } from '../../types';
import { VegNonVegBadge } from '../common/StatusBadge';
import { useRestaurant } from '../../context/RestaurantContext';
import { ImageLightbox } from '../common/ImageLightbox';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { cart, addToCart, updateCartQuantity } = useRestaurant();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Multi-image list - sanitized
  const rawImages = food.images && food.images.length > 0 ? food.images : [food.imageUrl];
  const images = rawImages.filter((img) => typeof img === 'string' && img.trim().length > 0);
  if (images.length === 0) images.push(food.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80');

  const hasMultipleImages = images.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Ensure safe activeIndex within bounds
  const activeIndex = ((currentIndex % images.length) + images.length) % images.length;

  const startPosRef = useRef({ x: 0, y: 0, time: 0 });
  const isInteractingRef = useRef(false);
  const didDragRef = useRef(false);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide every 4 seconds if multiple images are present
  const resetAutoSlide = () => {
    if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    if (hasMultipleImages && !isLightboxOpen) {
      autoSlideTimerRef.current = setInterval(() => {
        if (!isInteractingRef.current && !isHovered) {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }
      }, 4000);
    }
  };

  useEffect(() => {
    resetAutoSlide();
    return () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    };
  }, [hasMultipleImages, isLightboxOpen, images.length, isHovered]);

  // Pointer Events: Unifies touch on mobile and mouse cursor on desktop
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    startPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    isInteractingRef.current = true;
    didDragRef.current = false;
    setDragOffset(0);

    if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractingRef.current || !hasMultipleImages) return;

    const diffX = e.clientX - startPosRef.current.x;
    const diffY = e.clientY - startPosRef.current.y;

    // Detect intentional horizontal drag
    if (!didDragRef.current && Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
      didDragRef.current = true;
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {}
    }

    if (didDragRef.current) {
      setDragOffset(diffX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractingRef.current) return;
    isInteractingRef.current = false;

    const diffX = e.clientX - startPosRef.current.x;
    const diffY = e.clientY - startPosRef.current.y;
    const totalDist = Math.hypot(diffX, diffY);
    const duration = Date.now() - startPosRef.current.time;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    setIsDragging(false);
    setDragOffset(0);

    // If it was a genuine swipe (> 30px)
    if (didDragRef.current && Math.abs(diffX) > 30) {
      if (diffX > 30) {
        // Swiped right -> prev (loops seamlessly)
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else {
        // Swiped left -> next (loops seamlessly)
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
      resetAutoSlide();
      return;
    }

    // If movement was small (<= 14px) and quick, open Lightbox directly
    if (totalDist <= 14 && duration < 600) {
      setIsLightboxOpen(true);
    }

    resetAutoSlide();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    isInteractingRef.current = false;
    didDragRef.current = false;
    setIsDragging(false);
    setDragOffset(0);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
    resetAutoSlide();
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // If pointerUp didn't already open it or if dragged, handle clean click
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsLightboxOpen(true);
  };

  const cartItem = cart.find((item) => item.food.id === food.id);
  const isOutOfStock = food.availability === 'OUT OF STOCK';

  return (
    <>
      <div
        className={`group flex flex-col justify-between bg-white rounded-2xl border border-neutral-100/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden ${
          isOutOfStock ? 'opacity-75' : ''
        }`}
      >
        <div>
          {/* Food Image Container with Slide Support */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`View larger image of ${food.name}`}
            onClick={handleImageClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsLightboxOpen(true);
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              if (isInteractingRef.current) {
                isInteractingRef.current = false;
                didDragRef.current = false;
                setIsDragging(false);
                setDragOffset(0);
              }
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className={`relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 select-none touch-pan-y ${
              hasMultipleImages
                ? isDragging
                  ? 'cursor-grabbing'
                  : 'cursor-grab'
                : 'cursor-pointer'
            } group/image focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500`}
          >
            {/* Image Track for slide animation */}
            <div
              className="w-full h-full flex"
              style={{
                transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 320ms cubic-bezier(0.2, 0, 0, 1)',
              }}
            >
              {images.map((imgSrc, idx) => (
                <div key={idx} className="w-full h-full shrink-0 relative bg-neutral-100">
                  <img
                    src={imgSrc}
                    alt={`${food.name} - view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback image if broken
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 pointer-events-none select-none"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {/* Subtle hover overlay to indicate image is clickable */}
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-200 pointer-events-none" />

            {/* Hover arrows for quick sliding on desktop */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                    resetAutoSlide();
                  }}
                  aria-label="Previous photo"
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/55 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover:opacity-95 hover:scale-110 transition-all cursor-pointer backdrop-blur-xs shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev + 1) % images.length);
                    resetAutoSlide();
                  }}
                  aria-label="Next photo"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-black/55 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover:opacity-95 hover:scale-110 transition-all cursor-pointer backdrop-blur-xs shadow-md"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Pagination Dots for multiple images */}
            {hasMultipleImages && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs pointer-events-auto">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                      resetAutoSlide();
                    }}
                    aria-label={`Jump to photo ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      activeIndex === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Image Counter Badge for multiple images */}
            {hasMultipleImages && (
              <div className="absolute bottom-2.5 right-2.5 z-10 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono font-medium text-white pointer-events-none">
                {activeIndex + 1}/{images.length}
              </div>
            )}

            {/* Floating Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none z-10">
              <VegNonVegBadge type={food.foodType} />
              {food.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-amber-900 bg-amber-300/95 backdrop-blur-xs rounded-md shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-800" />
                  <span>Chef Special</span>
                </span>
              )}
            </div>

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-20">
                <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-md">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 font-serif-brand leading-snug group-hover:text-amber-800 transition-colors">
                {food.name}
              </h3>
              {food.spicyLevel && food.spicyLevel > 1 && (
                <span
                  className="flex items-center text-red-500 text-[11px] shrink-0"
                  title={`Spicy level: ${food.spicyLevel}/3`}
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-3">
              {food.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{food.prepTimeMinutes} min</span>
              </span>
              {food.calories && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{food.calories} kcal</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer: Price & Add to Cart */}
        <div className="p-4 pt-0 mt-auto flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-semibold text-neutral-900">₹</span>
            <span className="text-lg font-bold text-neutral-900 tabular-nums font-mono">
              {food.price}
            </span>
          </div>

          {isOutOfStock ? (
            <button
              disabled
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-400 bg-neutral-100 rounded-xl cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : cartItem ? (
            /* Quantity Stepper inside card */
            <div className="flex items-center bg-amber-50 border border-amber-300 rounded-xl p-0.5 shadow-xs">
              <button
                onClick={() => updateCartQuantity(food.id, cartItem.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
                aria-label={`Decrease quantity of ${food.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-amber-950 tabular-nums">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateCartQuantity(food.id, cartItem.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
                aria-label={`Increase quantity of ${food.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(food)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox modal with multiple image support */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        imageUrl={images[activeIndex] || food.imageUrl}
        images={images}
        initialIndex={activeIndex}
        title={food.name}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
};

