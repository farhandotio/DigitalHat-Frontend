import React from "react";
import { Link } from "react-router-dom";
import {
  FaWifi,
  FaHeadphones,
  FaBluetooth,
  FaSpeakerDeck,
  FaAppleAlt,
  FaHeadphonesAlt,
  FaGamepad,
  FaCamera,
  FaVideo,
  FaBatteryFull,
  FaPlug,
  FaHome,
  FaFileAlt,
} from "react-icons/fa";

const iconMap = {
  Router: FaWifi,
  "TWS Earbuds": FaHeadphones,
  "Bluetooth Devices": FaBluetooth,
  Speakers: FaSpeakerDeck,
  Wearables: FaAppleAlt,
  Headphones: FaHeadphonesAlt,
  "Gaming Consoles": FaGamepad,
  Tripods: FaCamera,
  Webcams: FaVideo,
  "Power Banks": FaBatteryFull,
  "Chargers & Cables": FaPlug,
  "Smart Home Devices": FaHome,
};

const iconColorMap = {
  Router: "#f97316",
  TWS: "#3b82f6",
  Bluetooth: "#10b981",
  Speakers: "#facc15",
  Wearables: "#ec4899",
  Headphones: "#8b5cf6",
  Gaming: "#14b8a6",
  Tripods: "#f361f1",
  Webcams: "#f59e0b",
  "Power Banks": "#22c55e",
  Chargers: "#f43f5e",
  "Home Devices": "#eab308",
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.name] || FaFileAlt;
  const color = iconColorMap[category.name] || "#000";

  return (
    <Link
      to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group flex flex-col items-center justify-center bg-white px-4 sm:py-7 py-2 max-md:text-sm whitespace-nowrap shadow  text-center scale-95"
    >
      <div className="mb-2" style={{ color }}>
        <IconComponent className="group-hover:text-secondary transition-all duration-200" size={30} />
      </div>
      <span className="font-medium text-text group-hover:text-secondary transition-all duration-200">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryCard;
