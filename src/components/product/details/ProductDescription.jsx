import React from "react";

const ProductDescription = ({ description }) => {
  if (!description) return null;

  return (
    <div className="mt-4 border-t pt-4 border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Details</h3>
      <p className="text-base text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
};

export default ProductDescription;
