// src/components/navother/ProfileIcon.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { User, ChevronDown } from "lucide-react";

const ProfileIcon = ({ user = null, onLogout = () => {} }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = useCallback(() => setOpen((s) => !s), []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const profileMenu = [
    { key: "orders", to: "/orders", label: "Orders" },
    { key: "wishlist", to: "/wishlist", label: "Wishlist" },
    { key: "account", to: "/account", label: "Account Settings" },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-3 px-3 py-2 rounded-md transition hover:bg-white/5"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user?.name || "Profile"}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
            <User className="w-5 h-5 text-text" />
          </div>
        )}

        <div className="hidden lg:flex flex-col text-left">
          <span className="text-sm font-medium text-white">
            {user?.name ?? "Account"}
          </span>
          <span className="text-xs text-white/90">{user?.role ?? "Guest"}</span>
        </div>

        <ChevronDown className="w-4 h-4 text-white" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 mt-2 w-40 bg-white rounded-md z-50 shadow"
        >
          <div className="py-2">
            {profileMenu.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="block px-4 py-2 text-sm text-black hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {user?.role === "seller" && (
              <Link
                to="/seller/dashboard"
                className="block px-4 py-2 text-sm text-black hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Seller Dashboard
              </Link>
            )}

            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProfileIcon);
