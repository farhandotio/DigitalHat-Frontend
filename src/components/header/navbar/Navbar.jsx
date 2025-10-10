import React from "react";
import { Link } from "react-router-dom";

export const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "Support", path: "/support" },
];

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between">
      <ul className="flex items-center gap-8 ml-10">
        {navLinks.map(({ name, path }) => (
          <li key={name}>
            <Link
              to={path}
              className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
