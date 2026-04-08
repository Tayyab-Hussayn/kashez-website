import { type MenuItem, defaultCategories, menuItems } from "./menuData";

export interface Order {
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  orderType: "delivery" | "pickup";
  deliveryAddress?: string;
  location?: { lat: number; lng: number; address: string };
  items: { id: number; name: string; quantity: number; price: number; options?: any }[];
  subtotal: number;
  total: number;
  specialInstructions?: string;
  status: "new" | "preparing" | "ready" | "completed" | "rejected";
  createdAt: string;
  archivedAt: string | null;
}

export interface MenuGalleryImage {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
}

export interface Settings {
  restaurantName: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  deliveryFee: number;
  deliveryFeeNote: string;
}

const ORDERS_KEY = "lamaison_orders";
const MENU_KEY = "lamaison_menu";
const CATEGORIES_KEY = "lamaison_categories";
const GALLERY_KEY = "lamaison_menu_gallery";
const SETTINGS_KEY = "lamaison_settings";

const DEFAULT_SETTINGS: Settings = {
  restaurantName: "La Maison",
  openingTime: "17:00",
  closingTime: "23:00",
  isOpen: true,
  deliveryFee: 150,
  deliveryFeeNote: "Free delivery on orders above Rs. 3,000",
};

// ── Orders ──────────────────────────────────────────

function cleanupOrders(orders: Order[]): Order[] {
  const now = new Date().getTime();
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

  return orders
    .map((order) => {
      // Auto-archive: if not completed and older than 12 hours
      if (
        order.status !== "completed" &&
        order.status !== "rejected" &&
        now - new Date(order.createdAt).getTime() > TWELVE_HOURS
      ) {
        return { ...order, status: "completed" as const, archivedAt: new Date().toISOString() };
      }
      return order;
    })
    .filter((order) => {
      // Delete if archived more than 7 days ago
      if (order.archivedAt && now - new Date(order.archivedAt).getTime() > SEVEN_DAYS) {
        return false;
      }
      return true;
    });
}

function getRawOrders(): Order[] {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (!data) return [];
    const orders: Order[] = JSON.parse(data);
    // Migrate old orders missing archivedAt
    return orders.map((o) => ({
      ...o,
      archivedAt: o.archivedAt !== undefined ? o.archivedAt : null,
    }));
  } catch {
    return [];
  }
}

export function getOrders(): { active: Order[]; history: Order[] } {
  const raw = getRawOrders();
  const cleaned = cleanupOrders(raw);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(cleaned));

  const active = cleaned.filter((o) => o.archivedAt === null);
  const history = cleaned.filter((o) => o.archivedAt !== null);
  return { active, history };
}

// Legacy compat: return all active orders as flat array
export function getActiveOrders(): Order[] {
  return getOrders().active;
}

export function saveOrder(order: Order): void {
  const raw = getRawOrders();
  const cleaned = cleanupOrders(raw);
  cleaned.push({ ...order, archivedAt: null });
  localStorage.setItem(ORDERS_KEY, JSON.stringify(cleaned));
}

export function updateOrderStatus(orderId: string, status: Order["status"]): void {
  const raw = getRawOrders();
  const index = raw.findIndex((o) => o.orderId === orderId);
  if (index !== -1) {
    raw[index].status = status;
    if (status === "completed") {
      raw[index].archivedAt = new Date().toISOString();
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(raw));
  }
}

// ── Menu ────────────────────────────────────────────

export function getMenu(): MenuItem[] {
  try {
    const data = localStorage.getItem(MENU_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMenu(menu: MenuItem[]): void {
  localStorage.setItem(MENU_KEY, JSON.stringify(menu));
}

export function updateMenuItem(item: MenuItem): void {
  const menu = getMenu();
  const index = menu.findIndex((m) => m.id === item.id);
  if (index !== -1) {
    menu[index] = item;
  } else {
    menu.push(item);
  }
  saveMenu(menu);
}

export function deleteMenuItem(id: number): void {
  const menu = getMenu();
  const filtered = menu.filter((m) => m.id !== id);
  saveMenu(filtered);
}

export function toggleFeatured(id: number): void {
  const menu = getMenu();
  const index = menu.findIndex((m) => m.id === id);
  if (index !== -1) {
    menu[index].featured = !menu[index].featured;
    saveMenu(menu);
  }
}

export function getFeaturedItems(): MenuItem[] {
  const menu = getMenu();
  const featured = menu.filter((m) => m.featured && m.available !== false);
  if (featured.length >= 3) return featured;
  // Fallback: first 6 available items
  return menu.filter((m) => m.available !== false).slice(0, 6);
}

// ── Categories ──────────────────────────────────────

export function getCategories(): string[] {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : defaultCategories;
  } catch {
    return defaultCategories;
  }
}

export function saveCategories(cats: string[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
}

export function addCategory(name: string): string[] {
  const cats = getCategories();
  if (!cats.includes(name)) {
    cats.push(name);
    saveCategories(cats);
  }
  return cats;
}

export function deleteCategory(name: string): string[] {
  if (name === "All") return getCategories();
  const cats = getCategories().filter((c) => c !== name);
  saveCategories(cats);
  return cats;
}

export function renameCategory(oldName: string, newName: string): string[] {
  if (oldName === "All") return getCategories();
  const cats = getCategories().map((c) => (c === oldName ? newName : c));
  saveCategories(cats);
  // Also update menu items with old category name
  const menu = getMenu();
  const updated = menu.map((item) =>
    item.category === oldName ? { ...item, category: newName } : item
  );
  saveMenu(updated);
  return cats;
}

// ── Menu Gallery ────────────────────────────────────

export function getMenuGallery(): MenuGalleryImage[] {
  try {
    const data = localStorage.getItem(GALLERY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addMenuGalleryImage(url: string, caption: string): MenuGalleryImage[] {
  const gallery = getMenuGallery();
  gallery.push({
    id: Date.now().toString(),
    url,
    caption,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
  return gallery;
}

export function deleteMenuGalleryImage(id: string): MenuGalleryImage[] {
  const gallery = getMenuGallery().filter((img) => img.id !== id);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
  return gallery;
}

// ── Settings ────────────────────────────────────────

export function getSettings(): Settings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateSettings(partial: Partial<Settings>): Settings {
  const current = getSettings();
  const updated = { ...current, ...partial };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}

export function isRestaurantOpen(settings: Settings): boolean {
  if (!settings.isOpen) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = settings.openingTime.split(":").map(Number);
  const [closeH, closeM] = settings.closingTime.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

// ── Init ────────────────────────────────────────────
// Ensure menu data exists in localStorage on first load
export function initializeData(): void {
  if (!localStorage.getItem(MENU_KEY)) {
    saveMenu(menuItems);
  }
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    saveCategories(defaultCategories);
  }
}
