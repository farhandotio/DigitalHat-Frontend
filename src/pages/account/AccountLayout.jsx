import React, { useEffect, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import Sidebar from "../../components/account/Sidebar";
import { Menu, X } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext"; // adjust path

export default function AccountLayout() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext); // global context
  const [orders, setOrders] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("userToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/api/auth/me", { headers: getAuthHeaders() });
      if (data?.user) {
        setUser(data.user); // set in global context
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
      localStorage.removeItem("userToken");
      setUser(null);
      navigate("/login");
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/orders/me", { headers: getAuthHeaders() });
      setOrders(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      if (err.response?.status === 401) {
        localStorage.removeItem("userToken");
        setUser(null);
        navigate("/login");
      }
    }
  };

  // Redirect based on user state
  useEffect(() => {
    if (user === null) {
      // user not loaded yet
      fetchProfile();
      fetchOrders();
    } else {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    }
  }, [user]);

  const handleSignOut = () => {
    localStorage.removeItem("userToken");
    setUser(null); // remove from global context
    navigate("/login");
  };

  return (
    <div className="flex bg-gray-50 min-h-[calc(100vh-64px-64px)]">
      {/* Sidebar for medium and large screens */}
      <div className="hidden md:flex flex-shrink-0 w-64 bg-white border-r border-gray-200">
        <Sidebar user={user} onSignOut={handleSignOut} />
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 md:hidden">
          <Sidebar user={user} onSignOut={handleSignOut} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          {/* Mobile menu button */}
          <button
            className="p-2 md:hidden text-gray-600 hover:text-orange-500 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:block text-sm text-gray-500 pr-4">
            Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}.
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <Outlet
            context={{
              user,
              orders,
              reloadOrders: fetchOrders,
              reloadProfile: fetchProfile,
            }}
          />
        </main>
      </div>

      {/* Mobile close button */}
      {isSidebarOpen && (
        <button
          className="fixed top-4 right-4 z-50 p-2 text-white rounded-full md:hidden shadow-xl bg-gray-800"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
