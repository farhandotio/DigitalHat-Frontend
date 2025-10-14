// src/pages/account/Orders.jsx
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import OrderItem from "../../components/account/OrderItem";

export default function Orders() {
  const { orders: initialOrders = [], reloadOrders } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure orders is always an array
    setOrders(Array.isArray(initialOrders) ? initialOrders : []);
    setIsLoading(false);
  }, [initialOrders]);

  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderItem key={order._id || order.orderId} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No orders found.</div>
      )}
    </div>
  );
}
