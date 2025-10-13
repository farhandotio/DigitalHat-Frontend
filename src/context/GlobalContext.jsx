// src/context/GlobalContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // CART state
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // -------------------------
  // Axios setup (attach token)
  // -------------------------
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
  });

  const getAuthToken = () => localStorage.getItem("userToken");

  api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // -------------------------
  // Auth sync
  // -------------------------
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const storedToken = localStorage.getItem("userToken");

    if (storedUserData && storedToken) {
      try {
        setUser(JSON.parse(storedUserData));
      } catch {
        localStorage.removeItem("userData");
        localStorage.removeItem("userToken");
        setUser(null);
      }
    }

    const AUTH_CHANGE_EVENT = "auth-state-change";

    const onAuthChange = (event) => {
      const newUser = event?.detail?.user ?? null;
      if (newUser) setUser(newUser);
      else setUser(JSON.parse(localStorage.getItem("userData") || "null"));
    };

    const onStorage = (e) => {
      if (e.key === "userData" || e.key === "userToken") {
        setUser(JSON.parse(localStorage.getItem("userData") || "null"));
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // -------------------------
  // CART actions (optimized)
  // -------------------------
  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setCartLoading(true);
      setCartError(null);
      const res = await api.get("/api/cart");
      setCart(res.data.cart ?? { items: [] });
      return res.data;
    } catch (err) {
      console.error("fetchCart:", err);
      setCartError(
        err?.response?.data?.message || err.message || "Failed to fetch cart"
      );
      setCart(null);
      throw err;
    } finally {
      setCartLoading(false);
    }
  };

  // --- Add to cart ---
  const addToCart = async (productId, quantity = 1) => {
    if (!user) throw new Error("User not logged in");

    // Optimistically update cart locally
    setCart((prev) => {
      if (!prev?.items) return { items: [{ productId, quantity }] };
      const exists = prev.items.find((i) => i.productId === productId);
      if (exists) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      } else {
        return { ...prev, items: [...prev.items, { productId, quantity }] };
      }
    });

    try {
      await api.post("/api/cart/items", { productId, quantity });
    } catch (err) {
      console.error("addToCart:", err);
      throw err;
    }
  };

  // --- Update cart item ---
  const updateCartItem = async (productId, quantity) => {
    if (!user) throw new Error("User not logged in");

    // Optimistic update locally
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    }));

    try {
      await api.patch(`/api/cart/items/${productId}`, { quantity });
    } catch (err) {
      console.error("updateCartItem:", err);
      throw err;
    }
  };

  // --- Remove cart item ---
  const removeCartItem = async (productId) => {
    if (!user) throw new Error("User not logged in");

    // Optimistic update locally
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productId !== productId),
    }));

    try {
      await api.delete(`/api/cart/items/${productId}`);
    } catch (err) {
      console.error("removeCartItem:", err);
      throw err;
    }
  };

  // --- Clear cart ---
  const clearCart = async () => {
    if (!cart?.items?.length) return;

    // Optimistic clear
    setCart({ items: [] });

    try {
      await Promise.all(
        cart.items.map((it) => api.delete(`/api/cart/items/${it.productId}`))
      );
    } catch (err) {
      console.error("clearCart:", err);
      throw err;
    }
  };

  // fetch cart when user logs in / changes
  useEffect(() => {
    if (user) fetchCart().catch(() => {});
    else setCart(null);
  }, [user]);

  // -------------------------
  // Provide global values
  // -------------------------
  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        cart,
        cartLoading,
        cartError,
        fetchCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        formatCurrency: (amount, currency = "USD") =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
          }).format(amount ?? 0),
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
