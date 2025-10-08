import React from "react";
import { Link } from "react-router-dom";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("BDT", "")
    .trim();

const ProductCard = ({ product }) => {
  const { title, price, images, stock, averageRating, reviewCount, offer } =
    product;

  const calculateDiscount = () => {
    const offerValue = parseFloat(offer.replace("%", "")) / 100;
    const discountedPrice = price.amount - price.amount * offerValue;
    return { discountedPrice, originalPrice: price.amount };
  };

  const { discountedPrice, originalPrice } = calculateDiscount();
  const soldCount = Math.round(reviewCount * 1.5) || 500;
  const soldPercentage = Math.min(100, (soldCount / (soldCount + stock)) * 100);

  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    return (
      <div className="flex  items-center space-x-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${
              i < fullStars ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.046a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.817-2.046a1 1 0 00-1.175 0l-2.817 2.046c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.02 8.729c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <Link
      to={`/product/${product._id || product.id}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="w-full bg-white border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xs group cursor-pointer"
    >
      <div className="relative flex items-center justify-center h-48 bg-gray-50 overflow-hidden">
        <span className="absolute top-4 left-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {offer} OFF
        </span>
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 z-10 p-2 rounded-full transition-colors hover:text-red-500 text-gray-400 focus:outline-none"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        <img
          src={images[0]}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col">
        <h3
          className="text-base font-semibold text-gray-900 truncate mb-1"
          title={title}
        >
          {title}
        </h3>

        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-xl font-bold text-primary">
            ৳{formatPrice(discountedPrice)}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ৳{formatPrice(originalPrice)}
          </span>
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
            className="h-1 rounded-full bg-secondary transition-width duration-500"
            style={{ width: `${soldPercentage}%` }}
            role="progressbar"
            aria-valuenow={soldPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Adding ${title} to cart`);
          }}
          className="w-full py-2 bg-primary text-white font-bold rounded-full transition-colors hover:bg-orange-600 focus:outline-none"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
