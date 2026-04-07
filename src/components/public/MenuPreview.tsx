import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { type MenuItem } from "@/lib/menuData";
import { getFeaturedItems } from "@/lib/db";
import { useCart } from "@/lib/CartContext";
import { formatPKR } from "@/lib/currency";

export default function MenuPreview() {
  const { addItem } = useCart();
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const items = getFeaturedItems();
    setFeaturedItems(items);
    setLoading(false);
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
  };

  return (
    <section className="bg-bg py-24 md:py-32 border-t border-stroke">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex justify-between items-end mb-14">
        <div>
          <p className="font-body text-xs text-muted uppercase tracking-[0.4em] mb-3">
            SIGNATURE DISHES
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary">
            Our <span className="italic accent-gradient-text">signature</span> dishes.
          </h2>
        </div>
        <Link
          to="/menu"
          className="hidden sm:block font-body text-sm text-muted hover:text-accent transition-colors"
        >
          View full menu →
        </Link>
      </div>

      {/* Grid */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-surface-2 animate-pulse rounded-3xl overflow-hidden"
            >
              <div className="aspect-[4/3] bg-surface-2" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-surface-2 rounded w-2/3" />
                <div className="h-3 bg-surface-2 rounded w-full" />
                <div className="h-6 bg-surface-2 rounded w-1/3" />
              </div>
            </div>
          ))
        ) : (
          featuredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="bg-surface border border-stroke rounded-3xl overflow-hidden group cursor-pointer"
          >
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Body */}
            <div className="p-5">
              {item.badge && (
                <span className="inline-block rounded-full bg-surface-2 border border-stroke px-3 py-0.5 font-body text-[10px] text-muted uppercase tracking-wider mb-3">
                  {item.badge}
                </span>
              )}
              <h3 className="font-display text-xl text-text-primary mb-1">{item.name}</h3>
              <p className="font-body text-sm text-muted leading-relaxed mb-4 line-clamp-1">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-display text-lg text-text-primary">{formatPKR(item.price)}</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="rounded-full border border-stroke px-3 py-1 font-body text-xs text-muted hover:border-accent/50 hover:text-accent hover:bg-accent/5 transition-all duration-200"
                >
                  + Add
                </button>
              </div>
            </div>
          </motion.div>
          ))
        )}
      </div>

      {/* Mobile View Full Menu Link */}
      <div className="sm:hidden mt-8 text-center">
        <Link
          to="/menu"
          className="font-body text-sm text-muted hover:text-accent transition-colors"
        >
          View full menu →
        </Link>
      </div>
    </section>
  );
}
