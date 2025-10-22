// src/pages/account/AccountLayout.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import Sidebar from "../../components/account/Sidebar";
import { Menu } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";
import DigitalHatLoading from "../../components/loading/DigitalHatLoading.jsx";

export default function AccountLayout() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);

  const [orders, setOrders] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(false);

  // initialization state to avoid UI flicker
  const [initializing, setInitializing] = useState(true);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("userToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/auth/me", {
        headers: getAuthHeaders(),
      });
      const me = data?.user ?? data;
      if (me) {
        setUser(me);
        if (me.role === "admin") navigate("/admin");
        return me;
      }
      return null;
    } catch (err) {
      console.warn("fetchProfile failed:", err?.response?.data || err.message);
      localStorage.removeItem("userToken");
      setUser(null);
      navigate("/login");
      return null;
    }
  }, [getAuthHeaders, navigate, setUser]);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    setError("");
    try {
      const storedUser = JSON.parse(localStorage.getItem("userData") || "null");
      if (!storedUser || storedUser.role !== "user") {
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
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        setUser(null);
        navigate("/login");
      }
    } finally {
      setLoadingOrders(false);
    }
  }, [navigate, setUser]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await fetchProfile().catch(() => null);
        const localUser = JSON.parse(
          localStorage.getItem("userData") || "null"
        );
        if (
          (me && me.role === "admin") ||
          (localUser && localUser.role === "admin")
        ) {
          if (!cancelled) setInitializing(false);
          return;
        }
        if (!cancelled) await fetchOrders();
      } catch (err) {
        if (!cancelled) console.error("AccountLayout init error:", err);
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

  if (user && user.role === "admin") return null;

  return (
    <div className="flex bg-gray-50 min-h-[calc(100vh-64px-64px)]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 w-64 bg-white border-r border-gray-200">
        <Sidebar user={user} onSignOut={handleSignOut} />
      </div>

      {/* Mobile overlay + sidebar */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 md:hidden">
            <Sidebar user={user} onSignOut={handleSignOut} />
          </div>
        </>
      )}

      {/* Main content */}
      {initializing ? (
        <DigitalHatLoading isLoading={true} />
      ) : (
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
      )}
    </div>
  );
}
