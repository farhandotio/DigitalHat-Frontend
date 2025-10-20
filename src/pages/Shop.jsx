// src/pages/Shop.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/pagination/Pagination";
import Title from "../components/title/Title";
import { useLocation } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

export function ProductHeader({
  totalItems = 0,
  categories = [],
  initial = { category: "all", q: "" },
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 border-b border-border rounded-xl bg-white shadow-sm">
      <div className="flex items-start sm:items-center gap-2 sm:gap-4">
        <Title title={"All Products"} className={"sm:mb-0"} />
        <span className="text-base font-semibold px-3 py-1 bg-gray-100 text-gray-700 whitespace-nowrap rounded-full">
          {totalItems} items
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm">Category:</label>
          <select
            value={initial.category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-border outline-primary rounded-lg px-3 py-2 bg-white"
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

export default function Shop() {
  const { searchQuery, setSearchQuery } = useGlobalContext();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // filters include category + q
  const [filters, setFilters] = useState({ category: "all", q: searchQuery || "" });

  const categories = [
    { id: 1, name: "tws" }, { id: 2, name: "fan" }, { id: 3, name: "watch" },
    { id: 4, name: "charger" }, { id: 5, name: "cable" }, { id: 6, name: "neckband" },
    { id: 7, name: "router" }, { id: 8, name: "Tripod" }, { id: 9, name: "keyboard" },
    { id: 10, name: "Power Bank" }, { id: 11, name: "speaker" }, { id: 12, name: "drone" },
    { id: 13, name: "microphone" }, { id: 14, name: "gaming" }, { id: 15, name: "headphone" },
  ];

  const buildQuery = (p, l, fil) => {
    const params = new URLSearchParams();
    params.set("page", p);
    params.set("limit", l);
    if (fil?.category && fil.category !== "all") params.set("category", fil.category);
    if (fil?.q) params.set("q", fil.q);
    return params.toString();
  };

  const fetchProducts = async (p = 1, l = limit, fil = filters) => {
    setIsLoading(true);
    setError("");
    try {
      // NOTE: calling the search endpoint on backend
      const query = buildQuery(p, l, fil);
      const url = `https://digitalhat-server.onrender.com/api/products/search?${query}`;
      const { data } = await axios.get(url);

      if (!data) throw new Error("No data from products API");

      // expect { success: true, products, page, limit, total }
      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotal(Number(data.total || 0));
      setPage(Number(data.page || p));
      setLimit(Number(data.limit || l));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  // On mount: sync q from URL or global context
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qFromUrl = params.get("q") || "";
    if (qFromUrl) {
      setSearchQuery(qFromUrl);
      setFilters((prev) => ({ ...prev, q: qFromUrl }));
    } else if (searchQuery) {
      setFilters((prev) => ({ ...prev, q: searchQuery }));
    }

    // initial fetch (use local filters merged)
    fetchProducts(1, limit, { ...filters, q: qFromUrl || searchQuery || "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only on mount

  // fetch when filters change
  useEffect(() => {
    fetchProducts(1, limit, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // keep filters in sync with global searchQuery
  useEffect(() => {
    if ((searchQuery || "") !== (filters.q || "")) {
      setFilters((prev) => ({ ...prev, q: searchQuery || "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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
    setFilters((prev) => ({ ...prev, category }));
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
