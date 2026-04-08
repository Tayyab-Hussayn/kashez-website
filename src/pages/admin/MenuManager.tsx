import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit2, Trash2, Star } from "lucide-react";
import { type MenuItem } from "@/lib/menuData";
import { getMenu, updateMenuItem, deleteMenuItem, toggleFeatured, getCategories } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { formatPKR } from "@/lib/currency";

export default function MenuManager() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin");
      return;
    }
    fetchMenu();
  }, [navigate]);

  const fetchMenu = async () => {
    const [storedMenu, cats] = await Promise.all([getMenu(), getCategories()]);
    setMenu(storedMenu);
    setCategories(cats.filter((c) => c !== "All"));
    setLoading(false);
  };

  const handleSaveItem = async (item: MenuItem) => {
    await updateMenuItem(item);
    fetchMenu();
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await deleteMenuItem(id);
    fetchMenu();
  };

  const handleToggleAvailable = (item: MenuItem) => {
    handleSaveItem({ ...item, available: !item.available });
  };

  const handleToggleFeatured = async (item: MenuItem) => {
    await toggleFeatured(item.id);
    fetchMenu();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <AdminSidebar active="menu-manager" />

      {/* Main Content */}
      <main className="ml-60 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-text-primary">Menu Manager</h1>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            className="accent-gradient rounded-xl px-4 py-2 font-body text-sm text-bg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {menu.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-stroke rounded-2xl p-5"
            >
              {/* Image */}
              <div className="w-full aspect-[3/2] rounded-xl overflow-hidden mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <h3 className="font-display text-lg text-text-primary mb-1">{item.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-surface-2 border border-stroke px-2 py-0.5 font-body text-[10px] text-muted">
                  {item.category}
                </span>
                <span className="font-display text-sm text-text-primary">{formatPKR(item.price)}</span>
              </div>

              {/* Available Toggle */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-sm text-muted">Available</span>
                <button
                  onClick={() => handleToggleAvailable(item)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    item.available !== false ? "bg-accent" : "bg-stroke"
                  }`}
                >
                  <motion.div
                    animate={{ x: item.available !== false ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-bg"
                  />
                </button>
              </div>

              {/* Featured Toggle */}
              <div className="mb-4">
                <button
                  onClick={() => handleToggleFeatured(item)}
                  className={`w-full rounded-full px-3 py-1 font-body text-xs transition-colors ${
                    item.featured
                      ? "bg-accent/15 border border-accent/30 text-accent"
                      : "border border-stroke text-muted hover:border-accent/30"
                  }`}
                >
                  <Star className={`w-3 h-3 inline mr-1 ${item.featured ? "fill-accent" : ""}`} />
                  Feature on Homepage
                </button>
                <p className="font-body text-[10px] text-muted/50 mt-1 text-center">
                  Featured items appear in the Homepage Signature Dishes section.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setShowModal(true);
                  }}
                  className="flex-1 py-2 rounded-xl border border-stroke font-body text-sm text-muted hover:text-text-primary hover:border-accent/50 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="px-3 py-2 rounded-xl text-accent/50 hover:text-accent transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {showModal && (
          <ItemModal
            item={editingItem}
            categories={categories}
            onClose={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
            onSave={handleSaveItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ItemModal({
  item,
  categories,
  onClose,
  onSave,
}: {
  item: MenuItem | null;
  categories: string[];
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}) {
  const [formData, setFormData] = useState<MenuItem>(
    item || {
      id: Date.now(),
      name: "",
      category: "Starters",
      description: "",
      price: 0,
      badge: "",
      image: "",
      hasOptions: false,
      available: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-[400]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 flex items-center justify-center z-[400] p-4"
      >
        <div className="bg-surface border border-stroke rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl text-text-primary">
              {item ? "Edit Item" : "Add Item"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-stroke flex items-center justify-center hover:border-accent/50 transition-colors"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/50"
              />
            </div>

            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/50"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/50 resize-none"
              />
            </div>

            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
                min="0"
                step="0.01"
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/50"
              />
            </div>

            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
              />
            </div>

            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Badge (optional)
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g., Chef's Pick, Vegetarian"
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasOptions"
                checked={formData.hasOptions}
                onChange={(e) => setFormData({ ...formData, hasOptions: e.target.checked })}
                className="w-4 h-4 accent-accent"
              />
              <label htmlFor="hasOptions" className="font-body text-sm text-muted">
                Has customization options
              </label>
            </div>

            <button
              type="submit"
              className="w-full accent-gradient rounded-xl py-4 font-body font-medium text-sm text-bg mt-4"
            >
              {item ? "Save Changes" : "Add Item"}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
