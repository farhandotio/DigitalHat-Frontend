import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/pagination/Pagination";
import Title from "../components/title/Title";

export function ProductHeader({
  totalItems = 0,
  categories = [],
  initial = { category: "all" },
  onChange,
}) {
  const [category, setCategory] = useState(initial.category);

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange({ category });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 border-b border-border rounded-xl bg-white shadow-sm   ">
      <div className="flex items-start sm:items-center gap-2 sm:gap-4">
        <Title title={"All Products"} className={"sm:mb-0"} />
        <span className="text-base font-semibold px-3 py-1 bg-gray-100    text-gray-700 whitespace-nowrap rounded-full">
          {totalItems} items
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Category */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-border outline-primary rounded-lg  px-3 py-2 bg-white"
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             ShopWithPagination                              */
/* -------------------------------------------------------------------------- */

export default function ShopWithPagination() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // filters: only category
  const [filters, setFilters] = useState({ category: "all" });

  // ✅ static category list
  const categories = [
    { id: 1, name: "Router" },
    { id: 2, name: "TWS Earbuds" },
    { id: 3, name: "Bluetooth Devices" },
    { id: 4, name: "Speakers" },
    { id: 5, name: "Wearables" },
    { id: 6, name: "Headphones" },
    { id: 7, name: "Gaming Consoles" },
    { id: 8, name: "Tripods" },
    { id: 9, name: "Webcams" },
    { id: 10, name: "Power Banks" },
    { id: 11, name: "Chargers & Cables" },
    { id: 12, name: "Smart Home Devices" },
  ];

  const buildQuery = (p, l, fil) => {
    const params = new URLSearchParams();
    params.set("page", p);
    params.set("limit", l);

    if (fil?.category && fil.category !== "all")
      params.set("category", fil.category);

    return params.toString();
  };

  const fetchProducts = async (p = 1, l = limit, fil = filters) => {
    setIsLoading(true);
    setError("");
    try {
      const query = buildQuery(p, l, fil);
      const { data } = await axios.get(
        `  https://digitalhat-server.onrender.com/api/products?${query}`
      );

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
    fetchProducts(page, limit, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProducts(1, limit, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handlePageChange = (p) => {
    if (p === page) return;
    fetchProducts(p, limit, filters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (l) => {
    if (l === limit) return;
    fetchProducts(1, l, filters);
  };

  const handleHeaderChange = ({ category }) => {
    setFilters({ category });
  };

  return (
    <div className="px-5 md:px-10 lg:px-20 py-5 md:py-10">
      {error && <p className="text-center mt-6 text-red-500">{error}</p>}

      <ProductHeader
        totalItems={total}
        categories={categories}
        initial={filters}
        onChange={handleHeaderChange}
      />

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
