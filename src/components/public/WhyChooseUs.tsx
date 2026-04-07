import { motion } from "framer-motion";
import { Flame, Leaf, Clock, Star } from "lucide-react";

const cards = [
  {
    icon: Flame,
    title: "Cooked Fresh",
    desc: "Every dish is prepared to order using ingredients sourced fresh that morning from local suppliers.",
  },
  {
    icon: Leaf,
    title: "Locally Sourced",
    desc: "We partner with farms within 50km to bring you seasonal produce at its absolute peak.",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    desc: "Our packaging keeps your food at perfect temperature. Delivered in 35\u201345 minutes.",
  },
  {
    icon: Star,
    title: "Chef-Crafted",
    desc: "Each recipe is designed by our head chef with 15 years of fine dining experience in London and Dubai.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-surface/30 border-t border-b border-stroke py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <p className="font-body text-xs text-muted uppercase tracking-[0.4em] mb-3">
          THE EXPERIENCE
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-text-primary">
          Crafted for those who <span className="italic accent-gradient-text">appreciate</span> the difference.
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface border border-stroke rounded-3xl p-7 group hover:border-accent/30 transition-colors duration-400"
            >
              <card.icon className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-display italic text-xl text-text-primary mb-3">{card.title}</h3>
              <p className="font-body text-sm text-muted leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
