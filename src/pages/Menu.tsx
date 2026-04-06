import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { menuItems, categories, type MenuItem } from "@/lib/menuData";
import { useCart } from "@/lib/CartContext";
import { getMenu } from "@/lib/db";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuData, setMenuData] = useState<MenuItem[]>(menuItems);
  const { items, updateQuantity, removeItem, total, addItem } = useCart();

  useEffect(() => {
    const storedMenu = getMenu();
    setMenuData(storedMenu.filter((item) => item.available !== false));
  }, []);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero Banner */}
      <section className="h-[40vh] relative flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600"
            alt="Menu background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-bg/70" />
        </div>
        <h1 className="relative z-10 font-display text-5xl italic text-text-primary">
          Our <span className="accent-gradient-text">Menu.</span>
        </h1>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-16 z-30 bg-bg/90 backdrop-blur-md border-b border-stroke">
        <div className="max-w-[1200px] mx-auto px-6 flex gap-2 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-4 py-2 rounded-full font-body text-sm whitespace-nowrap transition-all ${
                activeCategory === category
                  ? "text-bg"
                  : "bg-surface border border-stroke text-muted hover:text-text-primary"
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="menu-tab"
                  className="absolute inset-0 accent-gradient rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-16">
        {categories
          .filter((cat) => cat !== "All" && (activeCategory === "All" || activeCategory === cat))
          .map((category) => {
            const categoryItems = menuData.filter((item) => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                <h2 className="font-display italic text-2xl text-text-primary mb-6 pt-4 border-t border-stroke">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryItems.map((item, index) => (
                    <MenuItemCard key={item.id} item={item} index={index} addItem={addItem} />
                  ))}
                </div>
              </div>
            );
          })}
      </section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer onClose={() => setCartOpen(false)} items={items} updateQuantity={updateQuantity} removeItem={removeItem} total={total} />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

function MenuItemCard({ item, index, addItem }: { item: MenuItem; index: number; addItem: any }) {
  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface border border-stroke rounded-3xl overflow-hidden group"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-5">
        {item.badge && (
          <span className="inline-block rounded-full bg-surface-2 border border-stroke px-3 py-0.5 font-body text-[10px] text-muted uppercase tracking-wider mb-3">
            {item.badge}
          </span>
        )}
        <h3 className="font-display text-xl text-text-primary mb-1">{item.name}</h3>
        <p className="font-body text-sm text-muted leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-display text-lg text-text-primary">${item.price}</span>
          <button
            onClick={handleAddToCart}
            className="rounded-full border border-stroke px-4 py-2 font-body text-sm text-muted hover:border-accent/50 hover:text-accent hover:bg-accent/5 transition-all duration-200"
          >
            + Add to Order
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CartDrawer({ onClose, items, updateQuantity, removeItem, total }: any) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-bg/60 backdrop-blur-sm z-[200]"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-surface border-l border-stroke z-[300] p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl text-text-primary">Your Order</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-stroke flex items-center justify-center hover:border-accent/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="font-display italic text-muted text-lg">Your cart is empty</p>
            <p className="font-body text-xs text-muted mt-2">
              Add dishes from the menu to get started
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b border-stroke"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full border border-stroke flex items-center justify-center text-muted hover:border-accent/50"
                    >
                      -
                    </button>
                    <span className="font-body text-sm text-muted">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full border border-stroke flex items-center justify-center text-muted hover:border-accent/50"
                    >
                      +
                    </button>
                    <span className="font-body text-sm text-text-primary ml-2">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm text-text-primary">
                      ${(item.price * item.quantity).toFixed(0)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted hover:text-accent text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-stroke">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted">Subtotal</span>
                <span className="font-display text-lg text-text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/order"
              onClick={onClose}
              className="block w-full mt-6 accent-gradient rounded-xl py-3 text-center font-body font-medium text-sm text-bg"
            >
              Proceed to Order →
            </Link>
          </>
        )}
      </motion.div>
    </>
  );
}
