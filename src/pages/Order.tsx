import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart, Minus, Plus, MapPin, Store } from "lucide-react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { type MenuItem } from "@/lib/menuData";
import { useCart } from "@/lib/CartContext";
import { getMenu, saveOrder, getCategories, getSettings, isRestaurantOpen, DEFAULT_SETTINGS, type Order } from "@/lib/db";
import { formatPKR } from "@/lib/currency";
export default function OrderPage() {
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [addressChecked, setAddressChecked] = useState(false);

  const checkAddress = () => {
    if (address.trim()) {
      setAddressChecked(true);
    }
  };

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Order Hero */}
      <section className="bg-bg pt-28 pb-10 px-6 text-center border-b border-stroke">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-text-primary"
        >
          Order <span className="italic accent-gradient-text">online.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-body text-sm text-muted mt-3"
        >
          Fresh food delivered or ready for pickup. Choose your items below.
        </motion.p>

        {/* Order Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 inline-flex bg-surface border border-stroke rounded-full p-1"
        >
          <button
            onClick={() => { setOrderType("delivery"); setAddressChecked(false); }}
            className={`relative px-5 py-2 rounded-full font-body text-sm transition-all ${
              orderType === "delivery" ? "text-text-primary" : "text-muted"
            }`}
          >
            {orderType === "delivery" && (
              <motion.div
                layoutId="order-type"
                className="absolute inset-0 bg-surface-2 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Delivery
            </span>
          </button>
          <button
            onClick={() => { setOrderType("pickup"); setAddressChecked(false); }}
            className={`relative px-5 py-2 rounded-full font-body text-sm transition-all ${
              orderType === "pickup" ? "text-text-primary" : "text-muted"
            }`}
          >
            {orderType === "pickup" && (
              <motion.div
                layoutId="order-type"
                className="absolute inset-0 bg-surface-2 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Store className="w-4 h-4" /> Pickup
            </span>
          </button>
        </motion.div>

        {/* Delivery Address Input */}
        <AnimatePresence>
          {orderType === "delivery" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-md mx-auto mt-4"
            >
              {!addressChecked ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="flex-1 bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                  <button
                    onClick={checkAddress}
                    className="accent-gradient rounded-xl px-4 py-2 font-body text-sm text-bg"
                  >
                    Check
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-green-400 font-body text-sm"
                >
                  <Check className="w-4 h-4" />
                  We deliver to your area! Estimated 35–45 min.
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Order Layout */}
      <OrderLayout orderType={orderType} deliveryAddress={address} />

      <Footer />
    </main>
  );
}

