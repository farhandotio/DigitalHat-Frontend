import React, { useEffect, useState } from "react";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const OrderSuccess = () => {
  const location = useLocation();
  const orderFromState = location.state?.order;
  const orderIdFromState = location.state?.orderId;

  const [order, setOrder] = useState(orderFromState || null);
  const [loading, setLoading] = useState(!orderFromState);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!orderFromState && orderIdFromState) {
      setLoading(true);
      axios
        .get(`${API_BASE}/api/orders/${orderIdFromState}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        })
        .then((res) => {
          setOrder(res.data.order ?? res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch order:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [orderFromState, orderIdFromState]);

  const checkmarkVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 360,
      transition: { type: "spring", stiffness: 70, damping: 10 },
    },
  };

  if (loading) return <p className="text-center mt-20">Loading order...</p>;
  if (!order)
    return <p className="text-center mt-20 text-gray-700">Order not found.</p>;

  const { _id, totalPrice, shippingAddress, payment, createdAt } = order;

  const formattedAddress = [
    shippingAddress.fullName,
    shippingAddress.phone,
    shippingAddress.streetAddress,
    shippingAddress.thana,
    shippingAddress.district,
    shippingAddress.division,
    shippingAddress.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-12 md:py-20">
      <motion.div
        className="w-32 h-32 relative flex items-center justify-center mb-10"
        variants={checkmarkVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-50 to-white p-2">
          <div className="w-full h-full rounded-full bg-white shadow-inner flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500 fill-current" />
          </div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4"
      >
        Order Successful!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-gray-600 text-center max-w-lg mb-10 text-lg leading-relaxed"
      >
        Thank you for your purchase! Your order has been confirmed.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
        className="bg-white p-8 w-full max-w-md mx-auto shadow-xl rounded-xl border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">
          Order Details
        </h2>
        <div className="space-y-3 text-left text-gray-700">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Order ID:</span>
            <span className="text-blue-600 font-semibold">{_id}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Order Date:</span>
            <span className="font-semibold">
              {new Date(createdAt).toLocaleDateString("en-BD", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-t pt-3 mt-3">
            <span className="font-bold text-base">Total Amount:</span>
            <span className="font-extrabold text-lg text-gray-800">
              ৳ {totalPrice?.amount?.toLocaleString("en-BD") || "0"}
            </span>
          </div>
          <div className="flex justify-between items-start text-sm">
            <span className="font-medium whitespace-nowrap">
              Shipping Address:
            </span>
            <span className="text-gray-800 text-right">{formattedAddress}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Payment Method:</span>
            <span className="font-semibold text-gray-800">
              {payment?.method || "N/A"}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="flex justify-center mt-10 w-full max-w-md"
      >
        <Link
          to="/shop"
          className="flex items-center justify-center w-full  bg-primary hover:scale-103  text-white font-semibold py-3 px-6 rounded-lg transition shadow-md"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
