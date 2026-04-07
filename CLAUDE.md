# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run lint` — ESLint across the project
- `npm run preview` — Preview the production build locally

## Architecture

This is **La Maison** — a restaurant website with online ordering and an admin panel. Built with React 19, TypeScript, Vite 7, Tailwind CSS 3, and shadcn/ui (new-york style).

### Routing (react-router-dom)

- `/` — Landing page (Hero, About, Menu Preview, Testimonials, Reservation, Footer)
- `/menu` — Full menu with cart functionality
- `/order` — Checkout/order placement
- `/admin` — Admin login
- `/admin/dashboard` — Order management (protected)
- `/admin/menu-manager` — Menu CRUD (protected)

Protected routes use `isAuthenticated()` from `src/lib/auth.ts` (localStorage-based session).

### Data Layer

All data is **localStorage-based** — no backend/API:
- `src/lib/db.ts` — CRUD for orders and menu items (keys: `lamaison_orders`, `lamaison_menu`)
- `src/lib/menuData.ts` — Hardcoded default menu items and categories
- `src/lib/CartContext.tsx` — React context for cart state (key: `restaurant_cart`)
- `src/lib/auth.ts` — Admin auth with hardcoded password (key: `lamaison_admin_auth`)

### UI System

- **shadcn/ui** components in `src/components/ui/` (40+ components, new-york style)
- **Custom theme colors**: `bg`, `surface`, `surface-2`, `text-primary`, `stroke`, `accent`, `accent-warm`, `cream` — defined as CSS variables in `src/index.css`, mapped in `tailwind.config.js`
- **Fonts**: `font-display` (Playfair) for headings, `font-body` (DM Sans) for body text
- **Custom utilities**: `.accent-gradient`, `.accent-gradient-text` in `src/index.css`
- **Animations**: `float`, `dot-pulse`, `shimmer`, `fade-up` defined in tailwind config
- **Animation libraries**: GSAP (`@gsap/react`) and Framer Motion are both used

### Component Organization

- `src/components/public/` — Public-facing sections (Navbar, Hero, AboutSection, MenuPreview, Testimonials, ReservationSection, Footer, FloatingMenuButton)
- `src/pages/` — Route-level page components
- `src/pages/admin/` — Admin pages (Login, Dashboard, MenuManager)

### Path Aliases

`@` maps to `./src` (configured in `vite.config.ts` and `tsconfig.app.json`).
