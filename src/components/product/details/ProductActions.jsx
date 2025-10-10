import React from "react";

const ProductActions = ({ stock, title, quantity }) => {
  return (
    <div className="flex gap-4 mt-8 whitespace-nowrap pr-5">
      <button
        className="flex-1 py-3 px-6 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors duration-200 text-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={stock <= 0}
        onClick={() => console.log(`Adding ${quantity} x ${title} to cart`)}
      >
        {stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
      <button
        className="flex-1 py-3 px-6 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-colors duration-200 text-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={stock <= 0}
        onClick={() => console.log(`Buying ${quantity} x ${title} now`)}
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductActions;
