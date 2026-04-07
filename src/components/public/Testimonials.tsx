import { useRef, useEffect } from "react";
import gsap from "gsap";

const testimonials = [
  {
    id: 1,
    quote: "The short rib was unlike anything I've had in Lahore. Fell apart perfectly, rich sauce, exceptional presentation. Will be back every week.",
    author: "Hamza R.",
    verified: true,
  },
  {
    id: 2,
    quote: "Ordered online for the first time and the food arrived hot and exactly as described. The burrata starter is a must-order.",
    author: "Ayesha K.",
    verified: true,
  },
  {
    id: 3,
    quote: "Celebrated my anniversary here. The staff went above and beyond, the chocolate fondant is absolutely divine. A genuinely special place.",
    author: "Bilal M.",
    verified: true,
  },
  {
    id: 4,
    quote: "The wagyu striploin was perfectly cooked to medium-rare. Atmosphere is intimate and sophisticated. Best fine dining in the city.",
    author: "Sara T.",
    verified: true,
  },
  {
    id: 5,
    quote: "Ordered pickup and was ready in exactly 20 minutes. Packaging was elegant, food quality was restaurant-level even at home.",
    author: "Usman A.",
    verified: true,
  },
];

export default function Testimonials() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!row1Ref.current || !row2Ref.current) return;

    // Row 1 — normal speed
    const anim1 = gsap.to(row1Ref.current, {
      xPercent: -50,
      duration: 35,
      ease: "none",
      repeat: -1,
    });

    // Row 2 — slightly slower (depth effect)
    const anim2 = gsap.to(row2Ref.current, {
      xPercent: -50,
      duration: 50,
      ease: "none",
      repeat: -1,
    });

    return () => {
      anim1.kill();
      anim2.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    gsap.globalTimeline.timeScale(0.15);
  };

  const handleMouseLeave = () => {
    gsap.globalTimeline.timeScale(1);
  };

  return (
    <section
      ref={sectionRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-surface/30 border-t border-stroke py-20 overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-display text-4xl text-text-primary">
          What our <span className="italic accent-gradient-text">guests</span> say.
        </h2>
      </div>

      {/* Row 1 */}
      <div className="mb-5 overflow-hidden">
        <div ref={row1Ref} className="flex gap-5 w-max">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="overflow-hidden">
        <div ref={row2Ref} className="flex gap-5 w-max">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="min-w-[320px] md:min-w-[360px] bg-surface border border-stroke rounded-3xl p-7 select-none">
      {/* Stars */}
      <div className="text-accent text-sm mb-4">★★★★★</div>

      {/* Quote */}
      <p className="font-display italic text-lg text-text-primary/85 leading-relaxed mb-6">
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div>
        <p className="font-body text-sm text-text-primary">{testimonial.author}</p>
        <p className="font-body text-xs text-muted">Verified Guest</p>
      </div>
    </div>
  );
}
