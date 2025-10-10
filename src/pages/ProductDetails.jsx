import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";

import ProductImages from "../components/product/details/ProductImages";
import ProductPrice from "../components/product/details/ProductPrice";
import ProductDescription from "../components/product/details/ProductDescription";
import ProductSpecifications from "../components/product/details/ProductSpecifications";
import QuantitySelector from "../components/product/details/QuantitySelector";
import ProductActions from "../components/product/details/ProductActions";
import ProductReviews from "../components/product/details/ProductReviews";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/products/${id}`
        );
        if (!data.product) throw new Error("Product not found");
        setProduct(data.product);
        setSelectedImage(data.product.images[0]?.url || "/placeholder.png");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch product"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading product details...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!product)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Product not found.
      </div>
    );

  const {
    title,
    price,
    originalPrice,
    images = [],
    stock,
    averageRating,
    reviewCount,
    description,
    specification,
  } = product;
  const mainImage = selectedImage || images[0]?.url || "/placeholder.png";

  return (
    <div className="container mx-auto p-5 md:p-10 lg:p20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-lg">
        <ProductImages
          images={images}
          mainImage={mainImage}
          setSelectedImage={setSelectedImage}
          title={title}
        />

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-text">{title}</h1>

          {/* Ratings */}
          <div className="flex whitespace-nowrap items-center gap-2 border-b pb-4 border-gray-200">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-text/90 font-medium">
              ({averageRating?.toFixed(1)})
            </span>
            <span className="text-sm text-primary hover:underline cursor-pointer">
              {reviewCount} reviews
            </span>
            <span className="ml-4 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              ✓ In Stock
            </span>
          </div>

          <ProductPrice price={price} originalPrice={originalPrice} />
          <ProductDescription description={description} />
          <ProductSpecifications specification={specification} />
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            stock={stock}
          />
          <ProductActions stock={stock} title={title} quantity={quantity} />
        </div>
      </div>
      <ProductReviews productId={id} />
    </div>
  );
};

export default ProductDetails;
