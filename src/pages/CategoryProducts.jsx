import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/product/ProductCard";
import ProductSkeleton from "../components/product/ProductSkeleton";

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `  https://digitalhat-server-02.onrender.com/api/products/category/${categoryName}`
        );
        setProducts(data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <section className="px-5 md:px-10 lg:px-20 py-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryProducts;
