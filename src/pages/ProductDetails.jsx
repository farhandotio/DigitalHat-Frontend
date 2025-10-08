import React from "react";
import { useParams } from "react-router-dom";
import { products } from "../../public/assets/assets";

import ProductHeader from "../components/product/details/ProductHeader";
import ProductTabs from "../components/product/details/ProductTabs";

const ProductDetails = () => {
  const { id } = useParams();

  const product = products.find((p) => p._id === id);

  if (!product) {
    return (
      <div className="text-center mt-20 text-gray-500">Product not found.</div>
    );
  }

  const reviewCount = product.reviewCount || 0;

  const fullDetails = {
    fullDescription:
      product.description || "Detailed product description goes here.",
    featureList: product.featuresList || [],
  };

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <ProductHeader product={product} />

      <ProductTabs reviewCount={reviewCount} productDetails={fullDetails} />
    </div>
  );
};

export default ProductDetails;
