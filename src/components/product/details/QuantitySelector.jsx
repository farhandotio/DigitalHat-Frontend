import React from "react";

const QuantitySelector = ({ quantity = 1, setQuantity, stock = 0 }) => {
  const decrease = () => setQuantity(Math.max(1, quantity - 1));
  const increase = () => setQuantity(Math.min(stock, quantity + 1));

  return (
    <div className="mt-6 flex items-center gap-4 flex-wrap">
      <h3 className="text-base font-semibold text-gray-800">Quantity</h3>

      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={decrease}
          className="p-2 w-10 text-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          disabled={quantity <= 1}
        >
          -
        </button>

        <span className="p-2 w-12 text-center font-bold text-gray-800 bg-white">
          {quantity}
        </span>

        <button
          onClick={increase}
          className="p-2 w-10 text-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          disabled={quantity >= stock}
        >
          +
        </button>
      </div>

      <span className="text-sm text-red-500 whitespace-nowrap font-medium">
        Only {stock} left in stock
      </span>
    </div>
  );
};

export default QuantitySelector;
