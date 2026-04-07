import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getSettings, updateSettings, type Settings } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { formatPKR } from "@/lib/currency";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin");
      return;
    }
    fetchSettings();
  }, [navigate]);

  const fetchSettings = () => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
    setLoading(false);
  };

  const handleSave = () => {
    if (!settings) return;
    updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentTime = new Date();
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const [openH, openM] = settings.openingTime.split(":").map(Number);
  const [closeH, closeM] = settings.closingTime.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  const isCurrentlyOpen = settings.isOpen && currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-bg flex">
      <AdminSidebar active="settings" />

      {/* Main Content */}
      <main className="ml-60 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-3xl text-text-primary">Settings</h1>
          {saved && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-green-500/15 text-green-400 rounded-full px-3 py-1 font-body text-xs"
            >
              ✓ Saved
            </motion.span>
          )}
        </div>

        <div className="max-w-[700px] space-y-5">
          {/* Card 1 — Restaurant Hours */}
          <div className="bg-surface border border-stroke rounded-3xl p-8">
            <h2 className="font-display italic text-xl text-text-primary mb-6">🕐 Opening Hours</h2>

            {/* Time Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                  Opens At
                </label>
                <input
                  type="time"
                  value={settings.openingTime}
                  onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
                  className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                  Closes At
                </label>
                <input
                  type="time"
                  value={settings.closingTime}
                  onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
                  className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/50"
                />
              </div>
            </div>

            {/* Manual Override Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-stroke">
              <div>
                <p className="font-body text-sm text-text-primary">Temporarily Closed</p>
                <p className="font-body text-xs text-muted mt-0.5">
                  Override automatic hours and mark restaurant as closed
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, isOpen: !settings.isOpen })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.isOpen ? "bg-surface-2 border border-stroke" : "bg-accent"
                }`}
              >
                <motion.div
                  animate={{ x: settings.isOpen ? 2 : 24 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-bg"
                />
              </button>
            </div>

            {/* Preview */}
            <div className="mt-5 rounded-xl bg-surface-2 border border-stroke px-4 py-3">
              <span className="font-body text-sm text-muted">Customers will see: </span>
              <span className="font-body text-sm text-text-primary">
                {isCurrentlyOpen
                  ? `Open today · Closes at ${formatTime(settings.closingTime)}`
                  : "Currently closed"}
              </span>
            </div>
          </div>

          {/* Card 2 — Delivery Fee */}
          <div className="bg-surface border border-stroke rounded-3xl p-8">
            <h2 className="font-display italic text-xl text-text-primary mb-6">🛵 Delivery Settings</h2>

            {/* Fee Field */}
            <div className="mb-4">
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Delivery Fee (Rs.)
              </label>
              <input
                type="number"
                min="0"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: parseInt(e.target.value) || 0 })}
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-accent/50"
              />
            </div>

            {/* Note Field */}
            <div className="mb-4">
              <label className="block font-body text-xs text-muted uppercase tracking-wider mb-2">
                Fee Note (optional)
              </label>
              <input
                type="text"
                maxLength={60}
                value={settings.deliveryFeeNote}
                onChange={(e) => setSettings({ ...settings, deliveryFeeNote: e.target.value })}
                placeholder="e.g. Free delivery on orders above Rs. 3,000"
                className="w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
              />
            </div>

            {/* Preview */}
            <div className="mt-5 rounded-xl bg-surface-2 border border-stroke px-4 py-3">
              <span className="font-body text-sm text-muted">Customers will see: </span>
              <div>
                <span className="font-body text-sm text-text-primary">
                  Delivery: {formatPKR(settings.deliveryFee)}
                </span>
                {settings.deliveryFeeNote && (
                  <p className="font-body text-xs text-muted/70 mt-1">{settings.deliveryFeeNote}</p>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="accent-gradient rounded-xl px-8 py-3.5 font-body font-medium text-sm text-bg mt-2"
          >
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
