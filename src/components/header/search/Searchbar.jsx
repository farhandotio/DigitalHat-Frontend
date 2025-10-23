// src/components/Searchbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../context/GlobalContext";

const Searchbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { setSearchQuery, products } = useGlobalContext(); // products optional

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // helper: perform client-side search (title, description, category)
  const performClientSearch = (q) => {
    if (!products || !Array.isArray(products)) return null;

    const qLower = q.toLowerCase();
    const filtered = products.filter((p) => {
      // safe-access fields
      const title = (p.title || "").toString().toLowerCase();
      const desc = (p.description || p.desc || "").toString().toLowerCase();
      const categoryField = p.category ?? p.categories ?? "";

      // category may be string or array
      let categoryStr = "";
      if (Array.isArray(categoryField)) {
        categoryStr = categoryField.join(" ").toLowerCase();
      } else {
        categoryStr = (categoryField || "").toString().toLowerCase();
      }

      return (
        (title && title.includes(qLower)) ||
        (desc && desc.includes(qLower)) ||
        (categoryStr && categoryStr.includes(qLower))
      );
    });

    return filtered;
  };

  const scheduleUpdate = (q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = q.trim();
      setSearchQuery(trimmed);

      const clientResult = performClientSearch(trimmed);
      if (typeof onSearch === "function") onSearch(clientResult ?? trimmed);
    }, 350);
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const trimmed = query.trim();
    setSearchQuery(trimmed);

    if (typeof onSearch === "function") {
      const clientResult = performClientSearch(trimmed);
      onSearch(clientResult ?? trimmed);
    }

    if (trimmed) navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    else navigate("/shop");

    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const buttonClick = () => {
    setIsOpen(true);
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form
      ref={inputRef}
      onSubmit={handleSubmit}
      className="relative flex items-center justify-end w-full ml-auto"
    >
      {/* Search input */}
      <input
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        type="text"
        value={query}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          scheduleUpdate(v);
        }}
        placeholder="Search products, brands, or categories..."
        className={`transition-all duration-300 ease-in-out rounded-full border-2 border-border/20 focus:outline-none focus:border-white text-sm md:text-base text-white/90 placeholder-white/90
          py-1 md:py-1.5 pr-8 md:pr-12 pl-4 bg-transparent
          ${
            isOpen
              ? "w-37 sm:w-64 md:w-full opacity-100"
              : "w-0 opacity-0 md:w-full md:opacity-100"
          }`}
        onFocus={() => setIsOpen(true)}
        aria-label="Search products, brands, or categories"
      />

      <button
        type="button"
        aria-label="submit search"
        onClick={buttonClick}
        className="absolute right-2.5 md:right-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

export default Searchbar;
