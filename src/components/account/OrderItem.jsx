import React, { useEffect, useState } from "react";
import { CheckSquare, Clock } from "lucide-react";
import axios from "../../api/axiosConfig";

export default function OrderItem({ order }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("userToken");

        // Fetch all products in parallel
        const promises = order.items.map((item) =>
          axios.get(`http://localhost:3000/api/products/${item.productId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
        );

        const responses = await Promise.all(promises);
        const fetchedProducts = responses.map((res, index) => ({
          ...res.data.product,
          quantity: order.items[index].quantity,
          price: order.items[index].price,
        }));

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    if (order.items?.length) fetchProducts();
  }, [order.items]);

  const isDelivered = order.status === "Delivered";
  const isProcessing = order.status === "Processing";

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100 mb-4">
      <div className="flex justify-between items-start flex-wrap">
        <div className="flex flex-col space-y-4 mb-4 sm:mb-0">
          {products.map((product) => (
            <div key={product._id} className="flex items-center space-x-4">
              {/* Product Image */}
              <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images?.[0]?.url || "https://placehold.co/64x64?text=P"}
                  alt={product.name || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Quantity: {product.quantity} | ৳ {product.price?.amount?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Status & Total */}
        <div className="flex flex-col items-end">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              isDelivered
                ? "bg-green-100 text-green-700"
                : isProcessing
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
          <p className="text-xl font-bold text-gray-900 mt-2">
            ৳ {order.totalPrice?.amount?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-sm text-gray-600 flex-wrap gap-3">
        {isDelivered && (
          <span className="flex items-center">
            <CheckSquare className="w-4 h-4 mr-2 text-green-500" /> Delivered on {order.deliveryDate}
          </span>
        )}
        {isProcessing && (
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-yellow-500" /> Expected delivery: {order.deliveryExpected}
          </span>
        )}
      </div>
    </div>
  );
}
