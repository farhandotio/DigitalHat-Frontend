import React from "react";

const ProductSkeleton = () => (
  <div className="w-full bg-white border border-gray-200  rounded-2xl  shadow-lg overflow-hidden animate-pulse">
    <div className="p-4 flex items-center justify-center h-48 bg-gray-200 relative">
      <div className="absolute top-4 left-4 w-12 h-5 bg-gray-300  rounded-2xl "></div>
      <div className="absolute top-4 right-4 w-8 h-8 bg-gray-300  rounded-2xl "></div>
    </div>
    <div className="p-4 flex flex-col">
      <div className="h-4 bg-gray-300  rounded-2xl  w-3/4 mb-3"></div>
      <div className="flex items-baseline space-x-2 mb-3">
        <div className="h-6 bg-gray-300  rounded-2xl  w-1/3"></div>
        <div className="h-3 bg-gray-300  rounded-2xl  w-1/6"></div>
      </div>
      <div className="flex items-center space-x-1 mb-4">
        <div className="h-4 bg-gray-300  rounded-2xl  w-2/5"></div>
      </div>
      <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
        <div className="h-2 bg-gray-300  rounded-2xl  w-1/4"></div>
        <div className="h-2 bg-gray-300  rounded-2xl  w-1/4"></div>
      </div>
      <div className="w-full bg-gray-200  rounded-2xl  h-2 mb-4"></div>
      <div className="w-full py-4 bg-gray-300 rounded-2xl "></div>
    </div>
  </div>
);

export default ProductSkeleton;
