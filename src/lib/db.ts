import { supabase } from "./supabase";
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

export const DEFAULT_SETTINGS: Settings = {
  restaurantName: "La Maison",
  openingTime: "17:00",
  closingTime: "23:00",
  isOpen: true,
  deliveryFee: 150,
  deliveryFeeNote: "Free delivery on orders above Rs. 3,000",
};

// ── Row mappers ──────────────────────────────────────

function mapMenuRow(row: any): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    price: row.price,
    category: row.category,
    image: row.image || "",
    badge: row.badge || "",
    hasOptions: row.has_options || false,
    available: row.available !== false,
    featured: row.featured || false,
    options: row.options,
  };
}

function mapMenuItemToRow(item: MenuItem) {
  return {
    id: item.id,
    name: item.name,
    description: item.description || "",
    price: item.price,
    category: item.category,
    image: item.image || "",
    badge: item.badge || "",
    has_options: item.hasOptions || false,
    available: item.available !== false,
    featured: item.featured || false,
    options: item.options ?? null,
  };
}

function mapGalleryRow(row: any): MenuGalleryImage {
  return {
    id: row.id,
    url: row.url,
    caption: row.caption || "",
    createdAt: row.created_at,
  };
}

function mapSettingsRow(row: any): Settings {
  return {
    restaurantName: row.restaurant_name ?? DEFAULT_SETTINGS.restaurantName,
    openingTime: row.opening_time ?? DEFAULT_SETTINGS.openingTime,
    closingTime: row.closing_time ?? DEFAULT_SETTINGS.closingTime,
    isOpen: row.is_open ?? DEFAULT_SETTINGS.isOpen,
    deliveryFee: row.delivery_fee ?? DEFAULT_SETTINGS.deliveryFee,
    deliveryFeeNote: row.delivery_fee_note ?? DEFAULT_SETTINGS.deliveryFeeNote,
  };
}

function mapOrderRow(row: any): Order {
  return {
    orderId: row.order_id,
    customerName: row.customer_name,
    phone: row.phone,
    orderType: row.order_type,
    deliveryAddress: row.delivery_address,
    location: row.location,
    items: row.items,
    subtotal: row.subtotal,
    total: row.total,
    specialInstructions: row.special_instructions,
    status: row.status,
    createdAt: row.created_at,
    archivedAt: row.archived_at ?? null,
  };
}

// ── Menu ────────────────────────────────────────────

export async function getMenu(): Promise<MenuItem[]> {
  const { data, error } = await supabase.from("menu_items").select("*").order("id");
  if (error) { console.error("getMenu:", error); return []; }
  return (data || []).map(mapMenuRow);
}

export async function updateMenuItem(item: MenuItem): Promise<void> {
  const { error } = await supabase.from("menu_items").upsert(mapMenuItemToRow(item));
  if (error) console.error("updateMenuItem:", error);
}

export async function deleteMenuItem(id: number): Promise<void> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) console.error("deleteMenuItem:", error);
}

export async function toggleFeatured(id: number): Promise<void> {
  const { data } = await supabase.from("menu_items").select("featured").eq("id", id).single();
  if (data) {
    await supabase.from("menu_items").update({ featured: !data.featured }).eq("id", id);
  }
}

export async function getFeaturedItems(): Promise<MenuItem[]> {
  const { data: featured } = await supabase
    .from("menu_items")
    .select("*")
    .eq("featured", true)
    .eq("available", true);
  if (featured && featured.length >= 3) return featured.map(mapMenuRow);

  const { data: all } = await supabase
    .from("menu_items")
    .select("*")
    .eq("available", true)
    .order("id")
    .limit(6);
  return (all || []).map(mapMenuRow);
}

// ── Categories ──────────────────────────────────────

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("categories").select("name").order("name");
  if (error || !data || data.length === 0) return defaultCategories;
  const names = data.map((r: any) => r.name as string);
  // Always put "All" first
  return ["All", ...names.filter((n) => n !== "All")];
}

export async function addCategory(name: string): Promise<void> {
  const { error } = await supabase.from("categories").insert({ name });
  if (error) console.error("addCategory:", error);
}

export async function deleteCategory(name: string): Promise<void> {
  if (name === "All") return;
  const { error } = await supabase.from("categories").delete().eq("name", name);
  if (error) console.error("deleteCategory:", error);
}

export async function renameCategory(oldName: string, newName: string): Promise<void> {
  if (oldName === "All") return;
  await supabase.from("categories").update({ name: newName }).eq("name", oldName);
  await supabase.from("menu_items").update({ category: newName }).eq("category", oldName);
}

