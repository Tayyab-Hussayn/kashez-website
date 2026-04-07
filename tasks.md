# Restaurant Website — Second Pass: All Changes Prompt

---

```markdown
You are modifying the existing La Maison restaurant website (Next.js 14, App Router, TypeScript, Tailwind CSS, GSAP, Framer Motion, JSON file storage). Apply ALL of the following changes carefully without breaking existing functionality. Read every change fully before starting.

---

## CHANGE 1 — Homepage: Signature Dishes Section (Dashboard-Controlled)

The "Our signature dishes" section on the homepage currently renders hardcoded items. Make it fully dynamic.

### Backend
Add a `featured` boolean field to each item in `/data/menu.json` (default `false`). Homepage renders only items where `featured: true`. If fewer than 3 items are marked featured, fall back to showing the first 6 items.

Add API endpoint: `PATCH /api/menu/[id]/featured` — toggles `featured` boolean for that item in `menu.json`.

### Frontend (Homepage)
Change `<MenuPreview />` to fetch from `/api/menu` via `useEffect` + `fetch`, filter for `featured: true`. Show shimmer loading skeletons (3 cards, `bg-surface-2 animate-pulse rounded-3xl`) while fetching.

### Dashboard (Menu Manager)
In each menu item card in Menu Manager, add a **"⭐ Feature on Homepage"** toggle button beside the "Available" toggle.

- OFF state: `border border-stroke text-muted font-body text-xs rounded-full px-3 py-1 hover:border-accent/30`
- ON state: `bg-accent/15 border border-accent/30 text-accent font-body text-xs rounded-full px-3 py-1`

Clicking calls `PATCH /api/menu/[id]/featured`. Update UI optimistically. Show note below: `"Featured items appear in the Homepage Signature Dishes section."` `font-body text-[10px] text-muted/50 mt-1`.

---

## CHANGE 2 — Navbar Cart Icon: Add-to-Cart Animation

When a customer adds any item to cart, the navbar cart icon plays a satisfying, restrained animation sequence.

### Implementation
In `CartContext`, add `const [lastAdded, setLastAdded] = useState(0)` — increment by 1 inside `addItem`. Expose `lastAdded` from context.

In `<Navbar />`, `useEffect` watches `lastAdded`. On every change (when `lastAdded > 0`):

1. **Icon bounce**: Framer Motion `animate` on cart icon SVG — `scale: [1, 1.35, 0.9, 1.15, 1]`, `rotate: [0, -12, 10, -6, 0]`, duration 0.5s, ease "easeOut".
2. **Badge pop**: Count badge `scale: [0, 1.4, 1]`, duration 0.35s, ease "backOut".
3. **Ripple ring**: Absolute `div` around cart icon — `w-9 h-9 rounded-full border-2 border-accent`, animates `scale: 1→2, opacity: 0.8→0` over 0.6s. `AnimatePresence` with key tied to `lastAdded` so it re-fires every add.
4. **Flyup ghost**: `"+ 1"` `font-body text-xs text-accent` floats `y: 0→-24px` + `opacity: 1→0`, duration 0.5s. `AnimatePresence`.

Keep all durations under 600ms total.

---

## CHANGE 3 — Homepage Testimonials: Auto-Scrolling Marquee

Replace drag-scroll testimonials with an infinite two-row auto-scrolling marquee.

### Implementation
Create `<TestimonialsMarquee />`. Render two rows, each containing 5 testimonial cards duplicated (10 total per row) for seamless loop. Use `flex gap-5 w-max` inner div.

```js
// Row 1 — normal speed
gsap.to(row1Ref.current, { xPercent: -50, duration: 35, ease: "none", repeat: -1 });
// Row 2 — slightly slower (depth effect)
gsap.to(row2Ref.current, { xPercent: -50, duration: 50, ease: "none", repeat: -1 });
```

On `mouseenter` of section container: `gsap.globalTimeline.timeScale(0.15)`. On `mouseleave`: `gsap.globalTimeline.timeScale(1)`.

**5 testimonials:**
1. `"The short rib was unlike anything I've had in Lahore. Fell apart perfectly, rich sauce, exceptional presentation. Will be back every week."` — Hamza R., Verified Guest
2. `"Ordered online for the first time and the food arrived hot and exactly as described. The burrata starter is a must-order."` — Ayesha K., Verified Guest
3. `"Celebrated my anniversary here. The staff went above and beyond, the chocolate fondant is absolutely divine. A genuinely special place."` — Bilal M., Verified Guest
4. `"The wagyu striploin was perfectly cooked to medium-rare. Atmosphere is intimate and sophisticated. Best fine dining in the city."` — Sara T., Verified Guest
5. `"Ordered pickup and was ready in exactly 20 minutes. Packaging was elegant, food quality was restaurant-level even at home."` — Usman A., Verified Guest

All cards: `min-w-[320px] md:min-w-[360px] bg-surface border border-stroke rounded-3xl p-7 select-none`. Stars `text-accent`. Quote `font-display italic text-lg text-text-primary/85`. Author `font-body text-sm text-text-primary` + `"Verified Guest"` `font-body text-xs text-muted`.

---

## CHANGE 4 — Homepage: New "Why Choose Us" Section

Add a new section between `<AboutSection />` and `<MenuPreview />`.

`bg-surface/30 border-t border-b border-stroke py-24 md:py-32`.

`max-w-[1200px] mx-auto px-6 md:px-10`.

**Header:**
- Eyebrow: `"THE EXPERIENCE"`
- Heading: `"Crafted for those who *appreciate* the difference."`

**4-column grid** (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16`):

