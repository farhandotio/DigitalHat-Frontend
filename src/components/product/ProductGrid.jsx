import React from "react";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

const SKELETON_COUNT = 5;

const ProductGrid = ({ products = [], isLoading = false }) => {
  const showSkeletons = isLoading;
  const showNoProducts = !isLoading && products.length === 0;

  return (
    <section className="mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-items-center">
        {showSkeletons &&
          Array.from({ length: 5 }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))}

        {!showSkeletons &&
          products.length > 0 &&
          products.map((product, idx) => {
            const key = product._id || product.id || `product-${idx}`;
            return <ProductCard key={key} product={product} />;
          })}

        {showNoProducts && (
          <div className="col-span-full text-center text-gray-200 py-10">
            No products available.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
