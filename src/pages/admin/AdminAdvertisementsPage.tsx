import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Tag,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdvertisementBanner, FoodCategory } from '../../types';
import { Modal } from '../../components/common/Modal';

export const AdminAdvertisementsPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const {
    advertisements,
    addAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    toggleAdvertisementStatus,
    categories,
  } = useRestaurant();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdvertisementBanner | null>(null);

  // Form states
  const [badge, setBadge] = useState('SPECIAL OFFER · 20% OFF');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [ctaText, setCtaText] = useState('Order Now');
  const [targetCategory, setTargetCategory] = useState<FoodCategory>('Main Course');
  const [imageUrl, setImageUrl] = useState('');
  const [bgGradient, setBgGradient] = useState('from-amber-950 via-neutral-900 to-stone-900');
  const [isActive, setIsActive] = useState(true);

  const gradientPresets = [
    { label: 'Royal Amber & Charcoal', value: 'from-amber-950 via-neutral-900 to-stone-900' },
    { label: 'Fiery Crimson & Onyx', value: 'from-red-950 via-neutral-900 to-zinc-900' },
    { label: 'Sunset Terracotta & Copper', value: 'from-orange-950 via-neutral-900 to-neutral-950' },
    { label: 'Imperial Velvet & Plum', value: 'from-purple-950 via-neutral-900 to-stone-950' },
    { label: 'Emerald Sage & Night', value: 'from-emerald-950 via-neutral-900 to-stone-900' },
    { label: 'Deep Indigo Midnight', value: 'from-blue-950 via-neutral-900 to-stone-900' },
  ];

  const openAddModal = () => {
    setBadge('FESTIVE SPECIAL · LIMITED TIME');
    setTitle('Chef’s Royal Tasting Platter');
    setSubtitle('Curated pairing of our finest clay-oven grills, house bread, and slow-churned dessert.');
    setCouponCode('ROYALFEST');
    setCtaText('Explore Platter');
    setTargetCategory('Main Course');
    setImageUrl('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80');
    setBgGradient('from-amber-950 via-neutral-900 to-stone-900');
    setIsActive(true);
    setIsAddModalOpen(true);
  };

  const openEditModal = (ad: AdvertisementBanner) => {
    setEditingAd(ad);
    setBadge(ad.badge);
    setTitle(ad.title);
    setSubtitle(ad.subtitle);
    setCouponCode(ad.couponCode || '');
    setCtaText(ad.ctaText);
    setTargetCategory(ad.targetCategory || 'Main Course');
    setImageUrl(ad.imageUrl);
    setBgGradient(ad.bgGradient);
    setIsActive(ad.isActive);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addAdvertisement({
      badge: badge.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      couponCode: couponCode.trim() ? couponCode.trim().toUpperCase() : undefined,
      ctaText: ctaText.trim() || 'Explore Menu',
      targetCategory,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      bgGradient,
      isActive,
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd || !title.trim()) return;

    updateAdvertisement(editingAd.id, {
      badge: badge.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      couponCode: couponCode.trim() ? couponCode.trim().toUpperCase() : undefined,
      ctaText: ctaText.trim() || 'Explore Menu',
      targetCategory,
      imageUrl: imageUrl.trim(),
      bgGradient,
      isActive,
    });
    setEditingAd(null);
  };

  return (
    <>
      <AdminHeader
        title="Promotions & Advertisements"
        subtitle="Manage the 3-4 featured banner offers displayed at the top of customer table menus"
        onMenuToggle={toggleSidebar}
        actions={
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Advertisement</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Helper announcement banner */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-950 font-serif-brand">
              Live Customer Table Carousel (3-4 Banners)
            </h3>
            <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
              These advertisements slide dynamically right under "The Royal Taste" table header on the customer ordering menu. As admin, you can edit headings, discount promo codes, target menu categories, and activate/deactivate them at any time.
            </p>
          </div>
        </div>

        {/* Advertisement Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {advertisements.map((ad, index) => (
            <div
              key={ad.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-xs ${
                ad.isActive
                  ? 'border-neutral-200 hover:border-neutral-300'
                  : 'border-neutral-200/60 opacity-65 bg-neutral-50/50'
              }`}
            >
              <div>
                {/* Live Banner Mock Preview Header */}
                <div
                  className={`p-5 text-white relative overflow-hidden bg-gradient-to-r ${ad.bgGradient} min-h-[140px] flex flex-col justify-between`}
                >
                  {ad.imageUrl && (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity pointer-events-none"
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/25 border border-amber-400/40 text-amber-300 backdrop-blur-xs">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{ad.badge}</span>
                    </span>

                    <span className="text-[10px] font-mono text-neutral-400 bg-black/40 px-2 py-0.5 rounded">
                      Slot #{index + 1}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-base font-bold font-serif-brand text-white leading-snug">
                      {ad.title}
                    </h4>
                    <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                      {ad.subtitle}
                    </p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Target Category:</span>
                    <span className="font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                      {ad.targetCategory || 'All'}
                    </span>
                  </div>

                  {ad.couponCode && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Discount Code:</span>
                      <span className="font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                        {ad.couponCode}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Status:</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ad.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ad.isActive ? 'bg-emerald-600' : 'bg-neutral-400'
                        }`}
                      />
                      <span>{ad.isActive ? 'Active on Menu' : 'Inactive / Paused'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-neutral-100 mt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleAdvertisementStatus(ad.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    ad.isActive
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {ad.isActive ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Pause Banner</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Activate</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(ad)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Offer</span>
                  </button>

                  <button
                    onClick={() => deleteAdvertisement(ad.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Advertisement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Advertisement Modal */}
      {(isAddModalOpen || editingAd) && (
        <Modal
          isOpen={isAddModalOpen || !!editingAd}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingAd(null);
          }}
          title={editingAd ? `Edit Offer: ${editingAd.title}` : 'Add Advertisement Offer'}
          subtitle="Configure promotional badge, copy, discount coupon, and target menu section"
          maxWidth="lg"
        >
          <form
            onSubmit={editingAd ? handleSaveEdit : handleSaveAdd}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tag / Badge Text
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CHEF SPECIAL · 20% OFF"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Coupon Promo Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ROYALDUM20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs font-mono rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 uppercase"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Offer Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Awadhi Biryani & Dum Handi Feast"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Offer Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Slow-cooked saffron basmati infused with caramelized aromatics and tender shanks..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Target Menu Category
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value as FoodCategory)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                >
                  {categories
                    .filter((c) => c !== 'All')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Button Text (CTA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Explore Biryanis"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Food Banner Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Background Theme Color Gradient
                </label>
                <select
                  value={bgGradient}
                  onChange={(e) => setBgGradient(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                >
                  {gradientPresets.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isAdActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
              />
              <label htmlFor="isAdActive" className="text-xs font-semibold text-neutral-800">
                Show this advertisement immediately on customer table menu
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingAd(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl"
              >
                {editingAd ? 'Save Changes' : 'Create Advertisement'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
