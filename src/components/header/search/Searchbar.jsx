import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Searchbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/shop");
    if (onSearch) onSearch(query);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <form
      ref={inputRef}
      onSubmit={handleSubmit}
      className="relative flex items-center justify-end w-full ml-auto" 
    >
      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands, or categories..."
        className={`transition-all duration-300 ease-in-out rounded-full border-2 border-border focus:outline-none focus:border-white text-sm md:text-base text-white/90 placeholder-white/90
          py-1 md:py-1.5 pr-8 md:pr-12 pl-4 bg-transparent
          ${
            isOpen
              ? "w-40 sm:w-64 md:w-100 opacity-100"
              : "w-0 opacity-0 md:w-48 md:opacity-100"
          }`}
        onFocus={() => setIsOpen(true)}
      />

      <button
        type="submit"
        onClick={() => setIsOpen(true)}
        className="absolute right-2.5 md:right-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

export default Searchbar;
