import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center text-center justify-center bg-gray-50 px-4 py-10">
      {/* ✅ Animated Check Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <CheckCircle className="w-20 h-20 text-green-500" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-semibold text-gray-800 mb-3"
      >
        Order Placed Successfully!
      </motion.h1>

      <p className="text-gray-600 text-center max-w-md mb-6">
        Thank you for shopping with <span className="font-semibold">DigitalHat</span>!  
        Your order has been received and is being processed. You’ll get an update soon.
      </p>

      {order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white shadow-md rounded-2xl p-5 w-full max-w-md mb-6 border border-gray-100"
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Order Summary
          </h2>
          <div className="text-gray-600 space-y-1">
            <p>
              <span className="font-medium text-gray-700">Order ID:</span>{" "}
              {order._id || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Total:</span> ৳
              {order.totalPrice || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Payment:</span>{" "}
              {order.paymentMethod || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Status:</span>{" "}
              <span className="text-green-600 font-medium">
                {order.status || "Pending"}
              </span>
            </p>
          </div>
        </motion.div>
      )}

      <Link
        to="/shop"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