Each card: `bg-surface border border-stroke rounded-3xl p-7 group hover:border-accent/30 transition-colors duration-400`. Large icon `w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform duration-300` + title `font-display italic text-xl text-text-primary mb-3` + desc `font-body text-sm text-muted leading-relaxed`.

Cards:
1. Flame icon — `"Cooked Fresh"` — `"Every dish is prepared to order using ingredients sourced fresh that morning from local suppliers."`
2. Leaf icon — `"Locally Sourced"` — `"We partner with farms within 50km to bring you seasonal produce at its absolute peak."`
3. Clock icon — `"Fast Delivery"` — `"Our packaging keeps your food at perfect temperature. Delivered in 35–45 minutes."`
4. Star icon — `"Chef-Crafted"` — `"Each recipe is designed by our head chef with 15 years of fine dining experience in London and Dubai."`

Framer Motion: `whileInView opacity 0→1, y 30→0`, stagger 0.1s, `viewport={{ once: true }}`.

---

## CHANGE 5 — Menu Page: Editable Categories from Dashboard

### Data
Create `/data/categories.json`:
```json
["All", "Starters", "Mains", "Pasta", "Grills", "Desserts", "Drinks"]
```

### API (`/api/categories/route.ts`)
- `GET` — returns array from `categories.json`
- `POST` — body `{ name: string }` — appends (no duplicates), saves, returns updated array
- `DELETE` — body `{ name: string }` — removes (cannot delete `"All"`), saves, returns updated array
- `PATCH` — body `{ oldName: string, newName: string }` — renames category + updates all matching items in `menu.json`

### Frontend
Both `/menu` and `/order`: fetch categories from `/api/categories` via `useEffect`. Show skeleton pills while loading.

### Dashboard — Category Manager Page
Add sidebar nav item: `"🏷️ Categories"` → `/admin/categories` (between Menu Manager and View Website).

Create `app/admin/categories/page.tsx` (protected, same sidebar). Header: `"Menu Categories"` + `"+ Add Category"` accent button.

**Each category row** (`bg-surface border border-stroke rounded-2xl px-5 py-4 flex items-center justify-between`):
- Left: drag handle `⠿` `text-muted/40 mr-3` + name `font-body text-base text-text-primary`
- Right: `"Edit"` button (inline input on click, confirm ✓ / cancel ✕, calls PATCH) + `"Delete"` button (confirmation popover: `"Delete this category? Items won't be deleted."` with `"Yes, delete"` and `"Cancel"`)
- `"All"` row: `"Default"` badge, no edit/delete

**Add form** (inline expand on button click, Framer Motion height animation):
Input `flex-1 bg-surface-2 border border-stroke rounded-xl px-4 py-2.5 font-body text-sm` placeholder `"e.g. Soups"` + `"Add"` accent button.

Note below: `"Deleting a category does not delete its items — they appear under 'All'."` `font-body text-xs text-muted/50 mt-6`.

---

## CHANGE 6 — Order Page: Live Location, Address Field, Remove Email & Tax

### 6a — Remove Email Field
Delete the email input entirely from the customer details form.

