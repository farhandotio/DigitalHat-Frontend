import React, { useState, useContext, useEffect } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { GlobalContext } from "../../context/GlobalContext";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useContext(GlobalContext);

  // Sidebar collapsed state (persisted in localStorage)
  const [collapsedState, setCollapsedState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dh_sidebar_collapsed");
    if (saved !== null) setCollapsedState(saved === "1");
  }, []);

  // Redirect if not admin
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/account" replace />;

  const handleCreate = () => navigate("/admin/products/create");

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        collapsed={collapsedState}
        onToggle={(c) => setCollapsedState(c)}
        role={user.role}
        counts={{ ordersCount: 12 }}
        onCreateClick={handleCreate}
        onNavigate={(route) => navigate(route.path)}
      />

      {/* Main admin content area */}
      <main className="flex-1 p-5 md:pr-10 lg:pr-20 overflow-x-scroll">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
