import React from "react";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";

/* ---------- items (image + name) ---------- */
export const categoryItems = [
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/headphone.jpg?updatedAt=1760674050772",
    name: "Headphone",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/watch.jpg?updatedAt=1760674050833",
    name: "Watch",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/tws.jpg?updatedAt=1760674050675",
    name: "TWS",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/router.jpg?updatedAt=1760674050767",
    name: "Router",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/tripod.jpg?updatedAt=1760674050758",
    name: "Tripod",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/neckband.jpg?updatedAt=1760674050722",
    name: "Neckband",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/power%20bank.jpg?updatedAt=1760674496032",
    name: "Power Bank",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/microphone.jpg?updatedAt=1760674050742",
    name: "Microphone",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/cable.jpg?updatedAt=1760674495958",
    name: "Cable",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/fan.jpg?updatedAt=1760674050713",
    name: "Fan",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/keyboard.jpg?updatedAt=1760674050992",
    name: "Keyboard",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/gaming.jpg?updatedAt=1760674050681",
    name: "Gaming",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/speaker.jpg?updatedAt=1760674050762",
    name: "Speaker",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/drone.jpg?updatedAt=1760674050743",
    name: "Drone",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/headphone.jpg?updatedAt=1760674050772",
    name: "Headphone",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/watch.jpg?updatedAt=1760674050833",
    name: "Watch",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/tws.jpg?updatedAt=1760674050675",
    name: "TWS",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/router.jpg?updatedAt=1760674050767",
    name: "Router",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/tripod.jpg?updatedAt=1760674050758",
    name: "Tripod",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/neckband.jpg?updatedAt=1760674050722",
    name: "Neckband",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/power%20bank.jpg?updatedAt=1760674496032",
    name: "Power Bank",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/microphone.jpg?updatedAt=1760674050742",
    name: "Microphone",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/cable.jpg?updatedAt=1760674495958",
    name: "Cable",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/fan.jpg?updatedAt=1760674050713",
    name: "Fan",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/keyboard.jpg?updatedAt=1760674050992",
    name: "Keyboard",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/gaming.jpg?updatedAt=1760674050681",
    name: "Gaming",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/speaker.jpg?updatedAt=1760674050762",
    name: "Speaker",
  },
  {
    url: "https://ik.imagekit.io/iura/Digitalhat/category/drone.jpg?updatedAt=1760674050743",
    name: "Drone",
  },
];

/* ---------- Helper: find image by category name ---------- */
const findImageForCategory = (categoryName) => {
  if (!categoryName) return null;
  const normalized = categoryName.trim().toLowerCase();

  // Exact match
  let found = categoryItems.find(
    (it) => it.name.trim().toLowerCase() === normalized
  );
  if (found) return found.url;

  // Partial match
  found = categoryItems.find(
    (it) =>
      it.name.trim().toLowerCase().startsWith(normalized) ||
      normalized.startsWith(it.name.trim().toLowerCase()) ||
      it.name.trim().toLowerCase().includes(normalized) ||
      normalized.includes(it.name.trim().toLowerCase())
  );
  if (found) return found.url;

  // Token match
  const tokens = normalized.split(/\s+/);
  found = categoryItems.find((it) =>
    tokens.every((t) => it.name.toLowerCase().includes(t))
  );
  return found ? found.url : null;
};

/* ---------- Utility: safe slug generator ---------- */
const makeSlug = (str = "") =>
  encodeURIComponent(
    str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  );

/* ---------- CategoryCard component ---------- */
const CategoryCard = ({ category }) => {
  const name = category?.name || "Unknown";
  const imageUrl = findImageForCategory(name);
  const slug = makeSlug(name);

  return (
    <Link
      to={`/category/${slug}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={`Open ${name} category`}
      className="group flex flex-col items-center hover:ring-2 ring-primary  bg-secondary-bg md:scale-90 scale-99 border border-border py-3 px-10 justify-center rounded-xl md:transition-all duration-300 transform max-md:text-sm whitespace-nowrap text-center"
    >
      {/* Image wrapper */}
      <div className="relative flex items-center justify-center w-10 h-10 md:w-20 md:h-20 rounded-full bg-blue-50/70 mb-3 shadow-inner shadow-blue-100 group-hover:bg-gray-200 transition-all duration-300 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name} image`}
            className="h-full w-full object-cover transition-all duration-300 transform group-hover:scale-105"
            loading="lazy"
            draggable={false}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="flex items-center justify-center p-2">
            <FaFileAlt size={28} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Category Name */}
      <span className="font-semibold text-gray-700 group-hover:text-primary transition-all duration-200 text-sm md:text-base">
        {name}
      </span>
    </Link>
  );
};

export default CategoryCard;
