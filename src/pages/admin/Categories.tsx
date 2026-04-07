import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, X } from "lucide-react";
import { getCategories, addCategory, deleteCategory, renameCategory } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function Categories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin");
      return;
    }
    fetchCategories();
  }, [navigate]);

  const fetchCategories = () => {
    const cats = getCategories();
    setCategories(cats);
    setLoading(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim());
    setNewCategoryName("");
    setShowAddForm(false);
    fetchCategories();
  };

  const handleRenameCategory = (oldName: string) => {
    if (!editValue.trim() || editValue === oldName) {
      setEditingCategory(null);
      return;
    }
    renameCategory(oldName, editValue.trim());
    setEditingCategory(null);
    fetchCategories();
  };

  const handleDeleteCategory = (name: string) => {
    deleteCategory(name);
    setDeleteConfirm(null);
    fetchCategories();
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
      <AdminSidebar active="categories" />

      {/* Main Content */}
      <main className="ml-60 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-text-primary">Menu Categories</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="accent-gradient rounded-xl px-4 py-2 font-body text-sm text-bg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-surface border border-stroke rounded-2xl p-6 mb-8 max-w-2xl overflow-hidden"
            >
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Category Name
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="e.g. Soups"
                  className="flex-1 bg-surface-2 border border-stroke rounded-xl px-4 py-2.5 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
                  autoFocus
                />
                <button
                  onClick={handleAddCategory}
                  className="accent-gradient rounded-xl px-6 py-2.5 font-body text-sm text-bg"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategoryName("");
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stroke text-muted hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories List */}
        <div className="space-y-3 max-w-2xl">
          {categories.map((category) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-stroke rounded-2xl px-5 py-4 flex items-center justify-between"
            >
              {/* Left side */}
              <div className="flex items-center gap-3 flex-1">
                <span className="text-muted/40 text-lg">⠿</span>
                {editingCategory === category ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameCategory(category);
                      if (e.key === "Escape") setEditingCategory(null);
                    }}
                    className="flex-1 bg-surface-2 border border-stroke rounded-lg px-3 py-1.5 font-body text-base text-text-primary focus:outline-none focus:border-accent/50"
                    autoFocus
                  />
                ) : (
                  <span className="font-body text-base text-text-primary">{category}</span>
                )}
                {category === "All" && (
                  <span className="bg-surface-2 border border-stroke rounded-full px-2 py-0.5 font-body text-[10px] text-muted">
                    Default
                  </span>
                )}
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-2">
                {editingCategory === category ? (
                  <>
                    <button
                      onClick={() => handleRenameCategory(category)}
                      className="w-8 h-8 rounded-lg border border-accent/50 text-accent flex items-center justify-center hover:bg-accent/10 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="w-8 h-8 rounded-lg border border-stroke text-muted flex items-center justify-center hover:text-text-primary transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : deleteConfirm === category ? (
                  <div className="flex items-center gap-2 bg-surface-2 rounded-lg px-3 py-1.5">
                    <span className="font-body text-xs text-muted">Delete this category?</span>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="font-body text-xs text-accent hover:underline"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="font-body text-xs text-muted hover:text-text-primary"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {category !== "All" && (
                      <>
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setEditValue(category);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-stroke font-body text-xs text-muted hover:text-text-primary hover:border-accent/50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(category)}
                          className="px-3 py-1.5 rounded-lg text-accent/50 hover:text-accent font-body text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <p className="font-body text-xs text-muted/50 mt-6 max-w-2xl">
          Deleting a category does not delete its items — they appear under 'All'.
        </p>
      </main>
    </div>
  );
}
