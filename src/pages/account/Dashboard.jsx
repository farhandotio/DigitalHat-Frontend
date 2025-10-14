// src/pages/account/Dashboard.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import StatCard from "../../components/account/StatCard";
import OrderItem from "../../components/account/OrderItem";
import { ShoppingCart, Clock, CheckSquare, Wallet } from "lucide-react";

export default function Dashboard() {
  const { user, orders = [] } = useOutletContext();

  // Calculate statistics
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "Processing" || o.status === "PENDING").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const totalSpent = orders.reduce((acc, o) => acc + Number(o.totalPrice?.amount || 0), 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome, {user?.fullName?.split?.(" ")[0] || "Member"}
      </h1>
      <div className="text-gray-500 mb-6">Here’s a summary of your account</div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={Clock}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
        />
        <StatCard
          title="Delivered"
          value={delivered}
          icon={CheckSquare}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Spent"
          value={`৳ ${totalSpent.toLocaleString()}`}
          icon={Wallet}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {orders.length ? (
          (orders || [])
            .slice(0, 4)
            .map((o) => <OrderItem key={o._id || o.orderId} order={o} />)
        ) : (
          <div className="text-gray-500">No recent orders.</div>
        )}
      </div>
    </div>
  );
}
