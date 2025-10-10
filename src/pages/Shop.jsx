import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/pagination/Pagination";

export default function ShopWithPagination() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async (p = 1, l = limit) => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`http://localhost:3000/api/products?page=${p}&limit=${l}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPage(Number(data.page || p));
      setLimit(Number(data.limit || l));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, limit);
  }, []);

  const handlePageChange = (p) => {
    if (p === page) return;
    fetchProducts(p, limit);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (l) => {
    if (l === limit) return;
    fetchProducts(1, l);
  };

  return (
    <div className="px-5 md:px-10 lg:px-20 py-5">
      {error && <p className="text-center mt-6 text-red-500">{error}</p>}
      <ProductGrid products={products} isLoading={isLoading} />
      <Pagination
        page={page}
        total={total}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
