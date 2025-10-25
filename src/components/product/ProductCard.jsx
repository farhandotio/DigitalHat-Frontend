// src/components/ProductCard.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GlobalContext } from "../../context/GlobalContext"; // adjust path if needed
import { FaCartPlus } from "react-icons/fa6";
import { MdRemoveShoppingCart } from "react-icons/md";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const ProductCard = ({ product = {}, renderJsonLd = false }) => {
  const { addToCart } = useContext(GlobalContext);
  const [adding, setAdding] = useState(false);

  const {
    title = "Untitled Product",
    shortDescription = "",
    price = { amount: 0, currency: "BDT" },
    images = [],
    stock = 0,
    averageRating = 0,
    reviewCount = 0,
    sold, // real sold value from product
    _id,
    id,
    slug,
    sku,
  } = product;

  const productId = _id || id || slug;
  const productSlug = slug || productId;
  const productUrl = `https://digitalhat.vercel.app/product/${productSlug}`;

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
      <div className="flex items-center space-x-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${
              i < fullStars ? "text-yellow-400" : "text-text/20"
            }`}
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
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      console.error("Product id missing");
      return;
    }
    if (Number(stock) <= 0) {
      toast.warn("This product is out of stock.")
      return;
    }

    try {
      setAdding(true);
      await addToCart(productId, qty);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.warn(err?.message || "Failed to add to cart")
    } finally {
      setAdding(false);
    }
  };

  // Lightweight microdata attributes for each card
  const itemScope = { itemScope: true, itemType: "https://schema.org/Product" };

  return (
    <>
      <Link
        to={`/product/${productSlug}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group block bg-secondary-bg border border-border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full overflow-hidden"
        // microdata for product
        {...itemScope}
        aria-label={`View product ${title}`}
      >
        <div className="relative flex items-center justify-center bg-gray-50 overflow-hidden w-full">
          <img
            src={imgSrc}
            alt={title}
            loading="lazy"
            className="w-full group-hover:scale-[1.02] aspect-square object-cover transition-transform duration-500"
            itemProp="image"
          />
        </div>

        <div className="p-4 pb-2 flex flex-col">
          <h3
            className="text-base font-semibold text-gray-900 truncate mb-1"
            title={title}
            itemProp="name"
          >
            {title}
          </h3>

          <meta itemProp="sku" content={sku || productId} />
          <meta itemProp="url" content={productUrl} />

          <div className="flex items-center justify-between space-x-2 mb-2">
            <span
              className="text-lg md:text-xl font-bold text-primary"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              ৳<span itemProp="price">{formatPrice(originalPrice)}</span>
              <meta
                itemProp="priceCurrency"
                content={price?.currency || "BDT"}
              />
            </span>

            <button
              onClick={(e) => handleAddToCart(e, 1)}
              disabled={adding || Number(stock) <= 0}
              className={`text-primary rounded-full font-bold focus:outline-none text-xl md:text-2xl ${
                Number(stock) <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-white text-primary font-semibold cursor-pointer hover:scale-103"
              }`}
              aria-label={Number(stock) <= 0 ? "Out of stock" : "Add to cart"}
            >
              {adding ? (
                <span className="text-xs">...</span>
              ) : Number(stock) <= 0 ? (
                <MdRemoveShoppingCart />
              ) : (
                <FaCartPlus />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-1 mb-3">
            {renderStars()}
            <span className="text-xs text-text/60">
              <span
                itemProp="aggregateRating"
                itemScope
                itemType="https://schema.org/AggregateRating"
              >
                <meta
                  itemProp="ratingValue"
                  content={String(averageRating || 0)}
                />
                <meta
                  itemProp="reviewCount"
                  content={String(reviewCount || 0)}
                />
              </span>
              ({reviewCount})
            </span>
          </div>

          <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
            <span>Sold: {soldCount}</span>
            <span>Stock: {stock}</span>
          </div>

          <div className="w-full bg-gray-200 h-1 mb-2 rounded-full">
            <div
              className="h-1 bg-secondary rounded-full transition-all duration-500"
              style={{ width: `${soldPercentage}%` }}
              role="progressbar"
              aria-valuenow={soldPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          {shortDescription && (
            <p
              className="text-sm text-gray-600 mt-1 line-clamp-2"
              itemProp="description"
            >
              {shortDescription}
            </p>
          )}
        </div>
      </Link>

      {/* Optional JSON-LD: enable only when needed (e.g., on single product page or featured list) */}
      {renderJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: title,
              image: [imgSrc],
              description: shortDescription || title,
              sku: sku || productId,
              offers: {
                "@type": "Offer",
                url: productUrl,
                priceCurrency: price?.currency || "BDT",
                price: String(originalPrice),
                availability:
                  Number(stock) > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
              },
              aggregateRating: reviewCount
                ? {
                    "@type": "AggregateRating",
                    ratingValue: String(averageRating || 0),
                    reviewCount: Number(reviewCount || 0),
                  }
                : undefined,
            }),
          }}
        />
      )}
    </>
  );
};

export default ProductCard;
