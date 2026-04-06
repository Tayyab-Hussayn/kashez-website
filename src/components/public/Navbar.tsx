import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount, items, removeItem, total } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/#about" },
    { name: "Reservations", href: "/#reservations" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg/90 backdrop-blur-xl border-b border-stroke/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-display italic text-xl text-text-primary">
            La Maison
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="font-body text-sm text-muted hover:text-text-primary transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 rounded-full border border-stroke flex items-center justify-center hover:border-accent/50 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-muted" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-bg text-[9px] font-body font-medium flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Order Online Button */}
            <Link
              to="/order"
              className="hidden sm:block rounded-full px-5 py-2 font-body text-sm text-bg accent-gradient hover:opacity-90 hover:scale-[1.03] transition-all duration-200 ml-3"
            >
              Order Online
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full border border-stroke flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-muted" />
              ) : (
                <Menu className="w-4 h-4 text-muted" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface border border-stroke rounded-2xl mt-2 mx-6 p-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 font-body text-sm text-muted hover:text-text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/order"
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-3 text-center rounded-full px-5 py-3 font-body text-sm text-bg accent-gradient"
              >
                Order Online
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer onClose={() => setCartOpen(false)} items={items} removeItem={removeItem} total={total} />
        )}
      </AnimatePresence>
    </>
  );
}

function CartDrawer({ onClose, items, removeItem, total }: any) {
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
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm text-muted">{item.quantity}x</span>
                    <span className="font-body text-sm text-text-primary">{item.name}</span>
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
