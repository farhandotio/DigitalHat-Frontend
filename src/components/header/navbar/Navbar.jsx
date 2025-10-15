import React from "react";
import { Link, useLocation } from "react-router-dom";

export const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "Support", path: "/support" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between">
      <ul className="flex items-center gap-8 ml-10">
        {navLinks.map(({ name, path }) => {
          const isActive = location.pathname === path;
          return (
            <li key={name}>
              <Link
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                to={path}
                className={`font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-white border-b-2 border-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
