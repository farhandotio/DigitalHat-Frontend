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

  // Close search input on outside click (mobile)
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
      className="relative w-full md:w-auto mx-auto flex items-center"
    >
      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands, or categories..."
        className={`transition-all duration-300 ease-in-out rounded-full border-2 border-border focus:outline-none focus:border-white text-sm md:text-base text-white/90 placeholder-white/90
          py-1 md:py-1.5 pl-8 md:pl-12 pr-4
          ${
            isOpen
              ? "w-full md:w-auto opacity-100"
              : "w-0 md:w-auto opacity-0 md:opacity-100"
          }`}
        onFocus={() => setIsOpen(true)}
      />

      {/* Search icon button */}
      <button
        type="submit"
        onClick={() => setIsOpen(true)}
        className="absolute left-2.5 md:left-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

export default Searchbar;
