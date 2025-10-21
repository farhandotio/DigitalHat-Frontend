import React from "react";
import { Home, ShoppingBag, Info, ShieldAlert  } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={22} /> },
    { name: "Shop", path: "/shop", icon: <ShoppingBag size={22} /> },
    { name: "About", path: "/about", icon: <Info size={22} /> },
    { name: "Privacy", path: "/privacy-policy", icon: <ShieldAlert size={22} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md flex justify-around items-center py-2 md:hidden z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center gap-1 text-xs transition-colors ${
              isActive ? "text-primary" : "text-gray-600 hover:text-primary"
            }`}
            aria-label={item.name}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
