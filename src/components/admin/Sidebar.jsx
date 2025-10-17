// src/components/admin/Sidebar.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  Users,
  Box,
  Plus,
  Settings,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { GlobalContext } from "../../context/GlobalContext";

const ICON_SIZE = 20;

const DEFAULT_ROUTES = {
  dashboard: { label: "Dashboard", path: "/admin/dashboard", icon: Home },
  orders: { label: "Orders", path: "/admin/orders", icon: Package, badgeKey: "ordersCount" },
  users: { label: "Users", path: "/admin/users", icon: Users },
  products: { label: "Products", path: "/admin/products", icon: Box },
  createProduct: { label: "Create Product", path: "/admin/products/create", icon: Plus },
  settings: { label: "Settings", path: "/admin/settings", icon: Settings },
};

export default function Sidebar({
  collapsed: collapsedProp = false,
  onToggle,
  routes = DEFAULT_ROUTES,
  role = "admin",
  counts = {},
  onNavigate,
}) {
  const { user, setUser } = useContext(GlobalContext);
  const [collapsed, setCollapsed] = useState(Boolean(collapsedProp));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => setCollapsed(collapsedProp), [collapsedProp]);

  // Redirect /admin -> /admin/dashboard
  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
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
        {/* {badgeNumber != null && !collapsed && (
          <span className="ml-auto text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
            {badgeNumber}
          </span>
        )} */}
      </NavLink>
    );
  };

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
        {/* Header */}
        <div className="flex flex-col px-4 py-4 border-b border-[var(--color-border)] cursor-pointer" onClick={toggle}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white font-bold text-lg">
            {firstLetter}
          </div>
          {!collapsed && user && (
            <div className="flex flex-col mt-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">{user.fullName}</span>
              <span className="text-xs text-text">{user.email}</span>
              <span className="text-xs text-text capitalize">{user.role}</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-auto py-3 pl-1.5 mr-4" ref={navRef}>
          <div className="space-y-1">
            {Object.entries(routes).map(([key, item]) => {
              if (["settings", "createProduct"].includes(key)) return null;
              return renderNavItem(key, item);
            })}
          </div>

          {/* Secondary */}
          <div className="mt-6 pt-4 border-t border-[var(--color-border)] space-y-1">
            {["createProduct", "settings"].map(k => routes[k] && renderNavItem(k, routes[k]))}
          </div>
        </nav>

        {/* Sign Out */}
        <div className="mt-auto px-4 py-4 border-t border-[var(--color-border)]">
          <button
            onClick={() => {
              localStorage.removeItem("userToken");
              localStorage.removeItem("userData");
              setUser(null);
              window.dispatchEvent(new CustomEvent("auth-state-change", { detail: { user: null } }));
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[rgba(0,0,0,0.03)] transition-colors text-red-500"
          >
            <LogOut size={20} />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
