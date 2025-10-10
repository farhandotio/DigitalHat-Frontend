import React from "react";
import { assets } from "../../../public/assets/assets";
import Navbar from "./navbar/Navbar";
import Searchbar from "./search/Searchbar";
import NavOther from "./navother/NavOther";
import MobileNav from "./navbar/MobileNav";

const Header = () => {
  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <header>
      <div className="bg-primary px-2 md:px-10 lg:px-17 text-white/90 flex flex-row items-center gap-1 md:gap-3 justify-between w-full">
        {/* Logo */}
        <div className="md:flex items-center max-md:w-full">
          <img
            src={assets.logo}
            alt="DigitalHat Logo"
            className="w-20 h-20 aspect-square"
          />

          {/* Nav */}
          <div className="hidden md:block">
            <Navbar />
          </div>
        </div>

        {/* Searchbar */}
        <div className="flex mx-0 md:mx-0 w-full md:w-auto">
          <Searchbar onSearch={handleSearch} />
        </div>

        {/* Favorites / Cart / Profile */}
        <div className="block">
          <NavOther />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </header>
  );
};

export default Header;
