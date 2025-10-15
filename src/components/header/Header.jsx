import React, { useContext, useMemo, useCallback } from "react";
import { assets } from "../../../public/assets/assets";
import { Link } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Searchbar from "./search/Searchbar";
import NavOther from "./navother/NavOther";
import MobileNav from "./navbar/MobileNav";
import { GlobalContext } from "../../context/GlobalContext";

const Header = () => {
  const { cart } = useContext(GlobalContext);

  // Compute cart count
  const cartCount = useMemo(() => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }, [cart]);

  const handleSearch = useCallback((query) => {
    console.log("Searching for:", query);
  }, []);

  return (
    <header className="bg-secondary">
      <div className="pl-3 pr-4 md:px-10 lg:px-17 text-text flex flex-row items-center gap-1 md:gap-3 justify-between w-full">
        <Link
          to={"/"}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-20 h-20 aspect-square"
        >
          <img
            src={assets.logo}
            alt="DigitalHat Logo"
            className="w-full h-hull"
          />
        </Link>

        {/* Nav */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Searchbar (Center) */}
        <div className="flex mx-0 md:mx-10 w-full md:w-full">
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
