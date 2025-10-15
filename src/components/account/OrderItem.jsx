import React, { useEffect, useState } from "react";
import { CheckSquare, Clock } from "lucide-react";
import axios from "../../api/axiosConfig";

export default function OrderItem({ order }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    const fetchProducts = async () => {
      if (!order || !Array.isArray(order.items) || order.items.length === 0) {
        setProducts([]);
        return;
      }

      try {
        const token = localStorage.getItem("userToken");
        // use the configured axios instance; it should include baseURL/interceptors
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Map requests
        const requests = order.items.map((item) =>
          // call relative path; axiosConfig likely has baseURL set
          axios.get(`/api/products/${item.productId}`, { headers }).catch((err) => {
            // return error marker so Promise.all doesn't reject immediately
            console.error(`Failed to fetch product ${item.productId}`, err);
            return null;
          })
        );

        const responses = await Promise.all(requests);

        if (isCancelled) return;

        const fetchedProducts = responses
          .map((res, index) => {
            if (!res || !res.data) return null;
            // Support both shapes: res.data.product or res.data itself
            const productData = res.data.product ?? res.data;
            if (!productData) return null;

            // price: prefer order item price if present, else product price (object or number)
            const item = order.items[index] || {};
            const priceFromItem = item.price ?? item.price?.amount;
            const productPrice =
              priceFromItem ??
              (productData.price?.amount ?? productData.price ?? 0);

            return {
              _id: productData._id ?? productData.id ?? item.productId,
              name: productData.title ?? productData.name ?? "Product",
              images: productData.images ?? productData.photos ?? [],
              quantity: item.quantity ?? 1,
              price: typeof productPrice === "object" ? productPrice.amount ?? 0 : productPrice,
              rawProduct: productData,
            };
          })
          .filter(Boolean);

        if (!isCancelled) setProducts(fetchedProducts);
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to fetch products", err);
          setProducts([]);
        }
      }
    };

    fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, [order]);

  // status checks (case-insensitive)
  const status = (order?.status ?? "").toString().toLowerCase();
  const isDelivered = status === "delivered" || status === "delivered".toLowerCase();
  const isProcessing = status === "processing" || status === "processing".toLowerCase();

  return (
    <div className="p-4 sm:p-6 bg-white shadow-lg border border-gray-100 mb-4">
      <div className="flex justify-between items-start flex-wrap">
        <div className="flex flex-col space-y-4 mb-4 sm:mb-0">
          {products.length ? (
            products.map((product) => (
              <div key={product._id} className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 overflow-hidden rounded">
                  <img
                    src={
                      product.images?.[0]?.url ||
                      product.images?.[0] ||
                      "https://placehold.co/64x64?text=P"
                    }
                    alt={product.name || "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {product.quantity} | ৳{" "}
                    {Number(product.price || 0).toLocaleString("en-BD")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No items found for this order.</p>
          )}
        </div>

        {/* Order Status & Total */}
        <div className="flex flex-col items-end">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded ${
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
            ৳ {order.totalPrice?.amount?.toLocaleString("en-BD") ?? "0"}
          </p>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-sm text-gray-600 flex-wrap gap-3">
        {isDelivered && order.deliveryDate && (
          <span className="flex items-center">
            <CheckSquare className="w-4 h-4 mr-2 text-green-500" /> Delivered on{" "}
            {new Date(order.deliveryDate).toLocaleDateString("en-BD")}
          </span>
        )}
        {isProcessing && order.deliveryExpected && (
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-yellow-500" /> Expected delivery:{" "}
            {order.deliveryExpected}
          </span>
        )}

        {/* fallback: show shipping phone or address snippet */}
        {!isDelivered && !isProcessing && order.shippingAddress?.phone && (
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-500" /> Contact:{" "}
            {order.shippingAddress.phone}
          </span>
        )}
      </div>
    </div>
  );
}
