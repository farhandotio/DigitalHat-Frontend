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

  // PRODUCTS + SEARCH state
  const [products, setProducts] = useState([]); // all products
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(""); // global search query
  const [filteredProducts, setFilteredProducts] = useState([]); // derived

  // Axios setup (attach token)
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://digitalhat-server.onrender.com",
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

  // -------------------------
  // PRODUCTS: fetch & filter
  // -------------------------
  const fetchProducts = async (opts = {}) => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      // If your API supports server-side search / pagination, pass query via opts.query
      const q = opts.query ? `?q=${encodeURIComponent(opts.query)}` : "";
      const res = await api.get(`/api/products${q}`);
      // assume API returns { products: [...] } or an array directly
      const data = res.data?.products ?? res.data ?? [];
      setProducts(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error("fetchProducts:", err);
      setProductsError(err?.response?.data?.message || err.message || "Failed to fetch products");
      setProducts([]);
      throw err;
    } finally {
      setProductsLoading(false);
    }
  };

  // client-side filtering: adjust to your product schema (title, description, category, brand, etc.)
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }
    const q = String(searchQuery).toLowerCase().trim();
    const filtered = products.filter((p) => {
      // safe-guard fields — change these based on your product shape
      const title = (p.title || p.name || "").toString().toLowerCase();
      const desc = (p.description || "").toString().toLowerCase();
      const category = (p.category || "").toString().toLowerCase();
      const brand = (p.brand || "").toString().toLowerCase();
      return (
        title.includes(q) ||
        desc.includes(q) ||
        category.includes(q) ||
        brand.includes(q)
      );
    });
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  // Optionally fetch products once on mount (you can remove if you load products elsewhere)
  useEffect(() => {
    // only auto-fetch if you don't already populate products somewhere else
    fetchProducts().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // CART functions (unchanged for brevity) ...
  // -------------------------
  const fetchCart = async () => {
    if (!user || user.role === "admin") {
      setCart(null);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setCart(null);
      setCartError("User not logged in");
      return;
    }

    try {
      setCartLoading(true);
      setCartError(null);

      const res = await api.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data.cart ?? { items: [] });
      return res.data;
    } catch (err) {
      console.error("fetchCart:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        setUser(null);
        setCart(null);
        setCartError("User access required. Please login again.");
      } else {
        setCartError(
          err?.response?.data?.message || err.message || "Failed to fetch cart"
        );
        setCart(null);
      }
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
    const token = getAuthToken();
    if (!user || !token) {
      setCart(null);
      return;
    }

    // Skip cart fetching for admin users
    if (user.role === "admin") {
      setCart(null);
      return;
    }

    fetchCart().catch(() => {});
  }, [user]);

  const proceedToCheckout = (payload = {}) => {
    try {
      const safe = {
        items: payload.items ?? cart?.items ?? [],
        totals: payload.totals ?? { subtotal: 0, shipping: 0, total: 0 },
        currency: payload.currency ?? "USD",
        itemCount:
          payload.itemCount ?? payload.items?.length ?? cart?.items?.length ?? 0,
        extra: payload.extra ?? null,
      };
      sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(safe));

      window.location.assign("/checkout");
    } catch (err) {
      console.error("proceedToCheckout:", err);
      window.location.assign("/checkout");
    }
  };

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

        // cart
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

        // products & search
        products,
        setProducts,
        productsLoading,
        productsError,
        fetchProducts,
        searchQuery,
        setSearchQuery,
        filteredProducts,

        formatCurrency: (amount, currency = "BDT") => {
          if (currency === "BDT") {
            return `৳${Number(amount ?? 0).toLocaleString("en-BD")}`;
          }
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

// convenience hook
export const useGlobalContext = () => React.useContext(GlobalContext);
