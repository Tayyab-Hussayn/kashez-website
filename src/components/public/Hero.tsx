import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function Hero() {
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headlineRef.current) {
      const lines = headlineRef.current.querySelectorAll(".headline-line");
      gsap.fromTo(
        lines,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.1,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }
  }, []);

  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=1600"
          alt="Restaurant interior"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/60 to-bg" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto pt-20">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-body text-xs text-muted uppercase tracking-[0.5em] mb-8"
        >
          EST. 2018 — FINE DINING
        </motion.p>

        {/* Headline */}
        <div ref={headlineRef} className="mb-8">
          <div className="headline-line font-display text-[13vw] sm:text-[9vw] md:text-[7.5vw] leading-[0.88] tracking-tight text-text-primary">
            Where every
          </div>
          <div className="headline-line font-display text-[13vw] sm:text-[9vw] md:text-[7.5vw] leading-[0.88] tracking-tight italic accent-gradient-text">
            dish tells
          </div>
          <div className="headline-line font-display text-[10vw] sm:text-[7vw] md:text-[5.5vw] leading-[0.88] tracking-tight text-text-primary">
            a story.
          </div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-body font-light text-base md:text-lg text-muted max-w-lg mx-auto mb-12"
        >
          Handcrafted dishes, locally sourced ingredients, and an atmosphere that makes every meal memorable.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/order"
            className="rounded-full px-8 py-4 font-body font-medium text-sm text-bg accent-gradient hover:scale-[1.04] transition-all duration-200"
            style={{ boxShadow: "0 0 24px rgba(200,71,42,0.35)" }}
          >
            Order Online →
          </Link>
          <Link
            to="/menu"
            className="rounded-full px-8 py-4 border border-stroke text-muted font-body text-sm hover:text-text-primary hover:border-accent/40 transition-all duration-300"
          >
            View Menu
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-muted to-transparent" />
      </motion.div>
    </section>
  );
}
