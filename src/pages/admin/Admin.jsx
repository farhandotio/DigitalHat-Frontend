// src/pages/admin/Admin.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

const Admin = () => {
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // not logged in
    } else if (user.role !== "admin") {
      navigate("/account"); // regular user trying to access admin
    }
  }, [user, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.fullName || "Admin"}!</p>
      {/* You can add stats, orders, users management, etc. here */}
    </div>
  );
};

export default Admin;
