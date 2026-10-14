import React, { useState, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Sparkles, ImageOff, Upload, Image as ImageIcon, Link as LinkIcon, Star } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { FoodCategory, FoodItem, FoodType, AvailabilityStatus } from '../../types';
import { VegNonVegBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const AdminMenuPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { foods, categories, addFood, updateFood, deleteFood } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<FoodCategory>('Starters');
  const [formPrice, setFormPrice] = useState('250');
  const [formDescription, setFormDescription] = useState('');
  const [formFoodType, setFormFoodType] = useState<FoodType>('veg');
  const [formPrepTime, setFormPrepTime] = useState('15');
  const [formAvailability, setFormAvailability] = useState<AvailabilityStatus>('AVAILABLE');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  
  // Multi-image state
  const [formImages, setFormImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setFormName('');
    setFormCategory('Starters');
    setFormPrice('240');
    setFormDescription('Delicious culinary preparation made with premium ingredients and house herbs.');
    setFormFoodType('veg');
    setFormPrepTime('15');
    setFormAvailability('AVAILABLE');
    setFormIsFeatured(false);
    setFormImages(['https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80']);
    setNewImageUrl('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (food: FoodItem) => {
    setEditingFood(food);
    setFormName(food.name);
    setFormCategory(food.category);
    setFormPrice(food.price.toString());
    setFormDescription(food.description);
    setFormFoodType(food.foodType);
    setFormPrepTime(food.prepTimeMinutes.toString());
    setFormAvailability(food.availability);
    setFormIsFeatured(!!food.isFeatured);
    const existingImages = food.images && food.images.length > 0
      ? [...food.images]
      : (food.imageUrl ? [food.imageUrl] : []);
    setFormImages(existingImages);
    setNewImageUrl('');
  };

  // Upload multiple images from system or gallery
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

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
          setFormImages((prev) => [...prev, ...newBase64Images]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setFormImages((prev) => {
      const next = [...prev];
      const [selected] = next.splice(index, 1);
      return [selected, ...next];
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const primaryImage = formImages[0] || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80';

    addFood({
      name: formName.trim(),
      category: formCategory,
      price: parseFloat(formPrice) || 100,
      description: formDescription,
      foodType: formFoodType,
      prepTimeMinutes: parseInt(formPrepTime, 10) || 15,
      availability: formAvailability,
      isFeatured: formIsFeatured,
      imageUrl: primaryImage,
      images: formImages.length > 0 ? formImages : [primaryImage],
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFood || !formName.trim()) return;

    const primaryImage = formImages[0] || editingFood.imageUrl;

    updateFood(editingFood.id, {
      name: formName.trim(),
      category: formCategory,
      price: parseFloat(formPrice) || 100,
      description: formDescription,
      foodType: formFoodType,
      prepTimeMinutes: parseInt(formPrepTime, 10) || 15,
      availability: formAvailability,
      isFeatured: formIsFeatured,
      imageUrl: primaryImage,
      images: formImages.length > 0 ? formImages : [primaryImage],
    });
    setEditingFood(null);
  };

  const filteredFoods = foods.filter((f) => {
    if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <AdminHeader
        title="Menu Management"
        subtitle="Configure restaurant food catalog, pricing, availability, and descriptions"
        onMenuToggle={toggleSidebar}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/gallery"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <ImageIcon className="w-4 h-4" />
              <span>📸 Dish Photos & Gallery</span>
            </Link>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Food</span>
            </button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1 bg-neutral-100 rounded-2xl">
            {['All', ...categories.filter((c) => c !== 'All')].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-xs text-neutral-900 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 shadow-xs"
            />
          </div>
        </div>

        {/* Food Table */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-100 bg-[#FAFAFA] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4">Prep Time</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {filteredFoods.map((food) => (
                  <tr key={food.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-11 h-11 rounded-xl object-cover bg-neutral-100 border border-neutral-200"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                          {food.images && food.images.length > 1 && (
                            <span
                              className="absolute -bottom-1 -right-1 bg-neutral-900 text-amber-300 text-[9px] font-bold px-1 py-0.5 rounded shadow-xs border border-white/20"
                              title={`${food.images.length} images will auto-slide on customer menu`}
                            >
                              +{food.images.length - 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-neutral-900 font-serif-brand block">
                              {food.name}
                            </span>
                            {food.images && food.images.length > 1 && (
                              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>{food.images.length} photos</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-400 line-clamp-1 max-w-xs">
                            {food.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-medium text-neutral-600">
                      {food.category}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <VegNonVegBadge type={food.foodType} size="sm" />
                        <span className="capitalize text-neutral-700 text-[11px]">
                          {food.foodType}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                      ₹{food.price}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-neutral-600">
                      {food.prepTimeMinutes} mins
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={food.availability}
                        onChange={(e) =>
                          updateFood(food.id, {
                            availability: e.target.value as AvailabilityStatus,
                          })
                        }
                        className={`text-[11px] font-semibold px-2 py-1 rounded-md border ${
                          food.availability === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : food.availability === 'OUT OF STOCK'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                        }`}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="OUT OF STOCK">OUT OF STOCK</option>
                        <option value="HIDDEN">HIDDEN</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          updateFood(food.id, { isFeatured: !food.isFeatured })
                        }
                        className={`p-1 rounded-lg transition-colors ${
                          food.isFeatured
                            ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                            : 'text-neutral-300 hover:text-neutral-500'
                        }`}
                        title="Toggle Chef Special / Featured"
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to="/admin/gallery"
                          className="px-2 py-1 text-amber-800 hover:text-amber-950 bg-amber-100/90 hover:bg-amber-200 border border-amber-300/80 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                          title="Upload & manage multiple photos for this dish"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Photos ({food.images?.length || 1})</span>
                        </Link>
                        <button
                          onClick={() => openEditModal(food)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Edit dish"
                          aria-label={`Edit ${food.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFood(food.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete dish"
                          aria-label={`Delete ${food.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Food Modal */}
      {(isAddModalOpen || editingFood) && (
        <Modal
          isOpen={isAddModalOpen || !!editingFood}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingFood(null);
          }}
          title={editingFood ? `Edit ${editingFood.name}` : 'Add New Food Item'}
          subtitle="Configure dish details, category, price, and food type"
          maxWidth="lg"
        >
          <form
            onSubmit={editingFood ? handleSaveEdit : handleSaveAdd}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Paneer Tikka"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as FoodCategory)}
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
                  Price (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Food Type
                </label>
                <select
                  value={formFoodType}
                  onChange={(e) => setFormFoodType(e.target.value as FoodType)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                >
                  <option value="veg">Vegetarian 🟢</option>
                  <option value="non-veg">Non-Vegetarian 🔴</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Preparation Time (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formPrepTime}
                  onChange={(e) => setFormPrepTime(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Availability Status
                </label>
                <select
                  value={formAvailability}
                  onChange={(e) =>
                    setFormAvailability(e.target.value as AvailabilityStatus)
                  }
                  className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OUT OF STOCK">OUT OF STOCK</option>
                  <option value="HIDDEN">HIDDEN</option>
                </select>
              </div>
            </div>

            {/* Multi-Image Gallery Manager */}
            <div className="space-y-3 p-3.5 bg-neutral-50/80 rounded-2xl border border-neutral-200/80">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <label className="block text-xs font-bold text-neutral-900">
                      Dish Photos / Multi-Image Gallery
                    </label>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      {formImages.length} {formImages.length === 1 ? 'image' : 'images'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Add multiple photos from device/gallery or web links. On the menu, they automatically slide and customers can swipe them with finger or mouse!
                  </p>
                </div>

                {/* Upload from Gallery / Device button */}
                <div className="shrink-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device / Gallery</span>
                  </button>
                </div>
              </div>

              {/* Add by URL input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste image web link (https://...)"
                    className="w-full pl-9 pr-3 py-1.5 bg-white text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 shadow-2xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (newImageUrl.trim()) {
                      setFormImages((prev) => [...prev, newImageUrl.trim()]);
                      setNewImageUrl('');
                    }
                  }}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  + Add URL
                </button>
              </div>

              {/* Gallery Thumbnails List */}
              {formImages.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="text-[11px] text-neutral-500 flex items-center justify-between">
                    <span>Active photos (First image is the Primary Cover):</span>
                    <span className="text-[10px] text-amber-800">
                      Hover to change cover or delete
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 bg-white rounded-xl border border-neutral-200/60">
                    {formImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative group rounded-lg overflow-hidden border aspect-square bg-neutral-100 ${
                          idx === 0
                            ? 'border-amber-500 ring-2 ring-amber-500/20'
                            : 'border-neutral-200'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Dish preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                          <div className="flex justify-between items-center">
                            {idx === 0 ? (
                              <span className="px-1.5 py-0.5 bg-amber-500 text-neutral-950 font-bold text-[8px] rounded">
                                Cover
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="px-1.5 py-0.5 bg-white text-neutral-900 font-bold text-[8px] rounded hover:bg-amber-400 transition-colors"
                                title="Set as primary cover"
                              >
                                Set Cover
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="w-4 h-4 flex items-center justify-center bg-red-600 text-white rounded hover:bg-red-700"
                              title="Delete photo"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <span className="text-[9px] text-white/80 font-mono self-end">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Static Cover Badge when not hovering */}
                        {idx === 0 && (
                          <span className="group-hover:hidden absolute bottom-1 left-1 px-1.5 py-0.5 bg-amber-500 text-neutral-950 font-bold text-[8px] rounded shadow-xs">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center text-center bg-white">
                  <ImageIcon className="w-6 h-6 text-neutral-400 mb-1" />
                  <p className="text-xs font-semibold text-neutral-700">No photos added yet</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Click &quot;Upload from Device / Gallery&quot; to pick photos from your phone or PC, or paste a link above.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Description & Ingredients
              </label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Succulent marinated cottage cheese grilled to perfection..."
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formIsFeatured}
                onChange={(e) => setFormIsFeatured(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
              />
              <label htmlFor="isFeatured" className="text-xs font-semibold text-neutral-800">
                Mark as Chef Special / Featured on Menu
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingFood(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl"
              >
                {editingFood ? 'Save Changes' : 'Create Food Item'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