### 6b — Add Manual Address Input
Show only when order type is `"delivery"`:
```
Label: "Delivery Address" — font-body text-xs text-muted uppercase tracking-wider mb-2
Input: w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm
       text-text-primary placeholder:text-muted/50 focus:border-accent/50
Placeholder: "Street, area, landmark..."
```

### 6c — Attach Live Location Button
Place below Delivery Address input (delivery mode only).

**Default state:**
`w-full flex items-center justify-center gap-2 border border-stroke rounded-xl py-3 font-body text-sm text-muted hover:border-accent/40 hover:text-text-primary transition-all duration-200 cursor-pointer mt-2`
Content: 📍 icon + `"Attach Live Location"`

**On click logic:**
```js
navigator.geolocation.getCurrentPosition(
  async (position) => {
    const { latitude: lat, longitude: lng } = position.coords;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    const address = data.display_name || `${lat}, ${lng}`;
    setAttachedLocation({ lat, lng, address });
    setDeliveryAddress(address); // auto-fill address input
  },
  () => { /* show error: "Could not detect location. Please enter manually." */ },
  { timeout: 10000 }
);
```
Loading state: spinner + `"Detecting location..."` while awaiting.

**Success state:**
`w-full flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl py-3 font-body text-sm text-green-400 mt-2`
Content: ✓ icon + `"Location Attached ✓"`

Below: `font-body text-[11px] text-muted/70 mt-2 px-1` — detected address (max 80 chars + `"..."`). Small `"Change"` link resets to default state.

### 6d — Remove Tax Line
Remove `"Taxes (estimated 8%)"` from order summary. Total = `subtotal + deliveryFee` only.

### 6e — Location in Order Payload & Dashboard
Add to POST body: `location: { lat, lng, address }`.
In admin order cards: if location attached, show `"📍 View Location"` link → `https://www.google.com/maps?q=[lat],[lng]` new tab. Style: `font-body text-xs text-accent hover:underline`.

---

## CHANGE 7 — Currency: Switch All USD to PKR

Create utility `lib/currency.ts`:
```ts
export const formatPKR = (amount: number): string =>
  `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
```

Import and use `formatPKR()` everywhere a price is displayed. Remove all `$` symbols. Delivery fee: `Rs. 150`. No decimal places.

**Updated PKR prices:**
```
Truffle Arancini → Rs. 1,950
Burrata & Heritage Tomatoes → Rs. 2,200
Crispy Calamari → Rs. 1,800
Slow-Braised Short Rib → Rs. 5,500
Pan-Seared Sea Bass → Rs. 4,800
Wild Mushroom Risotto → Rs. 3,600
Tagliatelle al Ragù → Rs. 3,300
Cacio e Pepe → Rs. 2,800
Wagyu Striploin 250g → Rs. 9,500
Grilled Lamb Chops → Rs. 6,200
Valrhona Chocolate Fondant → Rs. 1,950
Lemon Posset → Rs. 1,650
Sparkling Lemonade → Rs. 850
Mocktail of the Day → Rs. 1,100
```

---

## CHANGE 8 — Hero Section: Auto-Playing Background Image Carousel

The homepage hero currently shows a single static background image. Add an automatic image carousel behind the existing hero content — everything else (text, CTAs, overlay, scroll indicator) stays exactly as-is.

### Implementation
In `<Hero />`, replace the single `<Image>` with a carousel of 4 images that auto-advances every 5 seconds.

**Images array (all Unsplash, real URLs):**
```ts
const heroImages = [
  "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=1600", // moody restaurant interior
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1600", // plated dish close-up
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600", // candlelit restaurant
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600", // beautiful food spread
];
```

**State:**
```ts
const [activeIndex, setActiveIndex] = useState(0);
```

**Auto-advance:**
```ts
useEffect(() => {
  const timer = setInterval(() => {
    setActiveIndex(prev => (prev + 1) % heroImages.length);
  }, 5000);
  return () => clearInterval(timer);
}, []);
```

**Rendering all 4 images stacked (absolute inset-0 z-0):**
Render all 4 `<Image>` components simultaneously, each `absolute inset-0 object-cover object-center fill`. Transition between them using Framer Motion:
```tsx
// Each image:
<motion.div
  key={index}
  className="absolute inset-0"
  initial={{ opacity: 0 }}
  animate={{ opacity: index === activeIndex ? 1 : 0 }}
  transition={{ duration: 1.5, ease: "easeInOut" }}
>
  <Image src={heroImages[index]} alt="" fill className="object-cover object-center" priority={index === 0} />
