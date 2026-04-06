import { motion } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    id: 1,
    quote: "An absolutely transcendent dining experience. The truffle arancini was divine, and the atmosphere made our anniversary truly special.",
    author: "Sarah Mitchell",
    verified: true,
  },
  {
    id: 2,
    quote: "The attention to detail in every dish is remarkable. You can taste the passion and expertise in every bite. A must-visit!",
    author: "James Chen",
    verified: true,
  },
  {
    id: 3,
    quote: "From the moment we walked in, we knew this would be special. The wagyu striploin was the best I've ever had.",
    author: "Emma Rodriguez",
    verified: true,
  },
  {
    id: 4,
    quote: "La Maison has become our go-to for special occasions. The staff remembers us and always makes us feel welcome.",
    author: "Michael Thompson",
    verified: true,
  },
  {
    id: 5,
    quote: "The chocolate fondant is worth the visit alone. Paired with their house-made lemonade, it's perfection.",
    author: "Lisa Park",
    verified: true,
  },
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-surface/30 border-t border-stroke py-20 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-display text-4xl text-text-primary">
          What our <span className="italic accent-gradient-text">guests</span> say.
        </h2>
      </div>

      {/* Drag scroll container */}
      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={{ left: -1200, right: 0 }}
        dragElastic={0.05}
        className="flex gap-5 px-6 cursor-grab active:cursor-grabbing w-max"
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="min-w-[320px] md:min-w-[360px] bg-surface border border-stroke rounded-3xl p-7 select-none"
          >
            {/* Stars */}
            <div className="text-accent text-sm mb-4">★★★★★</div>

            {/* Quote */}
            <p className="font-display italic text-lg text-text-primary/85 leading-relaxed mb-6">
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-surface-2 border border-stroke flex items-center justify-center">
                <span className="font-body text-sm text-text-primary">
                  {testimonial.author.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <p className="font-body text-sm text-text-primary">{testimonial.author}</p>
                <p className="font-body text-xs text-muted">Verified Guest</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
