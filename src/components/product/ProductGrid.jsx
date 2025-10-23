// src/components/product/ProductGrid.jsx
import React from "react";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

const SKELETON_COUNT = 5;

const ProductGrid = ({ products = [], isLoading = false }) => {
  // ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];
  const showSkeletons = Boolean(isLoading);
  const showNoProducts = !isLoading && safeProducts.length === 0;

  return (
    <section className="mx-auto" aria-live="polite">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-items-center">
        {showSkeletons &&
          Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            // role=status helps screen readers know something is loading
            <div
              key={`skeleton-${idx}`}
              role="status"
              aria-busy="true"
              className="w-full"
            >
              <ProductSkeleton />
            </div>
          ))}

        {!showSkeletons &&
          safeProducts.length > 0 &&
          safeProducts.map((product, idx) => {
            const key = product?._id || product?.id || `product-${idx}`;
            return (
              <div key={key} className="w-full">
                <ProductCard product={product} />
              </div>
            );
          })}

        {showNoProducts && (
          <div className="col-span-full text-center text-gray-400 py-10">
            No products available.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
