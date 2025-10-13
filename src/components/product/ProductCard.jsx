import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext"; // adjust path if needed

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const ProductCard = ({ product = {} }) => {
  const { addToCart } = useContext(GlobalContext);
  const [adding, setAdding] = useState(false);

  const {
    title = "Untitled Product",
    price = { amount: 0, currency: "BDT" },
    images = [],
    stock = 0,
    averageRating = 0,
    reviewCount = 0,
    sold, // real sold value from product
    _id,
    id,
  } = product;

  const productId = _id || id;

  const imgSrc =
    (images &&
      images.length > 0 &&
      (typeof images[0] === "string" ? images[0] : images[0]?.url)) ||
    "/placeholder.png";

  const originalPrice = Number(price?.amount ?? 0);
  const soldCount = Math.max(Number(sold) || 0, 0);

  const soldPercentage = (() => {
    const availableStock = Math.max(Number(stock) || 0, 0);
    const denom = soldCount + availableStock;
    if (denom === 0) return 0;
    return Math.min(100, Math.round((soldCount / denom) * 100));
  })();

  const renderStars = () => {
    const fullStars = Math.max(Math.floor(Number(averageRating) || 0), 0);
    return (
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${i < fullStars ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.046a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.817-2.046a1 1 0 00-1.175 0l-2.817 2.046c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.02 8.729c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleAddToCart = async (e, qty = 1) => {
    // prevent Link nav
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      console.error("Product id missing");
      return;
    }
    if (Number(stock) <= 0) {
      // optional: show toast instead
      alert("This product is out of stock.");
      return;
    }

    try {
      setAdding(true);
      await addToCart(productId, qty);
      // optional success UI: toast, small animation, etc.
      // example quick feedback:
      // alert(`${title} added to cart`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert(err?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      to={`/product/${productId}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="w-full bg-secondary-bg border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xs group cursor-pointer"
    >
      <div className="relative flex items-center justify-center h-48 bg-gray-50 overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col">
        <h3 className="text-base font-semibold text-gray-900 truncate mb-1" title={title}>
          {title}
        </h3>

        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-xl font-bold text-primary">৳{formatPrice(originalPrice)}</span>
        </div>

        <div className="flex items-center space-x-1 mb-3">
          {renderStars()}
          <span className="text-xs text-text/60">({reviewCount})</span>
        </div>

        <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
          <span>Sold: {soldCount}</span>
          <span>Stock: {stock}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
          <div
            className="h-1 rounded-full bg-secondary transition-all duration-500"
            style={{ width: `${soldPercentage}%` }}
            role="progressbar"
            aria-valuenow={soldPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        <button
          onClick={(e) => handleAddToCart(e, 1)}
          disabled={adding || Number(stock) <= 0}
          className={`w-full py-2 text-white font-bold rounded-full transition-colors focus:outline-none ${
            Number(stock) <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-orange-600"
          }`}
        >
          {adding ? "Adding..." : Number(stock) <= 0 ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
