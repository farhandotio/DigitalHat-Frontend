import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n ?? 0);

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // products per page
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("userToken");
      const categoryPath =
        category && category !== "All" ? `/category/${category}` : "";

      const { data } = await axios.get(
        `http://localhost:3000/api/products${categoryPath}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: query,
          },
          withCredentials: true,
        }
      );

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, category, query]);

  // helper to derive average rating
  const getAverageRating = (product) => {
    if (product == null) return 0;
    if (typeof product.averageRating === "number") return product.averageRating;
    const reviews = product.reviews ?? [];
    if (Array.isArray(reviews) && reviews.length > 0) {
      const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
      return sum / reviews.length;
    }
    if (typeof product.rating === "number") return product.rating;
    return 0;
  };

  const getStockCount = (product) => {
    if (typeof product.stock === "number") return product.stock;
    if (typeof product.countInStock === "number") return product.countInStock;
    if (typeof product.inStock === "boolean") return product.inStock ? 1 : 0;
    return 0;
  };

  const categories = ["All", "tws", "laptop", "accessories"]; // adjust as needed

  return (
    <div className="min-h-screen p-6 bg-white text-text font-sans">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Products</h1>
            <p className="text-sm text-text">Manage your DigitalHat product catalogue</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6a00] text-white rounded-lg shadow-sm hover:scale-[1.02] transition-transform"
            >
              + Add New Product
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-md border border-border">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1); // reset page when searching
                }}
                placeholder="Search product..."
                className="w-full bg-transparent border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
              />
            </div>

            <div className="w-48">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1); // reset page when changing category
                }}
                className="w-full bg-transparent border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-white text-text">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-transparent rounded-2xl border border-border">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : (
            <table className="min-w-full text-left divide-y divide-border">
              <thead className="bg-white sticky top-0">
                <tr>
                  <th className="px-4 py-3 w-10">#</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {products.map((product, idx) => {
                  const avgRating = getAverageRating(product);
                  const stockCount = getStockCount(product);
                  const inStockBool = stockCount > 0;

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transition-colors"
                    >
                      <td className="px-4 py-3 align-top">{(currentPage - 1) * itemsPerPage + idx + 1}</td>

                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0]?.url || product.image || "https://via.placeholder.com/80x80?text=No+Image"}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div>
                            <div className="font-medium">{product.title}</div>
                            <div className="text-sm text-text">{product.description ?? "-"}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 align-top">{product.category}</td>

                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <div className="font-semibold">
                          ৳ {formatPrice(product.price?.amount ?? product.price ?? 0)}
                        </div>
                      </td>

                      <td className="px-4 py-3 align-top">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            inStockBool ? "bg-green-600 text-white" : "bg-red-600 text-white"
                          }`}
                        >
                          {inStockBool ? `In Stock (${stockCount})` : "Out of Stock"}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-2">
                          <RatingStars value={avgRating} />
                          <div className="text-sm text-text">{Number(avgRating).toFixed(1)}</div>
                        </div>
                      </td>

                      <td className="px-4 py-3 align-top text-sm text-text">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 align-top text-right">
                        <div className="inline-flex gap-2">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="inline-flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-lg border border-[#ff6a00] text-[#ff6a00] hover:bg-[#ff6a00] hover:text-black transition-all"
                          >
                            View Detail
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {products.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-text">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded-md hover:bg-[#ff6a00] hover:text-white disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === i + 1 ? "bg-[#ff6a00] text-white" : "bg-white text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded-md hover:bg-[#ff6a00] hover:text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RatingStars({ value = 0 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#ff6a00]">
          <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73L12 .587z" />
        </svg>
      ))}

      {half && (
        <svg width="14" height="14" viewBox="0 0 24 24" className="text-[#ff6a00]">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#ff6a00" />
              <stop offset="50%" stopColor="currentColor" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGrad)"
            d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73L12 .587z"
          />
        </svg>
      )}

      {Array.from({ length: empty }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-600">
          <path
            d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73L12 .587z"
            strokeWidth="1"
          />
        </svg>
      ))}
    </div>
  );
}
