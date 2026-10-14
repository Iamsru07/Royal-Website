import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Link as LinkIcon,
  Search,
  CheckCircle2,
  ArrowRight,
  Eye,
  Star,
  RefreshCw,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { FoodItem, FoodCategory } from '../../types';
import { FoodCard } from '../../components/customer/FoodCard';

export const AdminGalleryPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { foods, categories, updateFood, showToast } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFoodId, setSelectedFoodId] = useState<string>(foods[0]?.id || '');
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [replacementUrlInput, setReplacementUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Selected food
  const currentFood = foods.find((f) => f.id === selectedFoodId) || foods[0];

  // Filter foods for list
  const filteredFoods = foods.filter((f) => {
    if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
    }
    return true;
  });

  // Multiple image upload handler from gallery/system
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentFood) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
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
          const existing = currentFood.images && currentFood.images.length > 0
            ? [...currentFood.images]
            : [currentFood.imageUrl];
          const updated = [...existing, ...newBase64Images];

          updateFood(currentFood.id, {
            images: updated,
            imageUrl: updated[0] || currentFood.imageUrl,
          });

          showToast(`${newBase64Images.length} image(s) added to "${currentFood.name}"!`, 'success');
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Add image by URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFood || !urlInput.trim()) return;

    const trimmed = urlInput.trim();
    const existing = currentFood.images && currentFood.images.length > 0
      ? [...currentFood.images]
      : [currentFood.imageUrl];
    const updated = [...existing, trimmed];

    updateFood(currentFood.id, {
      images: updated,
      imageUrl: updated[0] || currentFood.imageUrl,
    });

    setUrlInput('');
    showToast(`Image URL added to "${currentFood.name}"!`, 'success');
  };

  // Remove single image
  const handleRemoveImage = (indexToRemove: number) => {
    if (!currentFood) return;
    const existing = currentFood.images && currentFood.images.length > 0
      ? [...currentFood.images]
      : [currentFood.imageUrl];
    
    if (existing.length <= 1) {
      showToast('Each dish should have at least 1 photo.', 'error');
      return;
    }

    const updated = existing.filter((_, idx) => idx !== indexToRemove);
    updateFood(currentFood.id, {
      images: updated,
      imageUrl: updated[0] || currentFood.imageUrl,
    });
    showToast('Photo removed.', 'info');
  };

  // Set primary cover photo
  const handleSetCover = (index: number) => {
    if (!currentFood || index === 0) return;
    const existing = currentFood.images && currentFood.images.length > 0
      ? [...currentFood.images]
      : [currentFood.imageUrl];

    const copy = [...existing];
    const [selected] = copy.splice(index, 1);
    const updated = [selected, ...copy];

    updateFood(currentFood.id, {
      images: updated,
      imageUrl: updated[0],
    });
    showToast(`Set as primary cover photo for "${currentFood.name}"`, 'success');
  };

  // Reorder / move photo in slider (left or right)
  const handleMoveImage = (fromIndex: number, direction: 'left' | 'right') => {
    if (!currentFood) return;
    const existing = currentFood.images && currentFood.images.length > 0
      ? [...currentFood.images]
      : [currentFood.imageUrl];

    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= existing.length) return;

    const copy = [...existing];
    const temp = copy[fromIndex];
    copy[fromIndex] = copy[toIndex];
    copy[toIndex] = temp;

    updateFood(currentFood.id, {
      images: copy,
      imageUrl: copy[0] || currentFood.imageUrl,
    });
    showToast('Slider photo sequence changed!', 'success');
  };

  // Replace / change existing photo
  const handleReplaceImage = (indexToReplace: number, newSrc: string) => {
    if (!currentFood || !newSrc.trim()) return;
    const existing = currentFood.images && currentFood.images.length > 0
      ? [...currentFood.images]
      : [currentFood.imageUrl];

    const copy = [...existing];
    copy[indexToReplace] = newSrc.trim();

    updateFood(currentFood.id, {
      images: copy,
      imageUrl: copy[0] || currentFood.imageUrl,
    });

    setReplacingIndex(null);
    setReplacementUrlInput('');
    showToast(`Photo #${indexToReplace + 1} successfully changed!`, 'success');
  };

  const handleReplaceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentFood || replacingIndex === null) return;
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleReplaceImage(replacingIndex, result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const currentImages = currentFood
    ? currentFood.images && currentFood.images.length > 0
      ? currentFood.images
      : [currentFood.imageUrl]
    : [];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Dish Images & Sliders Gallery"
        subtitle="Upload multiple dish photos directly from your phone gallery or system. Set covers, manage gallery, and test customer auto-slide & swipe."
        onMenuToggle={toggleSidebar}
      />

      {/* Top Dish Selector & Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Select Dish dropdown */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-neutral-500 mb-1">
              Select Dish to Manage Photos:
            </label>
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 shadow-2xs"
            >
              {foods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name} ({food.category}) — {food.images?.length || 1} photo(s)
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-48">
            <label className="block text-xs font-semibold text-neutral-500 mb-1">
              Filter Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-50 text-xs text-neutral-700 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Upload Button for currently selected dish */}
        <div className="flex items-center gap-2 pt-2 md:pt-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading || !currentFood}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload from Device / Gallery</span>
          </button>
        </div>
      </div>

      {currentFood && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Multi-Photo Manager & Upload Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold font-serif-brand text-neutral-900">
                      {currentFood.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      {currentImages.length} {currentImages.length === 1 ? 'photo' : 'photos'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {currentFood.category} · ₹{currentFood.price} · Dishes with multiple photos will automatically slide and allow customers to swipe with finger or cursor!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photos</span>
                </button>
              </div>

              {/* Paste URL input */}
              <form onSubmit={handleAddUrl} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Or paste an image web link (e.g. https://...)"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600 shadow-2xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  + Add URL
                </button>
              </form>

              {/* Hidden file input for photo replacement */}
              <input
                type="file"
                ref={replaceFileInputRef}
                accept="image/*"
                onChange={handleReplaceFileUpload}
                className="hidden"
              />

              {/* Quick Photo Replacement Inline Bar */}
              {replacingIndex !== null && (
                <div className="p-4 bg-neutral-900 text-white rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">
                      🔄 Replace / Change Photo #{replacingIndex + 1} for "{currentFood.name}"
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplacingIndex(null)}
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
                      <span>Upload Replacement from Device / Gallery</span>
                    </button>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={replacementUrlInput}
                        onChange={(e) => setReplacementUrlInput(e.target.value)}
                        placeholder="Or paste new image web URL"
                        className="flex-1 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-white text-xs rounded-xl focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        disabled={!replacementUrlInput.trim()}
                        onClick={() => handleReplaceImage(replacingIndex, replacementUrlInput)}
                        className="px-3 py-1.5 bg-white text-neutral-900 hover:bg-neutral-200 disabled:opacity-40 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Multi-Image Grid with Cover, Reorder, Replace, and Delete controls */}
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                  <span className="font-semibold text-neutral-700">
                    Uploaded Photos Gallery ({currentImages.length})
                  </span>
                  <span className="text-[11px] text-amber-800">
                    Photo #1 is the Primary Cover card image · Reorder changes auto-slide sequence
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {currentImages.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className={`group relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border-2 transition-all ${
                        idx === 0
                          ? 'border-amber-500 ring-4 ring-amber-500/15 shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`${currentFood.name} photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Number tag */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono font-bold text-white z-10">
                        #{idx + 1}
                      </span>

                      {/* Cover Badge */}
                      {idx === 0 && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 font-bold text-[10px] shadow-xs z-10 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Cover</span>
                        </span>
                      )}

                      {/* Hover action overlay with full Delete, Reorder, and Replace controls */}
                      <div className="absolute inset-0 bg-neutral-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 z-20">
                        {/* Top: Photo # and Delete Button */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-neutral-300 font-mono">
                            Photo {idx + 1} of {currentImages.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="w-7 h-7 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                            title="Delete this photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Middle: Move Left / Move Right Reorder Buttons */}
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, 'left')}
                            className="p-1.5 bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white rounded-lg text-xs transition-colors cursor-pointer"
                            title="Move slide left"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-[10px] text-neutral-300 font-medium">Reorder</span>
                          <button
                            type="button"
                            disabled={idx === currentImages.length - 1}
                            onClick={() => handleMoveImage(idx, 'right')}
                            className="p-1.5 bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white rounded-lg text-xs transition-colors cursor-pointer"
                            title="Move slide right"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Bottom: Change Photo and Make Cover Buttons */}
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setReplacingIndex(idx);
                              setReplacementUrlInput('');
                            }}
                            className="w-full py-1 bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Change Photo</span>
                          </button>

                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(idx)}
                              className="w-full py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-[11px] rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>Set Main Cover</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add more photo card button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300 hover:border-amber-500 hover:bg-amber-50/50 flex flex-col items-center justify-center p-4 text-neutral-500 hover:text-amber-800 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-amber-100 flex items-center justify-center mb-1.5 transition-colors">
                      <Plus className="w-5 h-5 text-neutral-600 group-hover:text-amber-700" />
                    </div>
                    <span className="text-xs font-bold">Add Photo</span>
                    <span className="text-[10px] text-neutral-400">Device/Gallery</span>
                  </button>
                </div>
              </div>

              {/* Tips Banner */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>How multiple images work on the customer menu:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-900/90 pl-1">
                  <li><strong>Auto-slide</strong>: If a dish has 2 or more photos, they will slide automatically every 4 seconds.</li>
                  <li><strong>Finger Slide</strong>: On phone or tablet, customers can swipe left or right with their finger.</li>
                  <li><strong>Cursor Drag</strong>: On desktop, customers can drag left or right with their mouse cursor.</li>
                  <li><strong>Tap for Lightbox</strong>: Clicking any image opens the full-screen photo gallery popup.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Live Customer Preview of the Selected Food */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-neutral-900">
                    Live Customer Preview
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Interactive
                </span>
              </div>

              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                Test how customers will interact with this dish on the menu. Try dragging with your cursor, swiping on touch, or clicking to open the lightbox!
              </p>

              {/* Rendered Live FoodCard */}
              <div className="max-w-sm mx-auto">
                <FoodCard food={currentFood} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dishes Overview Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold font-serif-brand text-neutral-900">
              All Menu Dishes & Photo Counts
            </h3>
            <p className="text-xs text-neutral-500">
              Quickly select any dish below to view, upload, or manage its photos.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-[#FAFAFA] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Total Photos</th>
                <th className="py-3 px-4">Slider Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredFoods.map((food) => {
                const count = food.images?.length || 1;
                const isSelected = food.id === selectedFoodId;
                return (
                  <tr
                    key={food.id}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-amber-50/60 font-semibold' : 'hover:bg-neutral-50/80'
                    }`}
                    onClick={() => {
                      setSelectedFoodId(food.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-10 h-10 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-neutral-900 block font-serif-brand">
                            {food.name}
                          </span>
                          <span className="text-[11px] text-neutral-400">₹{food.price}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px]">
                        {food.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          count > 1
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>{count}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {count > 1 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Auto & Touch Slide Active</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">
                          Single Photo (Static)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFoodId(food.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        Manage Photos →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
