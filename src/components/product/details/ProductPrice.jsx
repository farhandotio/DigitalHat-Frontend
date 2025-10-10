import React from "react";

const ProductPrice = ({ price, originalPrice }) => {
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice.amount - price.amount) / originalPrice.amount) * 100)
    : 0;

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-bold text-gray-900">
        ৳{price.amount?.toLocaleString()}
      </span>
      {originalPrice && (
        <>
          <span className="text-lg text-gray-500 line-through">
            ৳{originalPrice.amount?.toLocaleString()}
          </span>
          <span className="text-xl font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
            {discountPercentage}% Off
          </span>
        </>
      )}
    </div>
  );
};

export default ProductPrice;
