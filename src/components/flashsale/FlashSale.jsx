import React, { useState, useEffect } from "react";
import { Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";

const INITIAL_TIME_SECONDS = 8 * 3600 + 32 * 60 + 34;

const DUMMY_PRODUCTS = [
  {
    _id: "Watch",
    title: "Smart Watch Pro",
    price: { original: 5500, sale: 4500, currency: "৳" },
    imageName:
      "https://www.pchouse.com.bd/image/cache/catalog/Haylou/Haylou-Watch-2-Pro-Bluetooth-Calling-Smart-Watch-500x500.jpg",
    averageRating: 4.5,
    reviewCount: 12,
    discountPercent: 18,
  },
  {
    _id: "Router",
    title: "Dual-Band Router",
    price: { original: 3000, sale: 2500, currency: "৳" },
    imageName:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVKoOo4n3AzGTQvJtKPRqLk3rPFucNWDbBSg_tpE1kGS6PJMukOrwD7WaQTgvl7FMgE0I&usqp=CAU",
    averageRating: 4.2,
    reviewCount: 8,
    discountPercent: 16,
  },
  {
    _id: "TWS",
    title: "Noise-Cancelling TWS",
    price: { original: 4000, sale: 3200, currency: "৳" },
    imageName:
      "https://www.default.com.bd/image/cache/catalog/demo/product/edifier-neobuds-pro-hi-res-bluetooth-earbuds-with-anc-143-500x500.jpg",
    averageRating: 4.8,
    reviewCount: 25,
    discountPercent: 20,
  },
  {
    _id: "Speaker",
    title: "Bluetooth Speaker",
    price: { original: 4500, sale: 3800, currency: "৳" },
    imageName:
      "https://www.applegadgetsbd.com/_next/image?url=https%3A%2F%2Fadminapi.applegadgetsbd.com%2Fstorage%2Fmedia%2Flarge%2FJBL-GO-4-Portable-Waterproof-Speaker-White-6424.jpg&w=3840&q=100",
    averageRating: 4.6,
    reviewCount: 18,
    discountPercent: 15,
  },
  {
    _id: "Mouse",
    title: "Ergonomic Mouse",
    price: { original: 1500, sale: 1200, currency: "৳" },
    imageName:
      "https://www.micropackhk.com/cdn/shop/products/c5abcd86dcb85cfb60b9f5761e33f9c9.jpg?v=1737594734",
    averageRating: 4.3,
    reviewCount: 30,
    discountPercent: 20,
  },
];

const FlashSaleProductCard = ({ product }) => {
  const {
    title,
    price,
    averageRating,
    reviewCount,
    discountPercent,
    imageName,
  } = product;

  return (
    <Link
      to={`/category/${product._id}`}
      className="block rounded-xl shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden relative cursor-pointer group border border-border bg-white"
    >
      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-br-lg rounded-tl-lg z-10 shadow-md">
        -{discountPercent}% OFF
      </div>

      {/* Product Image */}
      <div className="overflow-hidden">
        <img
          src={imageName}
          alt={title}
          className="w-full aspect-square object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x300/FEE2E2/DC2626?text=Product";
          }}
        />
      </div>

      <div className="p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-gray-900 font-semibold text-lg line-clamp-2 mb-2">
            {title}
          </h3>
          <div className="flex items-center text-sm text-yellow-400">
            <Star className="w-3 h-3 fill-yellow-400 mr-1" />
            <Star className="w-3 h-3 fill-yellow-400 mr-1" />
            <Star className="w-3 h-3 fill-yellow-400 mr-1" />
            <Star className="w-3 h-3 fill-yellow-400 mr-1" />
            <Star className="w-3 h-3 fill-yellow-400 mr-2" />
            <span className="font-bold text-gray-700 mr-1">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500 -mt-2">({reviewCount})</span>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <p className="text-xl font-extrabold text-primary">
            {price.currency} {price.sale.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400 line-through mt-2">
            {price.currency} {price.original.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

const FlashSale = () => {
  const [products] = useState(DUMMY_PRODUCTS);
  const [remainingTime, setRemainingTime] = useState(INITIAL_TIME_SECONDS);

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const timerId = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const displayedProducts = isLargeScreen ? products : products.slice(0, 4);

  const formatTime = (totalSeconds) => {
    const time = Math.max(0, totalSeconds);
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(remainingTime);

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center bg-red-500 text-white p-2 rounded-lg w-14 sm:w-16 shadow-lg transition-transform duration-200">
      <span className="text-lg font-extrabold leading-none">{value}</span>
      <span className="text-xs font-semibold mt-1 opacity-80">{label}</span>
    </div>
  );

  return (
    <section className="w-full py-10 font-['Inter']">
      <div className="mx-auto px-5 md:px-10 lg:px-20">
        <div className="bg-white p-4 sm:p-6 border-b border-border shadow-md rounded-xl mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2 text-2xl sm:text-3xl font-bold text-text">
                <Zap
                  className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500"
                  fill="currentColor"
                />
                <span>Flash Sale</span>
              </div>

              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-inner transform -skew-x-12 hidden sm:block">
                Limited Time
              </div>
            </div>

            <div className="flex items-center space-x-2 justify-between max-sm:w-full">
              <span className="text-gray-600 text-base font-semibold mr-2">
                {remainingTime > 0 ? "Ends in:" : "Sale Ended"}
              </span>

              {remainingTime > 0 ? (
                <div className="flex space-x-1">
                  <TimeBox value={hours} label="Hours" />
                  <TimeBox value={minutes} label="Min" />
                  <TimeBox value={seconds} label="Sec" />
                </div>
              ) : (
                <div className="text-lg font-bold text-red-600 bg-red-100 p-2 rounded-lg">
                  00:00:00
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <FlashSaleProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to={"/shop"}
            className="bg-white text-red-600 border border-red-600 font-semibold cursor-pointer py-3 px-8 rounded-full shadow-md hover:bg-red-100  transition duration-300"
          >
            View More Flash Deals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
