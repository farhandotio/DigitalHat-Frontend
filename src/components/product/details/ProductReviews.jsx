import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import Title from "../../title/Title";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `  https://digitalhat-server.onrender.com/api/products/${productId}/reviews`
        );
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  // Add review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return alert("Please select a rating");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("userToken"); // ✅ Get token from localStorage

      const { data } = await axios.post(
        `  https://digitalhat-server.onrender.com/api/products/${productId}/reviews`,
        { rating, comment },
        {
          withCredentials: true, // keep for cookie-based auth if backend uses both
          headers: token ? { Authorization: `Bearer ${token}` } : {}, // ✅ pass token
        }
      );

      setReviews([data.review, ...reviews]);
      setRating(0);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-gray-500 mt-4">Loading reviews...</p>;
  if (error) return <p className="text-red-500 mt-4">{error}</p>;

  return (
    <div className="mt-8 pt-6">
      <h2 className="text-xl md:text-2xl mb-4 text-text relative inline-block font-bold">
        Reviews ({reviews.length})
        <span className="absolute left-0 -bottom-1 w-1/3 h-1 bg-primary"></span>
      </h2>

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 cursor-pointer ${
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2  bg-primary hover:scale-103  text-white  rounded-full  cursor-pointer transition"
          >
            {submitting ? "Submitting..." : "Add Review"}
          </button>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Write your review..."
          className="w-full border border-border outline-primary/50   p-2 mb-2 resize-none"
        />
      </form>

      {/* List of Reviews */}
      <div className="max-h-100 overflow-y-scroll">
        <Title title="All Reviews" />
        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet.</p>
        )}
        {reviews.map((r) => (
          <div
            key={r._id}
            className="border-b border-gray-200 pb-4 mb-4 last:border-0 last:mb-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">
                {r.user?.fullName || "User"}
              </span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < r.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            {r.comment && <p className="text-text/90">{r.comment}</p>}
            <p className="text-xs text-text/70">
              {new Date(r.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
