import React, { useRef } from 'react';
import { FoodCategory } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryTabsProps {
  categories: FoodCategory[];
  activeCategory: FoodCategory;
  onSelectCategory: (category: FoodCategory) => void;
  categoryCounts?: Record<string, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-white/95 backdrop-blur-xs py-2.5 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5">
        {/* Left Scroll arrow for desktop */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors shrink-0"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const count = categoryCounts ? categoryCounts[category] : undefined;

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`whitespace-nowrap px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200/60'
                }`}
              >
                <span>{category}</span>
                {typeof count === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-200/80 text-neutral-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll arrow for desktop */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors shrink-0"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