</motion.div>
```

Keep all existing overlays (dark gradient, bg-black/60 etc.) on top of the image carousel at the same z-index as before.

**Dot indicators** (bottom-center of hero, above scroll indicator, z-10):
`flex gap-2 items-center justify-center mb-4`.
Each dot: `w-1.5 h-1.5 rounded-full transition-all duration-300`. Active: `bg-accent w-4` (pill-shaped when active). Inactive: `bg-text-primary/30`. Clicking a dot sets `activeIndex`. No labels.

---

## CHANGE 9 — Menu Gallery: Admin-Uploadable Images

Currently the floating menu button's `<MenuGalleryDrawer />` shows 6 hardcoded placeholder tiles labeled "Menu image 1" through "Menu image 6". Replace this entirely with a dynamic system where the admin uploads menu images from the dashboard.

### Data
Create `/data/menuGallery.json`:
```json
[]
```
Each entry: `{ id: string, url: string, caption: string, createdAt: string }`.

### API (`/api/menu-gallery/route.ts`)
- `GET` — returns array from `menuGallery.json` (public, no auth required — website needs it)
- `POST` — protected (check admin cookie). Body: `{ url: string, caption: string }`. Generates `id` (nanoid or `Date.now().toString()`), appends to `menuGallery.json`, returns updated array.
- `DELETE` — protected. Body: `{ id: string }`. Removes entry, returns updated array.

### Frontend — MenuGalleryDrawer
Replace all hardcoded placeholder tiles with a `useEffect` fetch from `/api/menu-gallery`.

**Empty state** (when array is empty):
```
centered in drawer, py-16
icon: 📷 large emoji or camera SVG w-12 h-12 text-muted/40
"No menu images yet" font-display italic text-xl text-muted mt-4
"The restaurant will add menu photos soon." font-body text-sm text-muted/60 mt-2
```

**Loaded state:**
`grid grid-cols-2 gap-3 mt-4`. Each image: `rounded-2xl overflow-hidden aspect-square relative group cursor-pointer`. `<Image fill className="object-cover group-hover:scale-105 transition-transform duration-500" />`. Caption (if any): `absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg/80 to-transparent p-3 font-body text-xs text-text-primary/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300`.

**Lightbox**: clicking any image opens a full-screen lightbox overlay (`fixed inset-0 z-[600] bg-bg/95 flex items-center justify-center`). Shows enlarged image + caption + close button. Arrow buttons to navigate prev/next.

### Dashboard — Menu Gallery Manager Page
Add sidebar nav item: `"🖼️ Menu Gallery"` → `/admin/menu-gallery` (add to sidebar below Categories).

Create `app/admin/menu-gallery/page.tsx` (protected, same sidebar layout).

**Header**: `"Menu Gallery"` `font-display text-3xl text-text-primary` + image count badge `bg-surface border border-stroke rounded-full px-3 py-1 font-body text-xs text-muted ml-3`.

**Add Image form** (at top, always visible — not hidden behind a button):
`bg-surface border border-stroke rounded-2xl p-6 mb-8 max-w-2xl`.
- Label: `"Add New Menu Image"` `font-display italic text-xl text-text-primary mb-5`.
- Two fields side by side on desktop (`grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4`):
  - Image URL input: `flex-1 bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:border-accent/50` placeholder `"Paste image URL (https://...)"`
  - Caption input (below URL on its own row): `w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary placeholder:text-muted/50 focus:border-accent/50` placeholder `"Caption (optional)"`
- **Image preview**: when a valid URL is typed into the URL field, show a live preview `<Image>` thumbnail `w-full aspect-video rounded-xl object-cover mt-4 border border-stroke`. Show on URL change with debounce 600ms. If image fails to load, show `"Invalid image URL"` error.
- `"Add to Gallery"` button: `.accent-gradient rounded-xl px-6 py-3 font-body font-medium text-sm text-bg`. Calls POST `/api/menu-gallery`. On success: clears inputs, shows toast `"Image added to gallery ✓"`, refreshes grid.

**Gallery grid** (`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4`):
Each image card: `relative group rounded-2xl overflow-hidden aspect-square border border-stroke`:
- `<Image fill className="object-cover" />`
- Hover overlay: `absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3`
- Caption text (if any): `font-body text-xs text-text-primary/80 text-center px-3`
- Delete button: `rounded-full border border-accent/50 text-accent font-body text-xs px-4 py-2 hover:bg-accent/10 transition-colors`. On click: confirmation inline `"Delete this image?"` + `"Yes"` / `"No"`. On confirm: DELETE `/api/menu-gallery`.

**Empty state** (same as drawer): centered camera icon + `"No images yet. Add your first menu photo above."`.

---

## CHANGE 10 — Orders: 12-Hour Auto-Archive + 7-Day History Tab

### Data Structure
Update `/data/orders.json` entries to always have: `createdAt: ISO string`, `status: string`, `archivedAt: string | null`.

### Logic — Auto-Archive
In `GET /api/orders` (the admin dashboard fetch), before returning orders:

1. Read all orders from `orders.json`.
2. For each order where `status !== "completed"` AND `createdAt` is more than 12 hours ago: set `status = "completed"`, `archivedAt = new Date().toISOString()`.
3. Permanently delete any order where `archivedAt` is set AND more than 7 days ago.
4. Write back the cleaned array.
5. Return only orders where `archivedAt === null` as `"active"` orders.
6. Return orders where `archivedAt !== null` as `"history"` orders in a separate key.

API response shape:
```ts
{
  active: Order[],   // archivedAt === null
  history: Order[]   // archivedAt !== null, within 7 days
}
```

Also run this same cleanup logic inside `POST /api/orders` (on every new order submission) so the cleanup happens even if the admin dashboard isn't open.

### Dashboard — Orders Page Updates

**Two tabs at top of Orders page** (Framer Motion `layoutId="orders-tab"` sliding pill):
`"📋 Active Orders"` / `"🕐 Order History"`

Active tab: shows existing orders list (same UI as before — stat cards, filter tabs, order cards). Only shows `active` orders.

**History tab** (new):
`"Order History — Last 7 Days"` sub-heading `font-display italic text-2xl text-text-primary mb-6`.

Same order card design but in a slightly muted style (`opacity-75`). No action buttons (status cannot be changed for history). Show `"Archived"` badge in `bg-stroke text-muted` style.

At top of history tab: `"Orders older than 7 days are automatically deleted."` info banner — `bg-surface border border-stroke rounded-xl px-4 py-3 font-body text-xs text-muted/70 mb-6`.

**Empty state for history**: `"No order history yet."` centered, `font-display italic text-muted`.

---

## CHANGE 11 — Admin Settings Page

Add sidebar nav item: `"⚙️ Settings"` → `/admin/settings` (as last item in sidebar, above Sign Out, with a visual divider above it).

Create `app/admin/settings/page.tsx` (protected, same sidebar layout).

### Data
Create `/data/settings.json`:
```json
{
  "restaurantName": "La Maison",
  "openingTime": "17:00",
  "closingTime": "23:00",
  "isOpen": true,
  "deliveryFee": 150,
  "deliveryFeeNote": "Free delivery on orders above Rs. 3,000"
}
```

### API (`/api/settings/route.ts`)
- `GET` — public (no auth) — returns full settings object. Website reads this.
- `PATCH` — protected (admin cookie). Body: partial settings object. Merges and saves. Returns updated settings.

### Settings Page UI

`max-w-[700px]` content area. Header: `"Settings"` `font-display text-3xl text-text-primary` + `"Saved"` flash badge (green, appears 2s after successful save, then fades).

Two setting cards:

---

#### Card 1 — Restaurant Hours

`bg-surface border border-stroke rounded-3xl p-8 mb-5`.

Title: `"🕐 Opening Hours"` `font-display italic text-xl text-text-primary mb-6`.

**Fields row** (`grid grid-cols-2 gap-4`):
- Opening Time: label `"Opens At"` + `<input type="time" />` styled `w-full bg-surface-2 border border-stroke rounded-xl px-4 py-3 font-body text-sm text-text-primary focus:border-accent/50`. Default from `settings.json`.
- Closing Time: label `"Closes At"` + same input. Default from `settings.json`.

**Manual override toggle** (below time fields):
`flex items-center justify-between mt-4 pt-4 border-t border-stroke`.
Left: `"Temporarily Closed"` `font-body text-sm text-text-primary` + `"Override automatic hours and mark restaurant as closed"` `font-body text-xs text-muted mt-0.5`.
Right: Animated toggle switch (Framer Motion). When ON: `bg-accent` pill. When OFF: `bg-surface-2 border border-stroke`. Toggles `isOpen: false` regardless of time.

**Preview line**: `mt-5 rounded-xl bg-surface-2 border border-stroke px-4 py-3 font-body text-sm text-muted`. `"Customers will see: "` + `font-body text-sm text-text-primary` showing either `"Open today · Closes at 11:00 PM"` or `"Currently closed"` based on current values.

---

#### Card 2 — Delivery Fee

`bg-surface border border-stroke rounded-3xl p-8 mb-5`.

Title: `"🛵 Delivery Settings"` `font-display italic text-xl text-text-primary mb-6`.

**Fee field:**
Label: `"Delivery Fee (Rs.)"` `font-body text-xs text-muted uppercase tracking-wider mb-2`.
Input: `type="number" min="0"` styled same as time inputs. Default from `settings.json` `deliveryFee`.

**Note field:**
Label: `"Fee Note (optional)"` `font-body text-xs text-muted uppercase tracking-wider mb-2`.
Input: `type="text"` placeholder `"e.g. Free delivery on orders above Rs. 3,000"`. Max 60 chars. Default from `settings.json` `deliveryFeeNote`.

**Preview line**: `mt-5 rounded-xl bg-surface-2 border border-stroke px-4 py-3 font-body text-sm text-muted`. `"Customers will see: "` + `"Delivery: Rs. [fee]"` + note in `text-muted/70` below if set.

---

#### Save Button
`"Save Settings"` — `.accent-gradient rounded-xl px-8 py-3.5 font-body font-medium text-sm text-bg mt-2`. On click: PATCH `/api/settings` with all changed values. On success: show green `"✓ Settings saved"` toast + flash the `"Saved"` badge in header.

---

### Website Integration — Order Page (Restaurant Hours Check)

In `/order/page.tsx`, on mount fetch `GET /api/settings`.

**If restaurant is closed** (either `isOpen: false` OR current time is outside `openingTime`–`closingTime`):

Show a **closed banner** at the top of the order panel (inside the sticky cart column, above everything else):
```
bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 mb-4
flex items-center gap-3
Icon: 🕐 (or clock SVG text-accent)
"Currently Closed" font-body font-medium text-sm text-text-primary
"We're open [openingTime] – [closingTime]" font-body text-xs text-muted
```

**Disable the "Place Order" button** when restaurant is closed — change to `bg-surface-2 border border-stroke text-muted cursor-not-allowed` and label: `"Restaurant Currently Closed"`.

**If restaurant is open**: show nothing extra — ordering proceeds as normal.

**Time comparison logic:**
```ts
const isRestaurantOpen = (settings: Settings): boolean => {
  if (!settings.isOpen) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = settings.openingTime.split(":").map(Number);
  const [closeH, closeM] = settings.closingTime.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};
