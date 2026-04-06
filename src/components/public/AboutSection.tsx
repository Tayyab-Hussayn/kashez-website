import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const secondaryImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const mainImage = mainImageRef.current;
    const secondaryImage = secondaryImageRef.current;

    if (section && mainImage && secondaryImage) {
      gsap.to(mainImage, {
        y: -30,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(secondaryImage, {
        y: 30,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
    };
  }, []);

  const stats = [
    { number: "15+", label: "Years" },
    { number: "200+", label: "Dishes" },
    { number: "4.9★", label: "Rating" },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-bg py-24 md:py-32 border-t border-stroke"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <p className="font-body text-xs text-muted uppercase tracking-[0.4em] mb-5">
            OUR STORY
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary leading-tight">
            Rooted in <span className="italic accent-gradient-text">tradition.</span>
          </h2>
          <div className="mt-6 space-y-4">
            <p className="font-body text-base text-muted leading-relaxed">
              Founded on a passion for authentic flavors and family recipes passed down through generations, 
              La Maison has been a cornerstone of fine dining since 2018. Our commitment to excellence 
              starts with the finest ingredients and ends with an unforgettable dining experience.
            </p>
            <p className="font-body text-base text-muted leading-relaxed">
              Every dish is prepared fresh daily using locally sourced seasonal ingredients. 
              We work directly with local farmers and artisans to bring you the best of what 
              the season has to offer, transformed through the lens of classical French technique.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl text-text-primary">{stat.number}</p>
                <p className="font-body text-xs text-muted uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Image Collage */}
        <div className="relative">
          <div
            ref={mainImageRef}
            className="aspect-[4/5] rounded-3xl overflow-hidden border border-stroke"
          >
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800"
              alt="Chef preparing food"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            ref={secondaryImageRef}
            className="w-[55%] aspect-square rounded-2xl overflow-hidden border border-stroke absolute bottom-[-20px] left-[-20px]"
          >
            <img
              src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600"
              alt="Food close-up"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
