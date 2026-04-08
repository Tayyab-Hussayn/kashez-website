import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { getOrders, updateOrderStatus, type Order } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { formatPKR } from "@/lib/currency";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin");
      return;
    }
  }, [navigate]);

  const fetchOrders = useCallback(async () => {
    const { active, history } = await getOrders();
    if (active.length > previousOrderCount && previousOrderCount > 0) {
      setNewOrderAlert(true);
      playNotificationSound();
      setTimeout(() => setNewOrderAlert(false), 5000);
    }
    setPreviousOrderCount(active.length);
    setOrders(active);
    setHistoryOrders(history);
    setLoading(false);
  }, [previousOrderCount]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.error("Audio play failed:", e);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, status: Order["status"]) => {
    await updateOrderStatus(orderId, status);
    fetchOrders();
  };

  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter.toLowerCase());

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const newOrders = orders.filter((o) => o.status === "new").length;
  const preparingOrders = orders.filter((o) => o.status === "preparing").length;
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <AdminSidebar active="orders" />

      {/* Main Content */}
      <main className="ml-60 flex-1 p-8">
        {/* New Order Alert */}
        <AnimatePresence>
          {newOrderAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-accent text-bg px-6 py-4 rounded-xl flex items-center gap-3 z-50"
            >
              <Bell className="w-5 h-5" />
              <span className="font-body text-sm font-medium">New order received!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-text-primary">Orders Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-dot-pulse" />
            <span className="font-body text-sm text-muted">Live</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`relative px-5 py-2 rounded-full font-body text-sm transition-all ${
              activeTab === "active" ? "text-bg" : "bg-surface border border-stroke text-muted"
            }`}
          >
            {activeTab === "active" && (
              <motion.div
                layoutId="orders-tab"
                className="absolute inset-0 accent-gradient rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">📋 Active Orders</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`relative px-5 py-2 rounded-full font-body text-sm transition-all ${
              activeTab === "history" ? "text-bg" : "bg-surface border border-stroke text-muted"
            }`}
          >
            {activeTab === "history" && (
              <motion.div
                layoutId="orders-tab"
                className="absolute inset-0 accent-gradient rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">🕐 Order History</span>
          </button>
        </div>

        {activeTab === "active" ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Today's Orders" value={todayOrders.length.toString()} />
          <StatCard label="New Orders" value={newOrders.toString()} />
          <StatCard label="In Progress" value={preparingOrders.toString()} />
          <StatCard label="Today's Revenue" value={formatPKR(todayRevenue)} />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["All", "New", "Preparing", "Ready", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                filter === status
                  ? "accent-gradient text-bg"
                  : "bg-surface border border-stroke text-muted hover:text-text-primary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-surface border border-stroke rounded-2xl">
              <p className="font-body text-muted">No orders found</p>
            </div>
          ) : (
            filteredOrders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order) => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  getTimeAgo={getTimeAgo}
                />
              ))
          )}
        </div>
          </>
        ) : (
          <>
            {/* History Tab */}
            <div className="mb-6">
              <h2 className="font-display italic text-2xl text-text-primary mb-2">
                Order History — Last 7 Days
              </h2>
              <div className="bg-surface border border-stroke rounded-xl px-4 py-3 mb-6">
                <p className="font-body text-xs text-muted/70">
                  Orders older than 7 days are automatically deleted.
                </p>
              </div>
            </div>

            {/* History Orders List */}
            <div className="space-y-4">
              {historyOrders.length === 0 ? (
                <div className="text-center py-12 bg-surface border border-stroke rounded-2xl">
                  <p className="font-display italic text-muted">No order history yet.</p>
                </div>
              ) : (
                historyOrders
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((order) => (
                    <div key={order.orderId} className="opacity-75">
                      <OrderCard
                        key={order.orderId}
                        order={order}
                        onUpdateStatus={() => {}}
                        getTimeAgo={getTimeAgo}
                        isHistory={true}
                      />
                    </div>
                  ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-stroke rounded-2xl p-5">
      <p className="font-display text-3xl text-text-primary">{value}</p>
      <p className="font-body text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

function OrderCard({
  order,
  onUpdateStatus,
  getTimeAgo,
  isHistory = false,
}: {
  order: Order;
  onUpdateStatus: (id: string, status: Order["status"]) => void;
  getTimeAgo: (date: string) => string;
  isHistory?: boolean;
}) {
  const statusStyles: Record<string, string> = {
    new: "bg-accent/15 text-accent border-accent/30 animate-dot-pulse",
    preparing: "bg-yellow-500/15 text-yellow-400 border-yellow-400/30",
    ready: "bg-green-500/15 text-green-400 border-green-400/30",
    completed: "bg-stroke text-muted border-stroke",
    rejected: "bg-red-500/15 text-red-400 border-red-400/30",
  };

  return (
    <div className="bg-surface border border-stroke rounded-2xl p-5">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Left - Order Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm text-muted">#{order.orderId}</span>
            <span
              className={`rounded-full px-3 py-0.5 font-body text-[10px] uppercase tracking-wider border ${statusStyles[order.status]}`}
            >
              {order.status}
            </span>
            <span className="font-body text-xs text-muted">{getTimeAgo(order.createdAt)}</span>
          </div>

          <p className="font-body font-medium text-sm text-text-primary">{order.customerName}</p>
          <p className="font-body text-xs text-muted">{order.phone}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="font-body text-xs text-muted">
              {order.orderType === "delivery" ? "🛵 Delivery" : "🏪 Pickup"}
            </span>
            {order.deliveryAddress && (
              <span className="font-body text-xs text-muted">• {order.deliveryAddress}</span>
            )}
            {order.location && (
              <a
                href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs text-accent hover:underline ml-1"
              >
                📍 View Location
              </a>
            )}
          </div>
        </div>

        {/* Middle - Items */}
        <div className="flex-1">
          <div className="space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between font-body text-sm">
                <span className="text-text-primary">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-muted">{formatPKR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stroke mt-2 pt-2 flex justify-between">
            <span className="font-body text-xs text-muted">Total</span>
            <span className="font-display text-sm text-text-primary">{formatPKR(order.total)}</span>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex flex-col gap-2">
          {!isHistory && (
            <>
              {order.status === "new" && (
            <>
              <button
                onClick={() => onUpdateStatus(order.orderId, "preparing")}
                className="px-4 py-2 rounded-xl border border-accent text-accent font-body text-sm hover:bg-accent/10 transition-colors"
              >
                Mark Preparing
              </button>
              <button
                onClick={() => onUpdateStatus(order.orderId, "rejected")}
                className="px-4 py-2 rounded-xl text-muted font-body text-sm hover:text-accent/50 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          {order.status === "preparing" && (
            <button
              onClick={() => onUpdateStatus(order.orderId, "ready")}
              className="px-4 py-2 rounded-xl border border-green-400 text-green-400 font-body text-sm hover:bg-green-400/10 transition-colors"
            >
              Mark Ready
            </button>
          )}
          {order.status === "ready" && (
            <button
              onClick={() => onUpdateStatus(order.orderId, "completed")}
              className="px-4 py-2 rounded-xl border border-stroke text-muted font-body text-sm hover:text-text-primary transition-colors"
            >
              Mark Completed
            </button>
          )}
            </>
          )}
          {isHistory && (
            <span className="rounded-full px-3 py-1 font-body text-[10px] uppercase tracking-wider border bg-stroke text-muted border-stroke">
              Archived
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
