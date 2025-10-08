import React from "react";
import { Link } from "react-router-dom";
import { FaLaptop, FaTshirt, FaBook, FaPuzzlePiece, FaShoePrints, FaMobileAlt, FaCouch, FaPaintBrush, FaFootballBall, FaShoppingBasket, FaGem, FaWallet } from "react-icons/fa";

const iconMap = {
  Electronics: FaLaptop,
  Fashion: FaTshirt,
  Books: FaBook,
  Toys: FaPuzzlePiece,
  Shoes: FaShoePrints,
  Gadgets: FaMobileAlt,
  Furniture: FaCouch,
  Beauty: FaPaintBrush,
  Sports: FaFootballBall,
  Groceries: FaShoppingBasket,
  Jewelry: FaGem,
  Accessories: FaWallet,
};

const iconColorMap = {
  Electronics: "#f97316", // orange
  Fashion: "#ec4899",     // pink
  Books: "#10b981",       // green
  Toys: "#facc15",        // yellow
  Shoes: "#8b5cf6",       // purple
  Gadgets: "#3b82f6",     // blue
  Furniture: "#14b8a6",   // teal
  Beauty: "#f43f5e",      // red
  Sports: "#22c55e",      // lime
  Groceries: "#f59e0b",   // amber
  Jewelry: "#eab308",     // gold
  Accessories: "#6366f1", // indigo
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.name] || FaShoppingBasket;
  const defaultColor = iconColorMap[category.name] || "#000";

  return (
    <Link
      to={`/category/${category.name.toLowerCase()}`}
      className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow hover:scale-105 transition-transform text-center group"
    >
      <div
        className="mb-2 transition-colors duration-300"
        style={{ color: defaultColor }}
      >
        <IconComponent className="group-hover:text-primary" size={30} />
      </div>
      <span className="font-medium text-text group-hover:text-primary">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryCard;