```

### Website Integration — Delivery Fee (Dynamic)

In `/order/page.tsx`, replace the hardcoded `Rs. 150` delivery fee with the value fetched from `GET /api/settings`. Show `settings.deliveryFee` in the order summary. If `settings.deliveryFeeNote` is set, show it below the fee line in `font-body text-[11px] text-muted/60`.

Update `formatPKR(settings.deliveryFee)` in the total calculation. Refetch on every page mount so it's always current.

---

## SUMMARY OF ALL SIDEBAR NAV ITEMS (final state)

Update the admin sidebar to contain these items in this order:
```
📋 Orders        → /admin/dashboard
🍽️ Menu Manager  → /admin/menu-manager
🏷️ Categories    → /admin/categories
🖼️ Menu Gallery  → /admin/menu-gallery
🏠 View Website  → / (new tab)
─────────────── (divider)
⚙️ Settings      → /admin/settings
[Sign Out button]
```

---

## Final Instructions for Agent

1. Apply all 11 changes without breaking existing routes, cart state, or auth logic.
2. All new dashboard pages must use the identical sidebar layout component — do not rebuild the sidebar from scratch.
3. Every new API route must check admin cookie for protected endpoints using the same pattern as existing routes.
4. The `GET /api/settings` endpoint must be public (no auth) since the website's order page reads it on the client side.
5. After all changes, do a full search for any remaining hardcoded `$` dollar signs in price displays and replace with `formatPKR()`.
6. The hero carousel must not affect page load performance — use `priority={true}` only on index 0, `priority={false}` on others.
7. The order history cleanup (12h archive, 7d delete) must run on both GET and POST of `/api/orders` so it's always current.
8. Test the restaurant hours logic: if current server time is outside opening hours, the Place Order button should be disabled and the closed banner visible.
```
