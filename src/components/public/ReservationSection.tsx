import { useState } from "react";
import { motion } from "framer-motion";

export default function ReservationSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    requests: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="reservations" className="bg-bg border-t border-stroke py-24 md:py-32">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl md:text-6xl text-text-primary"
        >
          Reserve your <span className="italic accent-gradient-text">table.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-body text-base text-muted max-w-md mx-auto mt-6 mb-12"
        >
          Book your table for an unforgettable dining experience. We'll confirm your reservation by email.
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-surface border border-stroke rounded-3xl p-8 md:p-12 text-left"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Time
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
              >
                <option value="">Select time</option>
                <option value="18:00">6:00 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="21:00">9:00 PM</option>
              </select>
            </div>

            {/* Guests */}
            <div>
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Number of Guests
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Requests */}
            <div className="sm:col-span-2">
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Special Requests
              </label>
              <textarea
                name="requests"
                value={formData.requests}
                onChange={handleChange}
                rows={3}
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                placeholder="Any dietary requirements or special occasions..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full accent-gradient rounded-xl py-4 mt-6 font-body font-medium text-sm text-bg hover:opacity-90 transition-opacity"
          >
            {submitted ? "Request Sent!" : "Request Reservation"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
