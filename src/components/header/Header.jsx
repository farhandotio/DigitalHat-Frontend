import React from "react";
import { assets } from "../../../public/assets/assets";
import Navbar from "./navbar/Navbar";
import Searchbar from "./search/Searchbar";
import NavOther from "./navother/NavOther";
import { Link, useLocation } from "react-router-dom";
import MobileNav from "./navbar/MobileNav";

const Header = () => {
  const location = useLocation();

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  // Generate breadcrumb items
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    ...pathSegments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: "/" + pathSegments.slice(0, index + 1).join("/"),
    })),
  ];

  return (
    <header>
      <div className="bg-primary px-2 md:px-10 lg:px-17 text-white/90 flex flex-row items-center gap-3 justify-between w-full">
        {/* Logo */}
        <img
          src={assets.logo}
          alt="DigitalHat Logo"
          className="w-20 h-20 aspect-square"
        />

        {/* Nav */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Searchbar */}
        <div className="flex mx-0 md:mx-8 w-full md:w-auto">
          <Searchbar onSearch={handleSearch} />
        </div>

        {/* Large screen Favorites / Cart / Profile */}
        <div className="block">
          <NavOther />
        </div>
      </div>

      {/* Breadcrumb / Page Tracker (hidden on Home) */}
      {location.pathname !== "/" && (
        <div className="flex items-center gap-2 text-sm md:text-base px-6 md:px-10 lg:px-20 py-1 bg-white">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.path}>
                {!isLast ? (
                  <Link
                    to={crumb.path}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-primary font-medium">{crumb.name}</span>
                )}
                {!isLast && <span className="text-gray-400">{">"}</span>}
              </React.Fragment>
            );
          })}
        </div>
      )}

      <MobileNav />
    </header>
  );
};

export default Header;
