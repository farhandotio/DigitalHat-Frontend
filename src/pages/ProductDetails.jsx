// src/pages/ProductDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";

import { GlobalContext } from "../context/GlobalContext";

import ProductImages from "../components/product/details/ProductImages";
import ProductPrice from "../components/product/details/ProductPrice";
import ProductDescription from "../components/product/details/ProductDescription";
import ProductSpecifications from "../components/product/details/ProductSpecifications";
import QuantitySelector from "../components/product/details/QuantitySelector";
import ProductActions from "../components/product/details/ProductActions";
import ProductReviews from "../components/product/details/ProductReviews";
import ProductGrid from "../components/product/ProductGrid";
import Title from "../components/title/Title";
import Loading from "../components/loading/Loading";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(GlobalContext);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoadingRelativeProducts, setIsLoadingRelativeProducts] =
    useState(false);

  // --- Fetch main product ---
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `https://digitalhat-server.onrender.com/api/products/${id}`
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

  // --- Fetch related products by title & category ---
  useEffect(() => {
    if (!product) return;

    const fetchRelated = async () => {
      setIsLoadingRelativeProducts(true);
      try {
        const categoryValue =
          product.category?.slug ||
          (typeof product.category === "string" ? product.category : null) ||
          product.categoryId ||
          product.category_name ||
          null;

        // search by title and category
        let query = "";
        if (product.title)
          query += `title=${encodeURIComponent(product.title)}&`;
        if (categoryValue)
          query += `category=${encodeURIComponent(categoryValue)}&`;
        query += `limit=5&exclude=${id}`;

        const url = `https://digitalhat-server.onrender.com/api/products/search?${query}`;
        const res = await axios.get(url);
        const related =
          res.data?.products ||
          res.data?.results ||
          (Array.isArray(res.data) ? res.data : []);
        setRelatedProducts(related.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch related products:", err);
        setRelatedProducts([]);
      } finally {
        setIsLoadingRelativeProducts(false);
      }
    };

    fetchRelated();
  }, [product, id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <Loading isLoading={isLoading} />
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
        <Loading isLoading={isLoading} />
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

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id || id, quantity);
      alert(`${quantity} x ${title} added to cart!`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product._id || id, quantity);
      window.location.href = "/checkout";
    } catch (err) {
      console.error("Failed to buy now:", err);
      alert("Failed to proceed. Please try again.");
    }
  };

  return (
    <div className="w-full p-5 md:p-10 lg:p-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductImages
          images={images}
          mainImage={mainImage}
          setSelectedImage={setSelectedImage}
          title={title}
        />

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-text">{title}</h1>

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

          <ProductActions
            productId={product._id || id}
            stock={stock}
            title={title}
            quantity={quantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>

      <ProductReviews productId={id} />

      <div className="mt-12">
        <Title title="Related Products" />
        <ProductGrid
          products={relatedProducts}
          isLoading={isLoadingRelativeProducts}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