function OrderLayout({ orderType, deliveryAddress }: { orderType: "delivery" | "pickup"; deliveryAddress: string }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [attachedLocation, setAttachedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [restaurantOpen, setRestaurantOpen] = useState(true);

  const { items, updateQuantity, removeItem, total, clearCart, itemCount, addItem } = useCart();

  useEffect(() => {
    (async () => {
      const [storedMenu, cats, currentSettings] = await Promise.all([
        getMenu(),
        getCategories(),
        getSettings(),
      ]);
      setMenuData(storedMenu.filter((item) => item.available !== false));
      setCategories(cats);
      setLoadingCategories(false);
      setSettings(currentSettings);
      setRestaurantOpen(isRestaurantOpen(currentSettings));
    })();
  }, []);

  const handleAttachLocation = () => {
    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const address = data.display_name || `${lat}, ${lng}`;
          setAttachedLocation({ lat, lng, address });
          setManualAddress(address);
          setLocationLoading(false);
        } catch (error) {
          setLocationError("Could not detect location. Please enter manually.");
          setLocationLoading(false);
        }
      },
      () => {
        setLocationError("Could not detect location. Please enter manually.");
        setLocationLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);

    const newOrderId = Math.floor(1000 + Math.random() * 9000).toString();

    const orderData: Order = {
      orderId: newOrderId,
      customerName,
      phone: customerPhone,
      orderType,
      deliveryAddress: orderType === "delivery" ? manualAddress : undefined,
      location: attachedLocation || undefined,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        options: item.options,
      })),
      subtotal: total,
      total: total + (orderType === "delivery" ? settings.deliveryFee : 0),
      status: "new",
      createdAt: new Date().toISOString(),
      archivedAt: null,
    };

    await saveOrder(orderData);
    setOrderId(newOrderId);
    setShowConfirmation(true);
    clearCart();
    setIsSubmitting(false);
  };

  const deliveryFee = orderType === "delivery" ? settings.deliveryFee : 0;
  const finalTotal = total + deliveryFee;

  return (
    <section className="max-w-[1300px] mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
      {/* Left Column - Menu Browser */}
      <div>
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8">
          {loadingCategories ? (
            // Loading skeleton pills
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 bg-surface-2 animate-pulse rounded-full"
              />
            ))
          ) : (
            categories.map((category) => (
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
                  layoutId="order-category-tab"
                  className="absolute inset-0 accent-gradient rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
            ))
          )}
        </div>

        {/* Menu Items */}
        <div className="space-y-12">
          {categories
            .filter((cat) => cat !== "All" && (activeCategory === "All" || activeCategory === cat))
            .map((category) => {
              const categoryItems = menuData.filter((item) => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="font-display italic text-2xl text-text-primary mb-6 pt-4 border-t border-stroke">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categoryItems.map((item) => (
                      <OrderItemCard key={item.id} item={item} addItem={addItem} items={items} updateQuantity={updateQuantity} />
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Right Column - Sticky Order Cart */}
      <div className="lg:sticky lg:top-24 bg-surface border border-stroke rounded-3xl p-6">
        {/* Closed Banner */}
        {!restaurantOpen && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <span className="text-accent text-lg">🕐</span>
            <div>
              <p className="font-body font-medium text-sm text-text-primary">Currently Closed</p>
              <p className="font-body text-xs text-muted">
                We're open {settings.openingTime} – {settings.closingTime}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-2xl text-text-primary">Your Order</h2>
          {itemCount > 0 && (
            <span className="bg-accent/15 text-accent rounded-full text-xs px-2 py-0.5 font-body">
              {itemCount}
            </span>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="font-display italic text-muted text-lg">Your order is empty</p>
            <p className="font-body text-xs text-muted mt-2">
              Add dishes from the menu to get started
            </p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="space-y-3 mt-4 max-h-[40vh] overflow-y-auto scrollbar-thin">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b border-stroke last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-muted">{item.quantity}x</span>
                    <span className="font-body text-sm text-text-primary ml-2">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm text-text-primary">
                      {formatPKR(item.price * item.quantity)}
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

            {/* Subtotals */}
            <div className="mt-4 pt-4 border-t border-stroke space-y-2">
              <div className="flex justify-between">
                <span className="font-body text-sm text-muted">Subtotal</span>
                <span className="font-body text-sm text-text-primary">{formatPKR(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-sm text-muted">Delivery</span>
                <div className="text-right">
                  <span className="font-body text-sm text-text-primary">
                    {orderType === "delivery" ? formatPKR(settings.deliveryFee) : "Free"}
                  </span>
                  {orderType === "delivery" && settings.deliveryFeeNote && (
                    <p className="font-body text-[11px] text-muted/60 mt-0.5">
                      {settings.deliveryFeeNote}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between pt-3 border-t border-stroke mt-3">
                <span className="font-display text-lg text-text-primary">Total</span>
                <span className="font-display text-lg text-text-primary">{formatPKR(finalTotal)}</span>
              </div>
            </div>

            {/* Order Type Summary */}
            <div className="bg-surface-2 border border-stroke rounded-xl p-3 mt-4 font-body text-xs text-muted">
              {orderType === "delivery" ? (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Delivery to: {manualAddress || deliveryAddress || "Your address"}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Pickup — ready in ~20 min
                </div>
              )}
            </div>

            {/* Customer Details Form */}
            <div className="mt-5 space-y-3">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
              />

              {/* Delivery Address - only for delivery */}
              {orderType === "delivery" && (
                <>
                  <div>
                    <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="Street, area, landmark..."
                      className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>

                  {/* Attach Live Location Button */}
                  {!attachedLocation ? (
                    <button
                      type="button"
                      onClick={handleAttachLocation}
                      disabled={locationLoading}
                      className="w-full flex items-center justify-center gap-2 border border-stroke rounded-xl py-3 font-body text-sm text-muted hover:border-accent/40 hover:text-text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {locationLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-4 h-4 border-2 border-muted border-t-transparent rounded-full"
                          />
                          Detecting location...
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          Attach Live Location
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="mt-2">
                      <div className="w-full flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl py-3 font-body text-sm text-green-400">
                        <Check className="w-4 h-4" />
                        Location Attached ✓
                      </div>
                      <p className="font-body text-[11px] text-muted/70 mt-2 px-1">
                        {attachedLocation.address.length > 80
                          ? attachedLocation.address.substring(0, 80) + "..."
                          : attachedLocation.address}
                        {" "}
                        <button
                          onClick={() => setAttachedLocation(null)}
                          className="text-accent hover:underline ml-1"
                        >
                          Change
                        </button>
                      </p>
                    </div>
                  )}

                  {locationError && (
                    <p className="font-body text-xs text-accent/70 mt-1">{locationError}</p>
                  )}
                </>
              )}

              <p className="font-body text-[10px] text-muted/60 text-center">
                No account needed — we'll confirm by SMS.
              </p>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={items.length === 0 || !customerName || !customerPhone || isSubmitting || !restaurantOpen}
              className="w-full accent-gradient rounded-xl py-4 mt-5 font-body font-medium text-sm text-bg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full"
                  />
                  Processing...
                </span>
              ) : !restaurantOpen ? (
                "Restaurant Currently Closed"
              ) : (
                `Place Order — ${formatPKR(finalTotal)}`
              )}
            </button>
          </>
        )}
      </div>

      {/* Order Confirmation Overlay */}
      <AnimatePresence>
        {showConfirmation && (
          <OrderConfirmation
            orderId={orderId}
            customerName={customerName}
            orderType={orderType}
            onClose={() => setShowConfirmation(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function OrderItemCard({ item, addItem, items, updateQuantity }: { item: MenuItem; addItem: any; items: any[]; updateQuantity: any }) {
  const cartItem = items.find((i) => i.id === item.id);
  const [showModal, setShowModal] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState("medium");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleAdd = () => {
    if (item.hasOptions) {
      setShowModal(true);
    } else {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }
  };

  const handleConfirmAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      options: { spiceLevel, specialInstructions },
    });
    setShowModal(false);
    setSpiceLevel("medium");
    setSpecialInstructions("");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-surface border border-stroke rounded-2xl p-4 flex gap-4 group"
      >
        {/* Image */}
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-text-primary truncate">{item.name}</h3>
          <p className="font-body text-sm text-muted leading-relaxed mb-2 line-clamp-1">
            {item.description}
          </p>

          {/* Badges */}
          {item.badge && (
            <span className="inline-block rounded-full bg-surface-2 border border-stroke text-[10px] font-body text-muted px-2 py-0.5 mb-2">
              {item.badge}
            </span>
          )}

          {/* Bottom Row */}
          <div className="flex justify-between items-center mt-1">
            <span className="font-display text-lg text-text-primary">{formatPKR(item.price)}</span>

            {cartItem ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                  className="w-7 h-7 rounded-full border border-stroke flex items-center justify-center text-muted hover:border-accent/50 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <motion.span
                  key={cartItem.quantity}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="font-body text-sm text-text-primary w-4 text-center"
                >
                  {cartItem.quantity}
                </motion.span>
                <button
                  onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                  className="w-7 h-7 rounded-full border border-stroke flex items-center justify-center text-muted hover:border-accent/50 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="rounded-full border border-stroke px-3 py-1 font-body text-xs text-muted hover:border-accent/50 hover:text-accent hover:bg-accent/5 transition-all duration-200"
              >
                + Add
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Customization Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-bg/70 backdrop-blur-sm z-[400]"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-[400]"
            >
              <div className="bg-surface border border-stroke rounded-t-3xl md:rounded-3xl p-8 max-w-md w-full mx-auto md:my-auto">
                <div className="flex gap-4 mb-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-display text-xl text-text-primary">{item.name}</h3>
                    <p className="font-body text-sm text-muted">${item.price}</p>
                  </div>
                </div>

                {/* Spice Level */}
                <div className="mb-4">
                  <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                    Spice Level
                  </label>
                  <div className="flex gap-2">
                    {["Mild", "Medium", "Hot"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSpiceLevel(level.toLowerCase())}
                        className={`flex-1 py-2 rounded-xl font-body text-sm border transition-all ${
                          spiceLevel === level.toLowerCase()
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-stroke text-muted hover:border-accent/50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="mb-6">
                  <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any allergies or preferences..."
                    className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 resize-none"
                    rows={3}
                  />
                </div>

                {/* Add Button */}
                <button
                  onClick={handleConfirmAdd}
                  className="w-full accent-gradient rounded-xl py-4 font-body font-medium text-sm text-bg"
                >
                  Add to Order — ${item.price}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function OrderConfirmation({
  orderId,
  customerName,
  orderType,
  onClose,
}: {
  orderId: string;
  customerName: string;
  orderType: "delivery" | "pickup";
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-bg flex flex-col items-center justify-center text-center px-6"
    >
      {/* Animated Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        className="w-24 h-24 rounded-full border-4 border-accent flex items-center justify-center mb-8"
      >
        <motion.svg
          className="w-12 h-12 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display text-5xl text-text-primary mb-4"
      >
        Order Placed!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="font-body text-base text-muted mb-2"
      >
        Thank you, {customerName}! We've received your order.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="font-mono text-xs text-muted mb-6"
      >
        Order #{orderId}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-2 text-muted font-body text-sm mb-8"
      >
        <span>🕐</span>
        {orderType === "delivery" ? "Ready in ~35–45 min" : "Ready in ~20 min"}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={onClose}
        className="accent-gradient rounded-full px-8 py-4 font-body font-medium text-sm text-bg"
      >
        Back to Menu
      </motion.button>
    </motion.div>
  );
}