// ── Menu Gallery ────────────────────────────────────

export async function getMenuGallery(): Promise<MenuGalleryImage[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("getMenuGallery:", error); return []; }
  return (data || []).map(mapGalleryRow);
}

export async function addMenuGalleryImage(url: string, caption: string): Promise<void> {
  const { error } = await supabase.from("gallery_images").insert({
    id: Date.now().toString(),
    url,
    caption,
  });
  if (error) console.error("addMenuGalleryImage:", error);
}

export async function deleteMenuGalleryImage(id: string): Promise<void> {
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) console.error("deleteMenuGalleryImage:", error);
}

// ── Settings ────────────────────────────────────────

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
  if (error || !data) return DEFAULT_SETTINGS;
  return mapSettingsRow(data);
}

export async function updateSettings(partial: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const updated = { ...current, ...partial };
  const { error } = await supabase.from("settings").upsert({
    id: 1,
    restaurant_name: updated.restaurantName,
    opening_time: updated.openingTime,
    closing_time: updated.closingTime,
    is_open: updated.isOpen,
    delivery_fee: updated.deliveryFee,
    delivery_fee_note: updated.deliveryFeeNote,
  });
  if (error) console.error("updateSettings:", error);
  return updated;
}

export function isRestaurantOpen(settings: Settings): boolean {
  if (!settings.isOpen) return false;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = settings.openingTime.split(":").map(Number);
  const [ch, cm] = settings.closingTime.split(":").map(Number);
  return cur >= oh * 60 + om && cur < ch * 60 + cm;
}

// ── Orders ──────────────────────────────────────────

export async function getOrders(): Promise<{ active: Order[]; history: Order[] }> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("getOrders:", error); return { active: [], history: [] }; }

  const now = Date.now();
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const orders = (data || []).map(mapOrderRow);

  // Auto-archive stale active orders
  const toArchive = orders.filter(
    (o) =>
      !o.archivedAt &&
      o.status !== "completed" &&
      o.status !== "rejected" &&
      now - new Date(o.createdAt).getTime() > TWELVE_HOURS
  );
  if (toArchive.length > 0) {
    await supabase
      .from("orders")
      .update({ status: "completed", archived_at: new Date().toISOString() })
      .in("order_id", toArchive.map((o) => o.orderId));
  }

  // Delete orders archived > 7 days ago
  const toDelete = orders.filter(
    (o) => o.archivedAt && now - new Date(o.archivedAt).getTime() > SEVEN_DAYS
  );
  if (toDelete.length > 0) {
    await supabase
      .from("orders")
      .delete()
      .in("order_id", toDelete.map((o) => o.orderId));
  }

  const archivedAt = new Date().toISOString();
  const cleaned = orders
    .map((o) =>
      toArchive.find((a) => a.orderId === o.orderId)
        ? { ...o, status: "completed" as const, archivedAt }
        : o
    )
    .filter((o) => !toDelete.find((d) => d.orderId === o.orderId));

  return {
    active: cleaned.filter((o) => !o.archivedAt),
    history: cleaned.filter((o) => !!o.archivedAt),
  };
}

export async function saveOrder(order: Order): Promise<void> {
  const { error } = await supabase.from("orders").insert({
    order_id: order.orderId,
    customer_name: order.customerName,
    phone: order.phone,
    order_type: order.orderType,
    delivery_address: order.deliveryAddress ?? null,
    location: order.location ?? null,
    items: order.items,
    subtotal: order.subtotal,
    total: order.total,
    special_instructions: order.specialInstructions ?? null,
    status: order.status,
    created_at: order.createdAt,
    archived_at: order.archivedAt,
  });
  if (error) console.error("saveOrder:", error);
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<void> {
  const update: Record<string, unknown> = { status };
  if (status === "completed") update.archived_at = new Date().toISOString();
  const { error } = await supabase.from("orders").update(update).eq("order_id", orderId);
  if (error) console.error("updateOrderStatus:", error);
}

// ── Init: seeds DB on first run ─────────────────────

export async function initializeData(): Promise<void> {
  const { count: menuCount } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true });
  if (menuCount === 0) {
    await supabase.from("menu_items").insert(menuItems.map(mapMenuItemToRow));
  }

  const { count: catCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });
  if (catCount === 0) {
    await supabase.from("categories").insert(
      defaultCategories.filter((c) => c !== "All").map((name) => ({ name }))
    );
  }
}
