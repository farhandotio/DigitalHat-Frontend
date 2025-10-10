import React from "react";

const ProductSpecifications = ({ specification }) => {
  if (!specification || Object.keys(specification).length === 0) return null;

  return (
    <div className="mt-4 border-t pt-4 border-border">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Specifications</h3>
      <ul className="list-disc list-inside text-gray-700">
        {Object.entries(specification).map(([key, value]) => (
          <li key={key}>
            <span className="font-medium">{key}:</span> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSpecifications;
