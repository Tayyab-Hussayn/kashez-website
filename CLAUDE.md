# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Vite production build (`vite build`)
- `npm run typecheck` — TypeScript type checking only (`tsc -b`)
- `npm run lint` — ESLint across the project
- `npm run preview` — Preview the production build locally

## Architecture

This is **La Maison** — a restaurant website with online ordering and an admin panel. Built with React 19, TypeScript, Vite 7, Tailwind CSS 3, and shadcn/ui (new-york style).

Deployed on **Vercel**. Analytics via `@vercel/analytics`.

### Routing (react-router-dom)

- `/` — Landing page (Hero, About, Menu Preview, Testimonials, WhyChooseUs, Reservation, Footer)
- `/menu` — Full menu with cart functionality
- `/order` — Checkout/order placement with live location detection
- `/admin` — Admin login
- `/admin/dashboard` — Order management with active/history tabs (protected)
- `/admin/menu-manager` — Menu CRUD with featured toggle (protected)
- `/admin/categories` — Category management (protected)
- `/admin/menu-gallery` — Gallery image management (protected)
- `/admin/settings` — Restaurant hours, delivery fee settings (protected)

Protected routes use `isAuthenticated()` from `src/lib/auth.ts` (localStorage-based session).

### Data Layer

All shared data is stored in **Supabase** (PostgreSQL). The cart is the only thing still in localStorage.

- `src/lib/supabase.ts` — Supabase client (reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`)
- `src/lib/db.ts` — All async CRUD functions for menu, categories, gallery, settings, orders
- `src/lib/menuData.ts` — Hardcoded default menu items/categories used for seeding only
- `src/lib/CartContext.tsx` — React context for cart state (localStorage key: `restaurant_cart`)
- `src/lib/auth.ts` — Admin auth with hardcoded password (localStorage key: `lamaison_admin_auth`)
- `src/lib/currency.ts` — `formatPKR()` utility for Pakistani Rupee formatting

**All `db.ts` functions are async** — always `await` them. Never call them synchronously.

### Supabase Tables

| Table | Purpose |
|---|---|
| `menu_items` | Menu dishes (snake_case columns, mapped to camelCase in `db.ts`) |
| `categories` | Category names |
| `gallery_images` | Menu gallery photos |
| `settings` | Single row (id=1) — restaurant hours, delivery fee |
| `orders` | Customer orders with status lifecycle |

RLS is enabled on all tables with permissive public policies (anon key is safe).

### Environment Variables (Vercel)

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase publishable/anon key

### UI System

- **shadcn/ui** components in `src/components/ui/` (40+ components, new-york style)
- **Custom theme colors**: `bg`, `surface`, `surface-2`, `text-primary`, `stroke`, `accent`, `accent-warm`, `cream` — defined as CSS variables in `src/index.css`, mapped in `tailwind.config.js`
- **Fonts**: `font-display` (Playfair Display) for headings, `font-body` (DM Sans) for body text
- **Custom utilities**: `.accent-gradient`, `.accent-gradient-text` in `src/index.css`
- **Animations**: `float`, `dot-pulse`, `shimmer`, `fade-up` defined in tailwind config
- **Animation libraries**: GSAP (`@gsap/react`) and Framer Motion are both used

### Component Organization

- `src/components/public/` — Public-facing sections (Navbar, Hero, AboutSection, MenuPreview, WhyChooseUs, Testimonials, ReservationSection, Footer, FloatingMenuButton)
- `src/components/admin/AdminSidebar.tsx` — Shared admin sidebar with nav links
- `src/pages/` — Route-level page components
- `src/pages/admin/` — Admin pages (Login, Dashboard, MenuManager, Categories, MenuGallery, Settings)

### Path Aliases

`@` maps to `./src` (configured in `vite.config.ts` and `tsconfig.app.json`).

### Key Patterns

- Data fetching: `useEffect(() => { (async () => { const data = await getX(); setState(data); })(); }, [])`
- Admin pages all check `isAuthenticated()` on mount and redirect to `/admin` if false
- Orders auto-archive after 12h, auto-delete after 7 days (handled in `getOrders()`)
- `DEFAULT_SETTINGS` is exported from `db.ts` for use as initial state before async load
- `vercel.json` rewrites all routes to `index.html` for SPA routing
