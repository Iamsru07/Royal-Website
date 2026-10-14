import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, Filter, ShoppingBag, ArrowRight } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { FoodCategory, FoodItem } from '../../types';
import { CategoryTabs } from '../../components/customer/CategoryTabs';
import { FoodCard } from '../../components/customer/FoodCard';
import { EmptyState } from '../../components/common/EmptyState';
import { AdvertisementCarousel } from '../../components/customer/AdvertisementCarousel';
import { PublicReviewsSection } from '../../components/customer/PublicReviewsSection';
import { ContactSection } from '../../components/customer/ContactSection';

export const MenuPage: React.FC = () => {
  const {
    foods,
    categories,
    selectedTable,
    totalCartItemsCount,
    cartTotal,
    setIsCartDrawerOpen,
    settings,
    advertisements,
  } = useRestaurant();

  const [activeCategory, setActiveCategory] = useState<FoodCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: foods.length };
    foods.forEach((food) => {
      counts[food.category] = (counts[food.category] || 0) + 1;
    });
    return counts;
  }, [foods]);

  // Filter foods by category, search text, and vegOnly
  const filteredFoods = useMemo(() => {
    return foods.filter((item) => {
      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }
      // Veg filter
      if (vegOnly && item.foodType !== 'veg') {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [foods, activeCategory, vegOnly, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Restaurant Table Banner Hero */}
      <section className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-neutral-800">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Table {selectedTable} Service</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif-brand tracking-tight mb-2">
            {settings.name}
          </h1>
          <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-lg mb-6">
            You are ordering directly from <span className="font-semibold text-white">Table {selectedTable}</span>. Select your favorite artisanal courses and kitchen will freshly prepare them.
          </p>

          {/* Search bar inside hero */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                id="customer-food-search"
                type="text"
                placeholder="Search food by name, e.g. Paneer, Biryani, Pizza..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white text-xs sm:text-sm text-white focus:text-neutral-900 placeholder:text-neutral-400 rounded-xl border border-white/20 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all backdrop-blur-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Veg toggle switch */}
            <button
              onClick={() => setVegOnly((prev) => !prev)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                vegOnly
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                  : 'bg-white/10 text-neutral-200 border-white/20 hover:bg-white/15'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-[2px] border ${
                  vegOnly ? 'border-white bg-white/20' : 'border-emerald-400'
                } flex items-center justify-center p-[1px]`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </span>
              <span>Pure Veg Only</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Restaurant Advertisements & Offers Carousel */}
      <AdvertisementCarousel
        advertisements={advertisements}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* Horizontally scrollable Category Navigation */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 sticky top-16 z-30 shadow-xs">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
          }}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Category Header & Filter Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 font-serif-brand">
            {activeCategory === 'All' ? 'Full Dining Menu' : activeCategory}
          </h2>
          <p className="text-xs text-neutral-500">
            Showing {filteredFoods.length} handcrafted culinary items
            {vegOnly && ' (Vegetarian dishes only)'}
          </p>
        </div>

        {/* Quick Clear filters if active */}
        {(searchQuery || vegOnly || activeCategory !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setVegOnly(false);
              setActiveCategory('All');
            }}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Food Cards Grid */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No dishes found"
          description={`We couldn't find any dishes matching "${searchQuery}". Try searching for another ingredient, dish, or reset your filters.`}
          actionText="Show All Dishes"
          onAction={() => {
            setSearchQuery('');
            setVegOnly(false);
            setActiveCategory('All');
          }}
        />
      )}

      {/* Public Reviews & Social Proof Section */}
      <PublicReviewsSection />

      {/* Contact, Directions & Concierge Section */}
      <ContactSection />

      {/* Sticky Mobile Floating Order Bar if Cart Has Items */}
      {totalCartItemsCount > 0 && (
        <div className="md:hidden fixed bottom-16 left-4 right-4 z-30 animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="w-full flex items-center justify-between p-3.5 bg-neutral-900 text-white rounded-2xl shadow-xl border border-neutral-800"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs">
                {totalCartItemsCount}
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold block leading-tight">
                  View Current Order
                </span>
                <span className="text-[11px] text-neutral-400">
                  Table {selectedTable}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono">₹{cartTotal}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
