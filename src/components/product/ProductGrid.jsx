import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

const SKELETON_COUNT = 8;
const LOAD_DELAY = 500;

const ProductGrid = ({ products = [] }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      if (!mounted) return;
      setIsLoading(false);
    }, LOAD_DELAY);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [products]);

  return (
    <section className="mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 justify-items-center">
        {isLoading ? (
          Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))
        ) : products.length > 0 ? (
          products.map((product, idx) => {
            const key =
              product?._id ??
              product?.id ??
              `${product?.name ?? "product"}-${idx}`;
            return <ProductCard key={key} product={product} />;
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No products available.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
