import React, { useState, useCallback } from "react";
import { assets } from "../../../public/assets/assets";
import Navbar from "./navbar/Navbar";
import Searchbar from "./search/Searchbar";
import NavOther from "./navother/NavOther";
import MobileNav from "./navbar/MobileNav";
import { Link } from "react-router-dom";

const Header = ({ initialCartCount }) => {
  const [cartCount, setCartCount] = useState(initialCartCount || 0);

  const handleSearch = useCallback((query) => {
    console.log("Searching for:", query);
  }, []);

  return (
    <header>
      <div className="bg-primary pl-2 pr-4 md:px-10 lg:px-17 text-text flex flex-row items-center gap-1 md:gap-3 justify-between w-full">
        <div className="md:flex items-center max-md:w-full">
          <Link to={"/"}>
            <img
              src={assets.logo}
              alt="DigitalHat Logo"
              className="w-20 h-20 aspect-square"
            />
          </Link>

          {/* Nav */}
          <div className="hidden md:block">
            <Navbar />
          </div>
        </div>

        {/* Searchbar (Center) */}
        <div className="flex mx-0 md:mx-0 w-full md:w-auto">
          <Searchbar onSearch={handleSearch} />
        </div>

        {/* Favorites / Cart / (no Profile) (Right) */}
        <div className="block">
          <NavOther cartCount={cartCount} />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </header>
  );
};

export default Header;
