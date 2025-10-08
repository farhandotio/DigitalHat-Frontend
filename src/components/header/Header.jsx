import React from "react";
import { assets } from "../../../public/assets/assets";
import Navbar from "./navbar/Navbar";
import Searchbar from "./search/Searchbar";
import NavOther from "./navother/NavOther";

const Header = () => {
  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // TODO: Implement actual filter or navigation logic
  };

  return (
    <header className="bg-primary text-white/90 px-2 md:px-10 lg:px-17 shadow-md flex flex-row items-center gap-3 justify-between w-full">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="DigitalHat Logo"
        className="w-20 aspect-square"
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
    </header>
  );
};

export default Header;
