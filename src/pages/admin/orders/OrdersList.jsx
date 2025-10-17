import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../../context/GlobalContext";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {
  const { user } = useContext(GlobalContext); // Admin token
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("User not logged in");

      const { data } = await axios.get(
        "  https://digitalhat-server.onrender.com/api/admin-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Make sure we access the array in data.data
      if (data?.data && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch orders"
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!orders.length) return <div>No orders found</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
      <table className="min-w-full border border-border rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b border-border text-left text-sm text-gray-500">
              #
            </th>
            <th className="p-2 border-b border-border text-left text-sm text-gray-500">
              Order Code
            </th>
            <th className="p-2 border-b border-border text-left text-sm text-gray-500">
              User
            </th>
            <th className="p-2 border-b border-border text-left text-sm text-gray-500">
              Total
            </th>
            <th className="p-2 border-b border-border text-left text-sm text-gray-500">
              Status
            </th>
            <th className="p-2 border-b border-border text-left text-sm text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="p-2 text-gray-400 text-sm">{idx + 1}</td>
              <td className="p-2 text-gray-700 text-sm">{order.orderCode}</td>
              <td className="p-2 text-gray-700 text-sm">
                {order.user?.fullName || "Unknown"}
              </td>
              <td className="p-2 text-gray-700 text-sm">
                {order.totalPrice?.amount || 0}{" "}
                {order.totalPrice?.currency === "BDT" && "৳"}
              </td>
              <td className="p-2 text-gray-700 text-sm">
                {order.status || "Pending"}
              </td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="px-3 py-1 border border-border rounded hover:bg-gray-200 transition-colors text-sm cursor-pointer"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;
