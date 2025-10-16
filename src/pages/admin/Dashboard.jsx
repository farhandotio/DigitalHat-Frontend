import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("userToken");
        const config = {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          withCredentials: true,
        };

        // 1️⃣ Fetch total products
        const productsRes = await axios.get("http://localhost:3000/api/products", config);
        // Handle API returning array or paginated object
        setTotalProducts(productsRes.data?.products?.length ?? productsRes.data?.length ?? 0);

        // 2️⃣ Fetch total orders
        const ordersRes = await axios.get("http://localhost:3000/api/admin-orders", config);
        const orders = ordersRes.data?.data ?? ordersRes.data ?? [];
        setTotalOrders(orders.length);

        // Pending orders count
        const pendingCount = orders.filter(o => o.status === "Pending").length;
        setPendingOrders(pendingCount);

        // 3️⃣ Total users
        const usersRes = await axios.get("http://localhost:3000/api/auth/all", config);
        setTotalUsers(usersRes.data?.length ?? 0);

        // 4️⃣ Revenue calculation
        const totalRevenue = orders.reduce((sum, order) => {
          if (order.totalPrice) {
            // order.totalPrice could be number or object { amount: number }
            if (typeof order.totalPrice === "object" && order.totalPrice.amount) {
              return sum + order.totalPrice.amount;
            }
            return sum + (order.totalPrice || 0);
          }
          return sum;
        }, 0);
        setRevenue(totalRevenue);

        // 5️⃣ Recent 5 orders
        const recent = orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentOrders(recent);

      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white min-h-screen text-text">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome, Admin • {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card title="Total Products" value={totalProducts} color="bg-blue-500" />
        <Card title="Total Orders" value={totalOrders} color="bg-green-500" />
        <Card title="Pending Orders" value={pendingOrders} color="bg-blue-500" />
        <Card title="Total Users" value={totalUsers} color="bg-purple-500" />
        <Card title="Revenue" value={`৳ ${revenue.toLocaleString()}`} color="bg-red-500" />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{order._id}</td>
                  <td className="px-4 py-2">{order.user?.fullName || "Guest"}</td>
                  <td className="px-4 py-2">
                    ৳ {typeof order.totalPrice === "object" ? order.totalPrice.amount.toLocaleString() : (order.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "PENDING"
                          ? "bg-blue-500 text-white"
                          : order.status === "DELIVERED"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 h-64 flex items-center justify-center text-gray-400">
          Sales Chart
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 h-64 flex items-center justify-center text-gray-400">
          Top Products / Categories Chart
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const Card = ({ title, value, color }) => (
  <div className={`p-4 rounded-2xl text-white shadow-md ${color}`}>
    <div className="text-sm">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

export default Dashboard;
