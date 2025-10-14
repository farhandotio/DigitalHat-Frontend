// src/context/GlobalContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const GlobalContext = createContext();

const CHECKOUT_KEY = "app_checkout_state";

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // CART state
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Axios setup (attach token)
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

  // Auth sync (unchanged) ...
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

  // CART functions (unchanged for brevity) ...
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

  const addToCart = async (productId, quantity = 1) => {
    if (!user) throw new Error("User not logged in");
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

  const updateCartItem = async (productId, quantity) => {
    if (!user) throw new Error("User not logged in");
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

  const removeCartItem = async (productId) => {
    if (!user) throw new Error("User not logged in");
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

  const clearCart = async () => {
    if (!cart?.items?.length) return;
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

  useEffect(() => {
    if (user) fetchCart().catch(() => {});
    else setCart(null);
  }, [user]);

  // -------------------------
  // Centralized Checkout helpers
  // -------------------------
  /**
   * payload: { items, totals, currency, itemCount, extra?: {...} }
   * Stores payload in sessionStorage and navigates to /checkout.
   */
  const proceedToCheckout = (payload = {}) => {
    try {
      // minimal validation
      const safe = {
        items: payload.items ?? cart?.items ?? [],
        totals: payload.totals ?? { subtotal: 0, shipping: 0, total: 0 },
        currency: payload.currency ?? "USD",
        itemCount:
          payload.itemCount ??
          payload.items?.length ??
          cart?.items?.length ??
          0,
        extra: payload.extra ?? null,
      };
      // store in session so checkout can read after navigate or refresh
      sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(safe));

      // navigate to checkout. Using location.assign ensures it works whether provider is inside Router or not.
      // If your provider is inside Router and you prefer client router navigation, replace with navigate('/checkout') from Router.
      window.location.assign("/checkout");
    } catch (err) {
      console.error("proceedToCheckout:", err);
      // fallback: still navigate
      window.location.assign("/checkout");
    }
  };

  // read checkout state (for components that prefer reading from context)
  const getCheckoutState = () => {
    try {
      const raw = sessionStorage.getItem(CHECKOUT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error("getCheckoutState:", err);
      return null;
    }
  };

  const clearCheckoutState = () => {
    try {
      sessionStorage.removeItem(CHECKOUT_KEY);
    } catch (err) {
      console.error("clearCheckoutState:", err);
    }
  };

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
        proceedToCheckout,
        getCheckoutState,
        clearCheckoutState,

        formatCurrency: (amount, currency = "BDT") => {
          if (currency === "BDT") {
            return `৳${Number(amount ?? 0).toLocaleString("en-BD")}`;
          }
          // fallback for other currencies like USD
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
          }).format(amount ?? 0);
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
