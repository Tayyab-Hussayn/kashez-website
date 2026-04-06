import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Order Online", href: "/order" },
    { name: "Reservations", href: "/#reservations" },
    { name: "About", href: "/#about" },
  ];

  const marqueeText = "FINE DINING • FRESH INGREDIENTS • LOCAL SOURCING • CRAFTED WITH LOVE • ";

  return (
    <footer className="bg-bg border-t border-stroke pt-16 pb-8">
      {/* Marquee */}
      <div className="overflow-hidden mb-12">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {Array(8)
            .fill(marqueeText)
            .map((text, i) => (
              <span
                key={i}
                className="font-display italic text-[3vw] text-stroke/25 mr-4"
              >
                {text}
              </span>
            ))}
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Column 1 - Logo & Info */}
        <div>
          <h3 className="font-display italic text-2xl text-text-primary mb-4">
            La Maison
          </h3>
          <p className="font-body text-sm text-muted leading-relaxed mb-4">
            123 Culinary Avenue<br />
            New York, NY 10001
          </p>
          <div className="font-body text-sm text-muted">
            <p className="mb-1">
              <span className="text-text-primary">Mon–Fri:</span> 5PM–11PM
            </p>
            <p>
              <span className="text-text-primary">Sat–Sun:</span> 12PM–11PM
            </p>
          </div>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h4 className="font-body text-xs text-muted uppercase tracking-wider mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className="font-body text-sm text-muted hover:text-text-primary transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 - Contact */}
        <div>
          <h4 className="font-body text-xs text-muted uppercase tracking-wider mb-4">
            Contact
          </h4>
          <p className="font-body text-sm text-muted mb-2">
            reservations@lamaison.com
          </p>
          <p className="font-body text-sm text-muted mb-4">
            +1 (555) 123-4567
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-stroke flex items-center justify-center hover:border-accent/50 transition-colors"
            >
              <svg className="w-4 h-4 text-muted" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-stroke flex items-center justify-center hover:border-accent/50 transition-colors"
            >
              <svg className="w-4 h-4 text-muted" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.503c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.126-5.864 10.126-11.854z"/>
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-stroke flex items-center justify-center hover:border-accent/50 transition-colors"
            >
              <svg className="w-4 h-4 text-muted" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2.4c5.295 0 9.6 4.305 9.6 9.6 0 5.295-4.305 9.6-9.6 9.6-5.295 0-9.6-4.305-9.6-9.6 0-5.295 4.305-9.6 9.6-9.6zm-1.2 4.8v3.6h-2.4v2.4h2.4v7.2h2.4v-7.2h2.4v-2.4h-2.4v-3.6c0-.663.537-1.2 1.2-1.2h1.2v-2.4h-1.2c-1.989 0-3.6 1.611-3.6 3.6z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 mt-12 pt-8 border-t border-stroke flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-body text-xs text-muted">
          © 2026 La Maison. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-dot-pulse" />
          <span className="font-body text-xs text-muted">Open today until 11PM</span>
        </div>
      </div>
    </footer>
  );
}
