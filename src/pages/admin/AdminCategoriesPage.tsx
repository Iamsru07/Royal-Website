import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Edit2, Trash2, UtensilsCrossed, Layers } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Modal } from '../../components/common/Modal';
import { FoodCategory } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { categories, addCategory, deleteCategory, foods } = useRestaurant();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const openAddModal = () => {
    setCategoryName('');
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    addCategory(categoryName.trim());
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !categoryName.trim()) return;
    // Replace old category
    deleteCategory(editingCategory);
    addCategory(categoryName.trim());
    setEditingCategory(null);
  };

  return (
    <>
      <AdminHeader
        title="Food Categories"
        subtitle="Organize your restaurant menu into intuitive browsing sections"
        onMenuToggle={toggleSidebar}
        actions={
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories
            .filter((c) => c !== 'All')
            .map((cat) => {
              const itemCount = foods.filter((f) => f.category === cat).length;

              return (
                <div
                  key={cat}
                  className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-xs hover:border-neutral-200 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 font-serif-brand">
                        {cat}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        {itemCount} {itemCount === 1 ? 'dish' : 'dishes'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryName(cat);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Edit category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Food Category"
        subtitle="Create a new section for your dining menu"
        maxWidth="sm"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sizzlers & Grills"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl"
            >
              Create Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      {editingCategory && (
        <Modal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          title={`Edit ${editingCategory}`}
          subtitle="Rename this menu category"
          maxWidth="sm"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-600"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
