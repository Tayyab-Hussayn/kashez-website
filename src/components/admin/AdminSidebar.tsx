import { Link, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Utensils, ExternalLink, Tag, Image, Settings } from "lucide-react";
import { setAuthenticated } from "@/lib/auth";

interface AdminSidebarProps {
  active: "orders" | "menu-manager" | "categories" | "menu-gallery" | "settings";
}

const navItems = [
  { key: "orders", label: "Orders", icon: LayoutDashboard, href: "/admin/dashboard", emoji: "" },
  { key: "menu-manager", label: "Menu Manager", icon: Utensils, href: "/admin/menu-manager", emoji: "" },
  { key: "categories", label: "Categories", icon: Tag, href: "/admin/categories", emoji: "" },
  { key: "menu-gallery", label: "Menu Gallery", icon: Image, href: "/admin/menu-gallery", emoji: "" },
] as const;

export default function AdminSidebar({ active }: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthenticated(false);
    navigate("/admin");
  };

  return (
    <aside className="w-60 bg-surface border-r border-stroke flex flex-col fixed h-full">
      <div className="p-6 border-b border-stroke">
        <h1 className="font-display italic text-xl text-text-primary">La Maison</h1>
        <span className="bg-accent/15 text-accent text-[10px] rounded-full px-2 py-0.5 font-body mt-2 inline-block">
          Admin
        </span>
      </div>

      <nav className="flex-1 py-6 space-y-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-colors ${
              active === item.key
                ? "bg-accent/10 text-accent"
                : "text-muted hover:bg-surface-2 hover:text-text-primary"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:bg-surface-2 hover:text-text-primary font-body text-sm transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Website
        </Link>

        {/* Divider */}
        <div className="border-t border-stroke my-3" />

        <Link
          to="/admin/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-colors ${
            active === "settings"
              ? "bg-accent/10 text-accent"
              : "text-muted hover:bg-surface-2 hover:text-text-primary"
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-stroke">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-accent font-body text-sm transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
