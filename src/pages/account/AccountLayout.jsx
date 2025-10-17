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

  // NEW: initialization state to avoid UI flicker while we check role/profile
  const [initializing, setInitializing] = useState(true);

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
      // Get userData from localStorage first
      const storedUser = JSON.parse(localStorage.getItem("userData") || "null");

      if (!storedUser || storedUser.role !== "user") {
        // Only regular users can fetch orders
        setOrders([]);
        return;
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        setOrders([]);
        setError("You must login to view orders");
        return;
      }

      const res = await axios.get("/api/orders/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle different response shapes
      const payload = res.data ?? {};
      const fetched = Array.isArray(payload.orders)
        ? payload.orders
        : Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.orders?.data)
        ? payload.orders.data
        : [];

      setOrders(Array.isArray(fetched) ? fetched : []);
    } catch (err) {
      console.error("fetchOrders failed:", err?.response?.data || err.message);
      setOrders([]);
      const status = err?.response?.status;
      setError(err?.response?.data?.message || "Failed to fetch orders");

      if (status === 401 || status === 403) {
        // cleanup if unauthorized
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        setUser(null);
        navigate("/login");
      }
    } finally {
      setLoadingOrders(false);
    }
  }, [navigate, setUser]);

  // On mount: fetch profile and orders (in parallel where possible)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Try fetch profile first so we can redirect admin immediately
        const me = await fetchProfile().catch(() => null);

        // If fetchProfile found an admin, fetchProfile already navigated away.
        // Still, guard here to avoid rendering this layout in case `user` or localStorage says admin.
        const localUser = JSON.parse(localStorage.getItem("userData") || "null");
        if ((me && me.role === "admin") || (localUser && localUser.role === "admin")) {
          // ensure we don't render account layout for admins
          if (!cancelled) {
            setInitializing(false); // stop initializing but we won't render since navigation happened
          }
          return;
        }

        // Fetch orders regardless of profile success (if token present)
        if (!cancelled) {
          await fetchOrders();
        }
      } catch (err) {
        if (!cancelled) {
          console.error("AccountLayout init error:", err);
        }
      } finally {
        if (!cancelled) setInitializing(false);
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

  // NEW: if still initializing, render nothing (or a loader) to prevent flicker
  if (initializing) {
    return null; // or a small loader: <div className="p-6">Loading...</div>
  }

  // NEW: double-guard: if context user exists and is admin, don't render (redirect handled earlier)
  if (user && user.role === "admin") {
    return null;
  }

  return (
    <div className="flex bg-gray-50 min-h-[calc(100vh-64px-64px)]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 w-64 bg-white border-r border-gray-200">
        <Sidebar user={user} onSignOut={handleSignOut} />
      </div>

      {/* Mobile overlay + sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 md:hidden">
          <Sidebar user={user} onSignOut={handleSignOut} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <button
            className="p-2 md:hidden text-gray-600 hover:text-orange-500"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:block text-sm text-gray-500 pr-4">
            Welcome back
            {user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}.
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 rounded-md overflow-y-auto">
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
    </div>
  );
}
