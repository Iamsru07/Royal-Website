import React, { useState, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  IndianRupee,
  Grid,
  ArrowRight,
  TrendingUp,
  Eye,
  CheckCircle,
  ChefHat,
  Megaphone,
  Edit2,
  Tag,
  Sparkles,
  EyeOff,
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  RefreshCw,
  Edit3,
  Link as LinkIcon,
  CheckCircle2,
  Search,
  UtensilsCrossed,
  PlusCircle,
  Users,
  CalendarDays,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { DashboardCard } from '../../components/admin/DashboardCard';
import { OrderStatusBadge, PaymentBadge } from '../../components/common/StatusBadge';
import { AdvertisementBanner, FoodCategory, FoodItem, FoodType, Order, OrderStatus, TableStatus } from '../../types';
import { Modal } from '../../components/common/Modal';
import { FoodCard } from '../../components/customer/FoodCard';

export const AdminDashboardPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const {
    orders,
    tables,
    updateTableStatus,
    vacateTable,
    updateOrderStatus,
    showToast,
    advertisements,
    toggleAdvertisementStatus,
    updateAdvertisement,
    categories,
    foods,
    updateFood,
    addFood,
    customers,
    reservations,
    settings,
  } = useRestaurant();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Quick edit advertisement states for dashboard overview
  const [editingAd, setEditingAd] = useState<AdvertisementBanner | null>(null);
  const [adBadge, setAdBadge] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adSubtitle, setAdSubtitle] = useState('');
  const [adCoupon, setAdCoupon] = useState('');
  const [adCtaText, setAdCtaText] = useState('');
  const [adCategory, setAdCategory] = useState<FoodCategory>('Main Course');
  const [adActive, setAdActive] = useState(true);

  const openEditAd = (ad: AdvertisementBanner) => {
    setEditingAd(ad);
    setAdBadge(ad.badge);
    setAdTitle(ad.title);
    setAdSubtitle(ad.subtitle);
    setAdCoupon(ad.couponCode || '');
    setAdCtaText(ad.ctaText);
    setAdCategory(ad.targetCategory || 'Main Course');
    setAdActive(ad.isActive);
  };

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd || !adTitle.trim()) return;
    updateAdvertisement(editingAd.id, {
      badge: adBadge.trim(),
      title: adTitle.trim(),
      subtitle: adSubtitle.trim(),
      couponCode: adCoupon.trim() ? adCoupon.trim().toUpperCase() : undefined,
      ctaText: adCtaText.trim() || 'Order Now',
      targetCategory: adCategory,
      isActive: adActive,
    });
    setEditingAd(null);
  };

  // State for Dish Photos & Multi-Image Sliders (Add, Delete, Changes authority)
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState<string>(foods[0]?.id || '');
  const [photoModalTab, setPhotoModalTab] = useState<'add' | 'changes' | 'delete' | 'preview'>('add');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<string>('All');
  const [photoSearchQuery, setPhotoSearchQuery] = useState('');
  const [replacingPhotoIndex, setReplacingPhotoIndex] = useState<number | null>(null);
  const [replacementUrl, setReplacementUrl] = useState('');

  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // State for Creating & Adding New Dish to Menu
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<FoodCategory>('Main Course');
  const [newDishPrice, setNewDishPrice] = useState<number | ''>(240);
  const [newDishDescription, setNewDishDescription] = useState('');
  const [newDishFoodType, setNewDishFoodType] = useState<FoodType>('veg');
  const [newDishPrepTime, setNewDishPrepTime] = useState<number>(15);
  const [newDishSpicyLevel, setNewDishSpicyLevel] = useState<1 | 2 | 3>(2);
  const [newDishIsChefSpecial, setNewDishIsChefSpecial] = useState(false);
  const [newDishImages, setNewDishImages] = useState<string[]>([]);
  const [newDishUrlInput, setNewDishUrlInput] = useState('');
  const [isNewDishUploading, setIsNewDishUploading] = useState(false);
  const newDishFileInputRef = useRef<HTMLInputElement>(null);

  const openAddDishModal = () => {
    setNewDishName('');
    setNewDishCategory(categories[0] || 'Main Course');
    setNewDishPrice(240);
    setNewDishDescription('');
    setNewDishFoodType('veg');
    setNewDishPrepTime(15);
    setNewDishSpicyLevel(2);
    setNewDishIsChefSpecial(false);
    setNewDishImages([
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80',
    ]);
    setNewDishUrlInput('');
    setIsAddDishModalOpen(true);
  };

  const handleNewDishFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsNewDishUploading(true);
    const fileList = Array.from(files);
    let loaded = 0;
    const base64List: string[] = [];

    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        if (res) base64List.push(res);
        loaded++;
        if (loaded === fileList.length) {
          setNewDishImages((prev) => [...prev, ...base64List]);
          showToast(`${base64List.length} photo(s) attached!`, 'success');
          setIsNewDishUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddNewDishUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishUrlInput.trim()) return;
    setNewDishImages((prev) => [...prev, newDishUrlInput.trim()]);
    setNewDishUrlInput('');
    showToast('Photo URL added!', 'success');
  };

  const handleRemoveNewDishImage = (idx: number) => {
    if (newDishImages.length <= 1) {
      showToast('Keep at least 1 image for the dish preview.', 'info');
      return;
    }
    setNewDishImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSetNewDishCover = (idx: number) => {
    setNewDishImages((prev) => {
      const copy = [...prev];
      const [sel] = copy.splice(idx, 1);
      return [sel, ...copy];
    });
    showToast('Set as main cover image!', 'success');
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) {
      showToast('Please enter a dish name.', 'error');
      return;
    }
    const finalPrice = typeof newDishPrice === 'number' ? newDishPrice : parseFloat(newDishPrice) || 199;
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80';
    const finalImages = newDishImages.length > 0 ? newDishImages : [fallbackImage];

    addFood({
      name: newDishName.trim(),
      category: newDishCategory,
      price: finalPrice,
      description: newDishDescription.trim() || `${newDishName.trim()} prepared fresh with premium royal spices and ingredients.`,
      imageUrl: finalImages[0],
      images: finalImages,
      foodType: newDishFoodType,
      prepTimeMinutes: newDishPrepTime || 15,
      availability: 'AVAILABLE',
      isFeatured: newDishIsChefSpecial,
      spicyLevel: newDishSpicyLevel,
    });

    setIsAddDishModalOpen(false);
  };

  // Active dish in studio modal
  const activeDish = foods.find((f) => f.id === selectedDishId) || foods[0];
  const activeDishImages = activeDish
    ? activeDish.images && activeDish.images.length > 0
      ? activeDish.images
      : [activeDish.imageUrl]
    : [];

  const openPhotoManager = (
    foodId: string,
    tab: 'add' | 'changes' | 'delete' | 'preview' = 'add'
  ) => {
    setSelectedDishId(foodId);
    setPhotoModalTab(tab);
    setReplacingPhotoIndex(null);
    setPhotoModalOpen(true);
  };

  // 1. ADD OPTION: Upload multiple images from device / gallery
  const handleAddPhotoFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeDish) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsPhotoUploading(true);
    const fileList = Array.from(files);
    let loadedCount = 0;
    const newBase64Images: string[] = [];

    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          newBase64Images.push(result);
        }
        loadedCount++;
        if (loadedCount === fileList.length) {
          const existing = activeDish.images && activeDish.images.length > 0
            ? [...activeDish.images]
            : [activeDish.imageUrl];
          const updated = [...existing, ...newBase64Images];

          updateFood(activeDish.id, {
            images: updated,
            imageUrl: updated[0] || activeDish.imageUrl,
          });

          showToast(`${newBase64Images.length} photo(s) added to "${activeDish.name}"!`, 'success');
          setIsPhotoUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // 1. ADD OPTION: Add image by web URL
  const handleAddPhotoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDish || !photoUrlInput.trim()) return;

    const trimmed = photoUrlInput.trim();
    const existing = activeDish.images && activeDish.images.length > 0
      ? [...activeDish.images]
      : [activeDish.imageUrl];
    const updated = [...existing, trimmed];

    updateFood(activeDish.id, {
      images: updated,
      imageUrl: updated[0] || activeDish.imageUrl,
    });

    setPhotoUrlInput('');
    showToast(`Photo URL added to "${activeDish.name}"!`, 'success');
  };

  // 2. DELETE OPTION: Delete a photo from the slider
  const handleDeletePhoto = (foodId: string, photoIndex: number) => {
    const targetFood = foods.find((f) => f.id === foodId);
    if (!targetFood) return;

    const existing = targetFood.images && targetFood.images.length > 0
      ? [...targetFood.images]
      : [targetFood.imageUrl];

    if (existing.length <= 1) {
      showToast('Each dish needs at least 1 photo for display.', 'error');
      return;
    }

    const updated = existing.filter((_, idx) => idx !== photoIndex);
    updateFood(targetFood.id, {
      images: updated,
      imageUrl: updated[0] || targetFood.imageUrl,
    });

    showToast(`Photo deleted from "${targetFood.name}".`, 'info');
  };

  // 3. CHANGES OPTION: Set main cover photo (Photo #1)
  const handleChangeCover = (foodId: string, photoIndex: number) => {
    const targetFood = foods.find((f) => f.id === foodId);
    if (!targetFood || photoIndex === 0) return;

    const existing = targetFood.images && targetFood.images.length > 0
      ? [...targetFood.images]
      : [targetFood.imageUrl];

    const copy = [...existing];
    const [selected] = copy.splice(photoIndex, 1);
    const updated = [selected, ...copy];

    updateFood(targetFood.id, {
      images: updated,
      imageUrl: updated[0],
    });

    showToast(`Main cover photo changed for "${targetFood.name}"!`, 'success');
  };

  // 3. CHANGES OPTION: Reorder / Move slide left or right
  const handleMoveSlide = (foodId: string, fromIndex: number, direction: 'left' | 'right') => {
    const targetFood = foods.find((f) => f.id === foodId);
    if (!targetFood) return;

    const existing = targetFood.images && targetFood.images.length > 0
      ? [...targetFood.images]
      : [targetFood.imageUrl];

    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= existing.length) return;

    const copy = [...existing];
    const temp = copy[fromIndex];
    copy[fromIndex] = copy[toIndex];
    copy[toIndex] = temp;

    updateFood(targetFood.id, {
      images: copy,
      imageUrl: copy[0] || targetFood.imageUrl,
    });

    showToast('Slider sequence changed!', 'success');
  };

  // 3. CHANGES OPTION: Replace / Change specific photo with URL or file
  const handleReplacePhoto = (foodId: string, photoIndex: number, newSrc: string) => {
    const targetFood = foods.find((f) => f.id === foodId);
    if (!targetFood || !newSrc.trim()) return;

    const existing = targetFood.images && targetFood.images.length > 0
      ? [...targetFood.images]
      : [targetFood.imageUrl];

    const copy = [...existing];
    copy[photoIndex] = newSrc.trim();

    updateFood(targetFood.id, {
      images: copy,
      imageUrl: copy[0] || targetFood.imageUrl,
    });

    setReplacingPhotoIndex(null);
    setReplacementUrl('');
    showToast(`Photo #${photoIndex + 1} successfully changed!`, 'success');
  };

  const handleReplaceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeDish || replacingPhotoIndex === null) return;
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleReplacePhoto(activeDish.id, replacingPhotoIndex, result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Compute live metrics
  const todayOrdersCount = orders.length + 18; // Includes simulated past morning shifts
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Received' || o.status === 'Confirmed' || o.status === 'Preparing'
  ).length;
  const todayRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 8420);
  const availableTablesCount = tables.filter((t) => t.status === 'AVAILABLE').length;

  const handleNextStatus = (order: Order) => {
    const sequence: OrderStatus[] = [
      'Received',
      'Confirmed',
      'Preparing',
      'Ready',
      'Served',
      'Completed',
    ];
    const currentIndex = sequence.indexOf(order.status);
    if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      updateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <>
      <AdminHeader
        title="Restaurant Overview"
        subtitle="Live kitchen flow, dining table availability, and daily revenue"
        onMenuToggle={toggleSidebar}
        actions={
          <Link
            to="/admin/orders"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <span>Live Kitchen KDS</span>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Today's Orders"
            value={todayOrdersCount}
            subtitle="+12% from yesterday lunch"
            icon={ShoppingBag}
            trend="+12%"
          />
          <DashboardCard
            title="Pending Orders"
            value={pendingOrdersCount}
            subtitle="Active kitchen queue"
            icon={Clock}
            trend="Active now"
            trendPositive={pendingOrdersCount <= 5}
          />
          <DashboardCard
            title="Today's Revenue"
            value={`₹${todayRevenue.toLocaleString('en-IN')}`}
            subtitle="Cash & Online aggregate"
            icon={IndianRupee}
            trend="+18.4%"
          />
          <DashboardCard
            title="Available Tables"
            value={`${availableTablesCount} / ${tables.length}`}
            subtitle={`${tables.filter((t) => t.status === 'OCCUPIED').length} currently seated`}
            icon={Grid}
            trend={`${Math.round((availableTablesCount / tables.length) * 100)}% free`}
          />
        </div>

        {/* Quick User Details Bar */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-serif-brand">
                  User Details & Registered Accounts
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {customers.length} Accounts Saved
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                All registered 10-digit mobile numbers, passwords & dining records saved in Admin Panel database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/customers"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs whitespace-nowrap"
            >
              <span>View User Details →</span>
            </Link>
          </div>
        </div>

        {/* Customer Table Pre-Bookings & Advance Fee Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-neutral-900 to-stone-900 text-white p-5 rounded-2xl border border-neutral-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-serif-brand">
                  Advance Table Pre-Bookings
                </h3>
                <span className="text-[10px] bg-amber-500 text-neutral-950 font-extrabold px-2 py-0.5 rounded-full">
                  {reservations.filter((r) => r.status === 'Confirmed').length} Confirmed
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Fee: ₹{settings.reservationFeePerBooking !== undefined ? settings.reservationFeePerBooking : 99} / Booking
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5 max-w-xl">
                Track guest reservations, seating time slots, and online advance fees. Admin can change the pre-booking fee anytime.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/reservations"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-2xs whitespace-nowrap"
            >
              <span>Manage Pre-Bookings →</span>
            </Link>
          </div>
        </div>

        {/* Live Table Seating & Booking Occupancy Control (Admin Panel) */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-700 flex items-center justify-center shrink-0">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-neutral-900 font-serif-brand">
                    Live Table Booking & Floor Seating
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                    {tables.filter((t) => t.status === 'OCCUPIED').length} Occupied
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    {tables.filter((t) => t.status === 'AVAILABLE').length} Available
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Jab bhi user kisi table se order ya booking karta hai to wo table turant Occupied ho jati hai. Admin yahan se status badal sakta hai.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/tables"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Manage Floor Tables</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Table Grid in Dashboard */}
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 bg-neutral-50/60">
            {tables.map((t) => {
              const isOccupied = t.status === 'OCCUPIED';
              const isReserved = t.status === 'RESERVED';

              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                    isOccupied
                      ? 'border-red-300 bg-red-50/90 shadow-2xs'
                      : isReserved
                      ? 'border-amber-300 bg-amber-50/90 shadow-2xs'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-neutral-900 font-mono">
                      T-{t.tableNumber}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOccupied
                          ? 'bg-red-500 animate-pulse'
                          : isReserved
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  <div className="text-[10px] text-neutral-500 mb-2 truncate">
                    {isOccupied ? (
                      <span className="text-red-700 font-bold truncate block">
                        {t.bookedByName || t.currentOrderId || 'Seated'}
                      </span>
                    ) : (
                      <span>{t.capacity} Seats · Free</span>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={t.status}
                    onChange={(e) => updateTableStatus(t.id, e.target.value as TableStatus)}
                    aria-label={`Change status for Table ${t.tableNumber}`}
                    className="w-full text-[10px] font-bold py-1 px-1 rounded border border-neutral-300 bg-white text-neutral-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* The Royal Taste Overview: Menu Advertisements & Offers (Admin controllable) */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900 font-serif-brand">
                  Live Customer Advertisements & Special Offers
                </h2>
                <p className="text-xs text-neutral-500">
                  {advertisements.filter((a) => a.isActive).length} active promotional banners running on The Royal Taste mobile ordering menu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/advertisements"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Full Ads Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Advertisements Grid */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {advertisements.map((ad, idx) => (
              <div
                key={ad.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                  ad.isActive
                    ? 'border-neutral-200 bg-white hover:border-amber-400/50 shadow-xs'
                    : 'border-neutral-200/60 bg-neutral-50/60 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Slot #{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ad.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {ad.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-neutral-500 block truncate mb-1">
                    {ad.badge}
                  </span>

                  <h3 className="text-xs font-bold text-neutral-900 font-serif-brand leading-snug line-clamp-2 mb-1.5">
                    {ad.title}
                  </h3>

                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed mb-3">
                    {ad.subtitle}
                  </p>

                  <div className="space-y-1 mb-3 text-[11px]">
                    {ad.couponCode && (
                      <div className="flex items-center justify-between text-neutral-600">
                        <span className="text-neutral-400">Coupon:</span>
                        <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          {ad.couponCode}
                        </span>
                      </div>
                    )}
                    {ad.targetCategory && (
                      <div className="flex items-center justify-between text-neutral-600">
                        <span className="text-neutral-400">Category:</span>
                        <span className="font-medium text-neutral-800">{ad.targetCategory}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openEditAd(ad)}
                    className="flex items-center gap-1 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => toggleAdvertisementStatus(ad.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      ad.isActive
                        ? 'text-neutral-500 hover:bg-neutral-100'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {ad.isActive ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Dish Photos & Multi-Image Sliders (Admin Authority: Add, Delete, Changes) */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
          {/* Header Bar */}
          <div className="p-5 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-neutral-900 font-serif-brand">
                    Menu Dish Photos & Multi-Image Sliders
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    Live Slider Studio
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Add multiple photos, delete photos, and make changes to slider order & cover. Auto-slide & finger/cursor swipe active on customer menu!
                </p>
              </div>
            </div>

            {/* Header Action Buttons (Add Dish, Add Photos, Changes, Delete, Full Gallery) */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={openAddDishModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer border border-neutral-700"
                title="Create and add a new food dish with photos and slider"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Add New Dish</span>
              </button>

              <button
                type="button"
                onClick={() => openPhotoManager(selectedDishId || foods[0]?.id || '', 'add')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                title="Add photos from device or URL"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Photos</span>
              </button>

              <button
                type="button"
                onClick={() => openPhotoManager(selectedDishId || foods[0]?.id || '', 'changes')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                title="Reorder slides, change cover, or replace photos"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>✎ Changes & Sliders</span>
              </button>

              <button
                type="button"
                onClick={() => openPhotoManager(selectedDishId || foods[0]?.id || '', 'delete')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 active:scale-95 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Delete photos from dish sliders"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>🗑️ Delete Photos</span>
              </button>

              <Link
                to="/admin/gallery"
                className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <span>Full Gallery</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Quick Toolbar: Filter by Category & Search */}
          <div className="px-5 py-3 bg-neutral-50/70 border-b border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setSelectedPhotoCategory('All')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedPhotoCategory === 'All'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white text-neutral-600 hover:bg-neutral-200/60 border border-neutral-200/70'
                }`}
              >
                All Dishes ({foods.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedPhotoCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedPhotoCategory === cat
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-white text-neutral-600 hover:bg-neutral-200/60 border border-neutral-200/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                value={photoSearchQuery}
                onChange={(e) => setPhotoSearchQuery(e.target.value)}
                placeholder="Search dish photos..."
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {/* Dish Grid with Add New Dish Card, Add, Delete, and Changes options */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* 1. Quick Add New Dish Card */}
            <div
              onClick={openAddDishModal}
              className="rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/20 hover:bg-amber-50/50 p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 font-serif-brand mb-1">
                + Add New Dish
              </h4>
              <p className="text-xs text-neutral-500 mb-3 max-w-[200px]">
                Create a new food item with photos & multi-image slider
              </p>
              <span className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-2xs group-hover:bg-amber-700 transition-colors flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Dish Now</span>
              </span>
            </div>
            {foods
              .filter((f) => {
                if (selectedPhotoCategory !== 'All' && f.category !== selectedPhotoCategory) return false;
                if (photoSearchQuery.trim()) {
                  const q = photoSearchQuery.toLowerCase();
                  return f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
                }
                return true;
              })
              .slice(0, 8)
              .map((food) => {
                const photoCount = food.images?.length || 1;
                const hasSlider = photoCount > 1;

                return (
                  <div
                    key={food.id}
                    className="group rounded-2xl border border-neutral-200/80 hover:border-amber-500 hover:shadow-md transition-all bg-white overflow-hidden flex flex-col"
                  >
                    {/* Image Thumbnail with Overlay Indicators */}
                    <div
                      onClick={() => openPhotoManager(food.id, 'changes')}
                      className="relative aspect-4/3 overflow-hidden bg-neutral-100 cursor-pointer"
                    >
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Photo Count & Slider Status Badge */}
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-white shadow-xs backdrop-blur-xs flex items-center gap-1 ${
                        hasSlider ? 'bg-amber-600/90' : 'bg-black/60'
                      }`}>
                        <ImageIcon className="w-3 h-3" />
                        <span>{photoCount} {photoCount === 1 ? 'photo' : 'photos'}</span>
                      </span>

                      {hasSlider && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-emerald-500 text-neutral-950 font-bold text-[9px] shadow-xs flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Auto-Slide</span>
                        </span>
                      )}

                      {/* Quick Hover Overlay */}
                      <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-2.5 py-1 bg-white/90 text-neutral-900 rounded-lg text-[11px] font-bold shadow-xs">
                          Open Photo Studio ↗
                        </span>
                      </div>
                    </div>

                    {/* Dish Info */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h4 className="text-xs font-bold text-neutral-900 truncate font-serif-brand">
                            {food.name}
                          </h4>
                          <span className="font-mono text-xs font-semibold text-neutral-700 shrink-0">
                            ₹{food.price}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 mb-2 truncate">
                          {food.category} · {hasSlider ? 'Multi-image swipe enabled' : 'Single photo'}
                        </p>
                      </div>

                      {/* 3 Action Buttons: Add, Changes, Delete */}
                      <div className="pt-2 border-t border-neutral-100 grid grid-cols-3 gap-1.5">
                        {/* 1. Add Option */}
                        <button
                          type="button"
                          onClick={() => openPhotoManager(food.id, 'add')}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold border border-emerald-200/80 transition-colors"
                          title="Add more photos to this dish"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Add</span>
                        </button>

                        {/* 2. Changes Option */}
                        <button
                          type="button"
                          onClick={() => openPhotoManager(food.id, 'changes')}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[11px] font-bold border border-amber-200/80 transition-colors"
                          title="Make changes: reorder, set cover, replace photos"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Changes</span>
                        </button>

                        {/* 3. Delete Option */}
                        <button
                          type="button"
                          onClick={() => openPhotoManager(food.id, 'delete')}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[11px] font-bold border border-red-200/80 transition-colors"
                          title="Delete photos from this dish"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Bottom Hint Banner */}
          <div className="px-5 py-3 bg-neutral-50/60 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
            <span>
              💡 <strong>Multi-Image Sliders:</strong> Any dish with 2+ photos will automatically slide on customer table menus and allow diners to swipe using their finger or cursor.
            </span>
            <Link
              to="/admin/gallery"
              className="text-amber-800 font-bold hover:underline shrink-0 flex items-center gap-1"
            >
              <span>Manage all {foods.length} dishes in Full Gallery</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 font-serif-brand">
                Recent Table Orders
              </h2>
              <p className="text-xs text-neutral-500">
                Live stream of guest orders across all active tables
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 bg-[#FAFAFA] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Table</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {orders.slice(0, 7).map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-neutral-900 block font-serif-brand">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {order.customerPhone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-neutral-100 font-mono font-semibold text-neutral-800 rounded-md">
                        Table {order.tableNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate">
                      {order.items.map((i) => `${i.foodName} (${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 text-right tabular-nums whitespace-nowrap">
                      ₹{order.total}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-neutral-900">{order.paymentMethod}</span>
                        <PaymentBadge status={order.paymentStatus} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="View order details"
                          aria-label={`View order ${order.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleNextStatus(order)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold rounded-lg text-[11px] transition-colors"
                            title="Advance to next kitchen stage"
                          >
                            Next Stage &rarr;
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.id}`}
          subtitle={`Placed at ${selectedOrder.createdAt} for Table ${selectedOrder.tableNumber}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
              <div>
                <span className="text-xs text-neutral-500 block">Customer</span>
                <span className="text-sm font-semibold text-neutral-900">
                  {selectedOrder.customerName} ({selectedOrder.customerPhone})
                </span>
              </div>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Order Items
              </h4>
              <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-xl p-3 bg-white">
                {selectedOrder.items.map((i, idx) => (
                  <div key={idx} className="py-2 flex justify-between text-xs">
                    <span>
                      {i.foodName} <span className="text-neutral-400 font-mono">× {i.quantity}</span>
                    </span>
                    <span className="font-mono font-semibold text-neutral-900">
                      ₹{i.price * i.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.specialNotes && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs">
                <span className="font-semibold text-amber-900 block mb-0.5">
                  Chef Notes:
                </span>
                <p className="text-amber-800">{selectedOrder.specialNotes}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
              <span className="text-sm font-bold text-neutral-900">Total Amount</span>
              <span className="text-base font-bold font-mono text-neutral-900">
                ₹{selectedOrder.total}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleNextStatus(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold"
              >
                Advance Status
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Edit Advertisement Modal */}
      {editingAd && (
        <Modal
          isOpen={!!editingAd}
          onClose={() => setEditingAd(null)}
          title={`Edit Advertisement #${editingAd.id}`}
          subtitle="Change the offer text, coupon code, and target category shown to table diners"
          maxWidth="md"
        >
          <form onSubmit={handleSaveAd} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Badge / Offer Tagline
              </label>
              <input
                type="text"
                value={adBadge}
                onChange={(e) => setAdBadge(e.target.value)}
                placeholder="e.g. CHEF SPECIAL · 20% OFF"
                required
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Headline Title
              </label>
              <input
                type="text"
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
                placeholder="e.g. Royal Awadhi Biryani & Dum Handi Feast"
                required
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Description / Subtitle
              </label>
              <textarea
                value={adSubtitle}
                onChange={(e) => setAdSubtitle(e.target.value)}
                rows={2}
                placeholder="Brief description of the promotional dining dish or discount."
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Promo Coupon Code (optional)
                </label>
                <input
                  type="text"
                  value={adCoupon}
                  onChange={(e) => setAdCoupon(e.target.value)}
                  placeholder="e.g. ROYALDUM20"
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Target Menu Category
                </label>
                <select
                  value={adCategory}
                  onChange={(e) => setAdCategory(e.target.value as FoodCategory)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Call to Action Button
                </label>
                <input
                  type="text"
                  value={adCtaText}
                  onChange={(e) => setAdCtaText(e.target.value)}
                  placeholder="e.g. Explore Biryanis"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Status
                </label>
                <select
                  value={adActive ? 'active' : 'paused'}
                  onChange={(e) => setAdActive(e.target.value === 'active')}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
                >
                  <option value="active">Active (Visible to diners)</option>
                  <option value="paused">Paused (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-neutral-100">
              <button
                type="submit"
                className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingAd(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Menu Dish Photos & Multi-Image Sliders Studio Modal (Add, Delete, Changes authority) */}
      {photoModalOpen && activeDish && (
        <Modal
          isOpen={photoModalOpen}
          onClose={() => {
            setPhotoModalOpen(false);
            setReplacingPhotoIndex(null);
          }}
          title="Menu Dish Photos & Multi-Image Sliders Studio"
          subtitle={`Dish: ${activeDish.name} (${activeDish.category}) · ₹${activeDish.price}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {/* Top Dish Selector to easily switch dishes */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                  Selected Dish for Photo Management:
                </label>
                <select
                  value={selectedDishId}
                  onChange={(e) => {
                    setSelectedDishId(e.target.value);
                    setReplacingPhotoIndex(null);
                  }}
                  className="w-full px-3 py-1.5 bg-white text-xs font-bold text-neutral-900 rounded-lg border border-neutral-200 focus:outline-none focus:border-amber-600"
                >
                  {foods.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.category}) — {f.images?.length || 1} photo(s)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {activeDishImages.length} {activeDishImages.length === 1 ? 'Photo' : 'Photos (Slider Active)'}
                </span>
                <button
                  type="button"
                  onClick={openAddDishModal}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  title="Create and add a new food dish"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add New Dish</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs: Add, Changes, Delete, Preview */}
            <div className="flex border-b border-neutral-200 overflow-x-auto no-scrollbar gap-1">
              <button
                type="button"
                onClick={() => setPhotoModalTab('add')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  photoModalTab === 'add'
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>1. + Add Photos</span>
              </button>

              <button
                type="button"
                onClick={() => setPhotoModalTab('changes')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  photoModalTab === 'changes'
                    ? 'border-amber-500 text-amber-800 bg-amber-50/50'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>2. ✎ Changes & Sliders</span>
              </button>

              <button
                type="button"
                onClick={() => setPhotoModalTab('delete')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  photoModalTab === 'delete'
                    ? 'border-red-600 text-red-700 bg-red-50/50'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>3. 🗑️ Delete Photos</span>
              </button>

              <button
                type="button"
                onClick={() => setPhotoModalTab('preview')}
                className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  photoModalTab === 'preview'
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>4. 👁️ Customer Slider Preview</span>
              </button>
            </div>

            {/* TAB 1: ADD PHOTOS */}
            {photoModalTab === 'add' && (
              <div className="space-y-4 py-2">
                <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 mb-0.5">
                      Upload from Device / Gallery
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Select 1 or multiple photos directly from your phone gallery or computer.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={photoFileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleAddPhotoFiles}
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={isPhotoUploading}
                    onClick={() => photoFileInputRef.current?.click()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isPhotoUploading ? 'Uploading...' : '+ Choose Device / Gallery Photos'}</span>
                  </button>
                </div>

                {/* Or paste web URL */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Or Add Image via Web Link / URL:
                  </label>
                  <form onSubmit={handleAddPhotoUrl} className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input
                        type="url"
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                        placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!photoUrlInput.trim()}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer"
                    >
                      + Add URL
                    </button>
                  </form>
                </div>

                {/* Current Photos Gallery */}
                <div>
                  <span className="text-xs font-bold text-neutral-700 block mb-2">
                    Current Photos for "{activeDish.name}" ({activeDishImages.length}):
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {activeDishImages.map((src, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border-2 ${
                          idx === 0 ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-200'
                        }`}
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono font-bold">
                          #{idx + 1}
                        </span>
                        {idx === 0 && (
                          <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-500 text-neutral-950 text-[9px] font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" /> Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CHANGES & REORDER */}
            {photoModalTab === 'changes' && (
              <div className="space-y-4 py-2">
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>Changes Options:</strong> Set primary cover photo, move slides left/right to change customer slide order, or replace/change any photo.
                    </span>
                  </div>
                </div>

                {/* Hidden File Input for photo replacement */}
                <input
                  type="file"
                  ref={replaceFileInputRef}
                  accept="image/*"
                  onChange={handleReplaceFileUpload}
                  className="hidden"
                />

                {/* Replacing photo inline panel */}
                {replacingPhotoIndex !== null && (
                  <div className="p-4 bg-neutral-900 text-white rounded-2xl space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">
                        🔄 Replace / Change Photo #{replacingPhotoIndex + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReplacingPhotoIndex(null)}
                        className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => replaceFileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Replacement from Device</span>
                      </button>

                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={replacementUrl}
                          onChange={(e) => setReplacementUrl(e.target.value)}
                          placeholder="Or paste new photo URL"
                          className="flex-1 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-white text-xs rounded-xl focus:outline-none focus:border-amber-400"
                        />
                        <button
                          type="button"
                          disabled={!replacementUrl.trim()}
                          onClick={() => handleReplacePhoto(activeDish.id, replacingPhotoIndex, replacementUrl)}
                          className="px-3 py-1.5 bg-white text-neutral-900 hover:bg-neutral-200 disabled:opacity-40 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photo List for Changes */}
                <div className="space-y-3">
                  {activeDishImages.map((src, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
                        idx === 0
                          ? 'border-amber-500 bg-amber-50/20 shadow-2xs'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[9px] font-bold">
                            #{idx + 1}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs font-bold text-neutral-900">
                              Slide Position #{idx + 1}
                            </span>
                            {idx === 0 && (
                              <span className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold text-[10px] flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-current" /> Main Cover
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate max-w-xs">
                            {idx === 0
                              ? 'This photo is shown first on customer cards'
                              : `Appears ${idx + 1}th in auto-slide and customer swipe`}
                          </p>
                        </div>
                      </div>

                      {/* Changes Controls */}
                      <div className="flex items-center flex-wrap gap-1.5 w-full sm:w-auto justify-end">
                        {/* Move Left */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSlide(activeDish.id, idx, 'left')}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 text-neutral-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          title="Move slide earlier"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Move Right */}
                        <button
                          type="button"
                          disabled={idx === activeDishImages.length - 1}
                          onClick={() => handleMoveSlide(activeDish.id, idx, 'right')}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 text-neutral-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          title="Move slide later"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Set Main Cover */}
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleChangeCover(activeDish.id, idx)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Make this photo the primary cover"
                          >
                            <Star className="w-3 h-3 fill-current" />
                            <span>Make Cover</span>
                          </button>
                        )}

                        {/* Replace / Change Photo */}
                        <button
                          type="button"
                          onClick={() => {
                            setReplacingPhotoIndex(idx);
                            setReplacementUrl('');
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          title="Change or replace this photo"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Change Photo</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: DELETE PHOTOS */}
            {photoModalTab === 'delete' && (
              <div className="space-y-4 py-2">
                <div className="p-3 bg-red-50/80 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-700 shrink-0" />
                  <span>
                    <strong>Delete Authority:</strong> Click "Delete Photo" on any photo below to remove it from this dish's slider. Dishes must keep at least 1 photo.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {activeDishImages.map((src, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-neutral-200 bg-white flex flex-col justify-between space-y-2.5"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px] font-bold">
                          #{idx + 1}
                        </span>
                        {idx === 0 && (
                          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold text-[9px]">
                            Main Cover
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(activeDish.id, idx)}
                        disabled={activeDishImages.length <= 1}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Photo #{idx + 1}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: CUSTOMER SLIDER PREVIEW */}
            {photoModalTab === 'preview' && (
              <div className="space-y-4 py-2">
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-700 shrink-0" />
                  <span>
                    <strong>Live Customer Menu Card:</strong> Test auto-slide (slides every 4s) and swipe interactively using your cursor or finger swipe!
                  </span>
                </div>

                <div className="max-w-xs mx-auto py-2">
                  <FoodCard food={activeDish} />
                </div>
              </div>
            )}

            {/* Modal Bottom Footer Actions */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                All changes to photos and sliders are saved automatically.
              </span>
              <button
                type="button"
                onClick={() => {
                  setPhotoModalOpen(false);
                  setReplacingPhotoIndex(null);
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Done / Close Studio
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create & Add New Dish Modal */}
      {isAddDishModalOpen && (
        <Modal
          isOpen={isAddDishModalOpen}
          onClose={() => setIsAddDishModalOpen(false)}
          title="Add New Dish to Menu"
          subtitle="Create a new food item with pricing, dietary type, and multi-image photo slider"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateDish} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Royal Shahi Paneer"
                  required
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Menu Category *
                </label>
                <select
                  value={newDishCategory}
                  onChange={(e) => setNewDishCategory(e.target.value as FoodCategory)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={newDishPrice}
                  onChange={(e) => setNewDishPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 260"
                  required
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Food Type
                </label>
                <select
                  value={newDishFoodType}
                  onChange={(e) => setNewDishFoodType(e.target.value as FoodType)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
                >
                  <option value="veg">🟢 Veg</option>
                  <option value="non-veg">🔴 Non-Veg</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Prep Time (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={newDishPrepTime}
                  onChange={(e) => setNewDishPrepTime(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Description / Ingredients
              </label>
              <textarea
                value={newDishDescription}
                onChange={(e) => setNewDishDescription(e.target.value)}
                rows={2}
                placeholder="Describe flavors, aromatic spices, and presentation of the dish..."
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Spice Level
                </label>
                <select
                  value={newDishSpicyLevel}
                  onChange={(e) => setNewDishSpicyLevel(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 bg-white"
                >
                  <option value={1}>Mild (Level 1)</option>
                  <option value={2}>Medium (Level 2)</option>
                  <option value={3}>Hot (Level 3)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newDishIsChefSpecial}
                    onChange={(e) => setNewDishIsChefSpecial(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-neutral-300"
                  />
                  <span className="text-xs font-semibold text-neutral-800">
                    Mark as Chef's Special ⭐
                  </span>
                </label>
              </div>
            </div>

            {/* Dish Photos & Multi-Image Slider Section */}
            <div className="pt-3 border-t border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    Dish Photos & Multi-Image Slider ({newDishImages.length} attached)
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Upload photos from your gallery or paste links. 2+ photos will auto-slide on customer menu!
                  </p>
                </div>

                <input
                  type="file"
                  ref={newDishFileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleNewDishFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isNewDishUploading}
                  onClick={() => newDishFileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isNewDishUploading ? 'Uploading...' : '+ Upload from Device'}</span>
                </button>
              </div>

              {/* Paste URL for new dish */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="url"
                    value={newDishUrlInput}
                    onChange={(e) => setNewDishUrlInput(e.target.value)}
                    placeholder="Or paste image web link (https://...)"
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-600"
                  />
                </div>
                <button
                  type="button"
                  disabled={!newDishUrlInput.trim()}
                  onClick={handleAddNewDishUrl}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
                >
                  + Add URL
                </button>
              </div>

              {/* Attached Images preview */}
              {newDishImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {newDishImages.map((src, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border-2 group ${
                        idx === 0 ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-200'
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono font-bold">
                        #{idx + 1}
                      </span>
                      {idx === 0 ? (
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-500 text-neutral-950 text-[9px] font-bold">
                          Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetNewDishCover(idx)}
                          className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/60 hover:bg-amber-500 hover:text-neutral-950 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          Set Cover
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveNewDishImage(idx)}
                        className="absolute bottom-1 right-1 w-6 h-6 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex gap-2 pt-3 border-t border-neutral-100">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create & Add Dish to Menu</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddDishModalOpen(false)}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
