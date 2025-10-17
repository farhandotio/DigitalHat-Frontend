// src/pages/account/AccountLayout.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import Sidebar from "../../components/account/Sidebar";
import { Menu, X } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";

export default function AccountLayout() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);

  const [orders, setOrders] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(false);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("userToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Fetch profile (returns the user or null)
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/auth/me", {
        headers: getAuthHeaders(),
      });
      const me = data?.user ?? data;
      if (me) {
        setUser(me);
        // if admin redirect
        if (me.role === "admin") {
          navigate("/admin");
        }
        return me;
      }
      return null;
    } catch (err) {
      console.warn("fetchProfile failed:", err?.response?.data || err.message);
      // unauthenticated -> cleanup and redirect to login
      localStorage.removeItem("userToken");
      setUser(null);
      navigate("/login");
      return null;
    }
  }, [getAuthHeaders, navigate, setUser]);

  // Fetch orders: robustly handle different response shapes
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    setError("");
    try {
      const res = await axios.get("/api/orders/me", {
        headers: getAuthHeaders(),
      });
      // Try several likely shapes:
      // { orders: [...] } or { data: [...] } or [...] directly
      const payload = res.data ?? {};
      const fetched =
        Array.isArray(payload.orders) ? payload.orders :
        Array.isArray(payload.data) ? payload.data :
        Array.isArray(payload) ? payload : 
        // sometimes API wraps with { orders: { data: [...] } }
        (Array.isArray(payload?.orders?.data) ? payload.orders.data : []);

      setOrders(Array.isArray(fetched) ? fetched : []);
    } catch (err) {
      console.error("fetchOrders failed:", err?.response?.data || err.message);
      setOrders([]);
      const status = err?.response?.status;
      setError(err?.response?.data?.message || "Failed to fetch orders");
      if (status === 401) {
        localStorage.removeItem("userToken");
        setUser(null);
        navigate("/login");
      }
    } finally {
      setLoadingOrders(false);
    }
  }, [getAuthHeaders, navigate, setUser]);

  // On mount: fetch profile and orders (in parallel where possible)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Try fetch profile first so we can redirect admin immediately
        const me = await fetchProfile().catch(() => null);

        // Fetch orders regardless of profile success (if token present)
        if (!cancelled) {
          await fetchOrders();
        }
      } catch (err) {
        if (!cancelled) {
          console.error("AccountLayout init error:", err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchProfile, fetchOrders]);

  const handleSignOut = () => {
    localStorage.removeItem("userToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex bg-gray-50 min-h-[calc(100vh-64px-64px)]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 w-64 bg-white border-r border-gray-200">
        <Sidebar user={user} onSignOut={handleSignOut} />
      </div>

      {/* Mobile overlay + sidebar */}
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
          <button className="p-2 md:hidden text-gray-600 hover:text-orange-500" onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
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
              loadingOrders,
            }}
          />
        </main>
      </div>

      {/* Mobile close button */}
      {/* {isSidebarOpen && (
        <button className="fixed top-4 right-4 z-50 p-2 text-text md:hidden shadow-xl bg-white rounded" onClick={() => setIsSidebarOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      )} */}
    </div>
  );
}
