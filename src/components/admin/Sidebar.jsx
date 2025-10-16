// src/components/admin/Sidebar.jsx  (updated)
import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  Users,
  Box,
  Plus,
  Settings,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";
import { GlobalContext } from "../../context/GlobalContext";

const ICON_SIZE = 20;

const DEFAULT_ROUTES = {
  dashboard: { label: "Dashboard", path: "/admin/dashboard", icon: Home },
  orders: {
    label: "Orders",
    path: "/admin/orders",
    icon: Package,
    badgeKey: "ordersCount",
  },
  users: { label: "Users", path: "/admin/users", icon: Users },
  products: { label: "Products", path: "/admin/products", icon: Box },
  createProduct: {
    label: "Create Product",
    path: "/admin/products/create",
    icon: Plus,
  },
  settings: { label: "Settings", path: "/admin/settings", icon: Settings },
};

export default function Sidebar({
  collapsed: collapsedProp = false,
  onToggle,
  routes = DEFAULT_ROUTES,
  role = "admin",
  counts = {},
  onCreateClick,
  onNavigate,
}) {
  const { user } = useContext(GlobalContext);
  const [collapsed, setCollapsed] = useState(Boolean(collapsedProp));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // <-- added
  const navRef = useRef(null);

  useEffect(() => setCollapsed(collapsedProp), [collapsedProp]);

  // Redirect /admin -> /admin/dashboard so dashboard is the default view
  useEffect(() => {
    const isExactlyAdmin =
      location.pathname === "/admin" || location.pathname === "/admin/";
    if (isExactlyAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  const toggle = (val) => {
    const next = typeof val === "boolean" ? val : !collapsed;
    setCollapsed(next);
    onToggle?.(next);
  };

  const canView = (key) => {
    if (role === "admin") return true;
    if (role === "editor") return !["settings", "users"].includes(key);
    if (role === "viewer") return ["dashboard"].includes(key);
    return false;
  };

  const renderNavItem = (key, item) => {
    if (!canView(key)) return null;
    const Icon = item.icon;
    const badgeNumber = item.badgeKey ? counts[item.badgeKey] : null;
    return (
      <NavLink
        key={key}
        to={item.path}
        className={({ isActive }) =>
          clsx(
            "group flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
            isActive
              ? "bg-[var(--color-secondary-bg)]"
              : "hover:bg-[rgba(0,0,0,0.03)]"
          )
        }
        tabIndex={0}
        onClick={() => {
          setMobileOpen(false);
          onNavigate?.(item);
        }}
      >
        <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-md">
          <Icon
            size={ICON_SIZE}
            className={clsx(
              location.pathname.startsWith(item.path)
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text)]"
            )}
          />
        </span>
        <span
          className={clsx(
            "truncate",
            collapsed ? "hidden" : "flex-1 text-[var(--color-text)]"
          )}
        >
          {item.label}
        </span>
        {badgeNumber != null && (
          <span
            className={clsx(
              "ml-auto text-xs font-medium min-w-[28px] h-6 inline-flex items-center justify-center px-1 rounded-full text-white",
              badgeNumber > 0
                ? "bg-[var(--color-primary)]"
                : "bg-[var(--color-border)]"
            )}
            title={badgeNumber ? `${badgeNumber} ${item.label}` : "0"}
          >
            {badgeNumber > 99 ? "99+" : badgeNumber}
          </span>
        )}
      </NavLink>
    );
  };

  // Get first letter for avatar
  const firstLetter = user?.fullName?.[0]?.toUpperCase() || "A";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <aside
        className={clsx(
          "left-0 top-0 bottom-0 z-40 flex flex-col bg-[var(--color-background)] border-r",
          "border-[var(--color-border)] transition-all duration-300 ease-in-out",
          mobileOpen ? "w-72" : collapsed ? "w-18" : "w-72",
          "md:static md:translate-x-0"
        )}
        role="navigation"
        aria-label="Admin navigation"
      >
        {/* Header: Brand + User avatar + Collapse toggle */}
        <div className="flex flex-col px-4 py-4 border-b border-[var(--color-border)]">
          <div className="flex flex-col gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white font-bold text-lg">
              {firstLetter}
            </div>
            {!collapsed && user && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {user.fullName}
                </span>
                <span className="text-xs text-text">{user.email}</span>
                <span className="text-xs text-text capitalize">
                  {user.role}
                </span>
              </div>
            )}
          </div>
          {/* Collapse toggle */}
          <div className="flex justify-end pr-2.5">
            <button
              onClick={() => toggle()}
              className="py-2 rounded focus-visible:ring-2"
              aria-pressed={collapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-auto py-3 pl-1.5 mr-4" ref={navRef}>
          <div className="space-y-1" role="list">
            {Object.entries(routes).map(([key, item]) => {
              if (["settings", "createProduct"].includes(key)) return null;
              return renderNavItem(key, item);
            })}
          </div>

          {/* Secondary group */}
          <div className="mt-6 pt-4 border-t border-[var(--color-border)] space-y-1">
            {["createProduct", "settings"].map(
              (k) => routes[k] && renderNavItem(k, routes[k])
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
