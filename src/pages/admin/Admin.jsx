// src/pages/admin/Admin.jsx
import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

const Admin = () => {
  const { user } = useContext(GlobalContext);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.fullName || "Admin"}!</p>

      {/* Example stats / quick links */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-2xl mt-2">125</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-2xl mt-2">42</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="text-2xl mt-2">87</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="text-2xl mt-2">$12,450</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
