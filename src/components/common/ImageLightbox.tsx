import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  images?: string[];
  initialIndex?: number;
  title: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  imageUrl,
  images,
  initialIndex = 0,
  title,
  onClose,
}) => {
  const allImages = images && images.length > 0 ? images : [imageUrl];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sync index when lightbox opens
  useEffect(() => {
    if (isOpen) {
      const idx = initialIndex >= 0 && initialIndex < allImages.length ? initialIndex : 0;
      setCurrentIndex(idx);
    }
  }, [isOpen, initialIndex, allImages.length]);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scrolling while lightbox is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight' && allImages.length > 1) {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      } else if (e.key === 'ArrowLeft' && allImages.length > 1) {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, allImages.length]);

  if (!isOpen) return null;

  const currentImage = allImages[currentIndex] || imageUrl;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || allImages.length <= 1) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 40) {
      // Swiped right -> prev
      setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    } else if (diff < -40) {
      // Swiped left -> next
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }
    setTouchStartX(null);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image lightbox`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Accessible Close (X) button in top-right corner */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close image"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-neutral-900/80 hover:bg-neutral-900 active:scale-95 text-white/90 hover:text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
      </button>

      {/* Prev Navigation Button if multiple images */}
      {allImages.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous image"
          className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-neutral-900/80 hover:bg-neutral-900 active:scale-95 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Next Navigation Button if multiple images */}
      {allImages.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next image"
          className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-neutral-900/80 hover:bg-neutral-900 active:scale-95 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Centered Image Container - clicks inside do not close the lightbox */}
      <div
        className="relative max-w-full max-h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-neutral-900/60 border border-white/10 flex items-center justify-center">
          <img
            key={currentImage}
            src={currentImage}
            alt={`${title} - image ${currentIndex + 1} of ${allImages.length}`}
            referrerPolicy="no-referrer"
            className="max-h-[76vh] sm:max-h-[80vh] max-w-[92vw] sm:max-w-[85vw] md:max-w-4xl w-auto h-auto object-contain rounded-2xl select-none"
          />
        </div>

        {/* Dish Title & Image Counter Caption */}
        <div className="mt-3 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/15 max-w-[90vw] shadow-lg">
          <p className="text-white/95 font-serif-brand font-medium text-xs sm:text-sm tracking-wide truncate text-center">
            {title}
          </p>
          {allImages.length > 1 && (
            <span className="text-[11px] font-mono text-amber-400 font-semibold shrink-0 bg-white/10 px-2 py-0.5 rounded-full">
              {currentIndex + 1} / {allImages.length}
            </span>
          )}
        </div>

        {/* Dot Indicators if multiple images */}
        {allImages.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Jump to image ${idx + 1}`}
                className={`transition-all duration-200 rounded-full h-1.5 ${
                  currentIndex === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
