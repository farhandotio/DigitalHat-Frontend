// src/context/GlobalContext.jsx
import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const GlobalContext = createContext();

const CHECKOUT_KEY = "app_checkout_state";
const SEARCH_DEBOUNCE_MS = 300;

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // CART state
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // PRODUCTS + SEARCH state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // debounce ref for search
  const searchDebounceRef = useRef(null);

  // Axios setup
  const api = axios.create({
    baseURL:
      import.meta.env.VITE_API_URL || "https://digitalhat-server.onrender.com",
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

  // Auth sync (unchanged)
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

  // fetchProducts: accepts opts = { query, page, limit, category } but basic usage works too
  const fetchProducts = async (opts = {}) => {
    const { query = "", page, limit, category } = opts || {};
    setProductsLoading(true);
    setProductsError(null);

    try {
      // build URL: support both /api/products and /api/products/search on server
      // prefer search endpoint if there are filters (to match your Shop.jsx)
      const params = new URLSearchParams();
      if (typeof page !== "undefined") params.set("page", page);
      if (typeof limit !== "undefined") params.set("limit", limit);
      if (category) params.set("category", category);
      if (query) params.set("q", query);

      const path =
        query || page || limit || category
          ? `/api/products/search?${params.toString()}`
          : `/api/products`; // fallback to list all

      const res = await api.get(path);
      // handle different shapes gracefully
      const data = res?.data ?? {};
      // try common shapes:
      // { products: [], total, page, limit } or just [] or { success: true, products: [] }
      let productsData = [];
      if (Array.isArray(data)) {
        productsData = data;
      } else if (Array.isArray(data.products)) {
        productsData = data.products;
      } else if (Array.isArray(res.data?.data)) {
        productsData = res.data.data;
      } else {
        productsData = [];
      }

      setProducts(productsData);
      // ensure filteredProducts also reflect server results (default)
      setFilteredProducts(productsData);

      return { products: productsData, raw: data };
    } catch (err) {
      console.error("fetchProducts:", err);
      setProductsError(
        err?.response?.data?.message || err.message || "Failed to fetch products"
      );
      setProducts([]);
      setFilteredProducts([]);
      toast.error("Failed to load products.");
      throw err;
    } finally {
      setProductsLoading(false);
    }
  };

  // client-side filtering (fallback / immediate UX)
  useEffect(() => {
    // if there's no searchQuery, just mirror server products
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }

    // if there is searchQuery, we prefer server-side results (fetchProducts called separately)
    // but in case server isn't used, provide client-side filter
    const q = String(searchQuery).toLowerCase().trim();
    const filtered = (Array.isArray(products) ? products : []).filter((p) => {
      const title = (p?.title || p?.name || "").toString().toLowerCase();
      const desc = (p?.description || "").toString().toLowerCase();
      const category = (p?.category || "").toString().toLowerCase();
      const brand = (p?.brand || "").toString().toLowerCase();
      return (
        (title && title.includes(q)) ||
        (desc && desc.includes(q)) ||
        (category && category.includes(q)) ||
        (brand && brand.includes(q))
      );
    });
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  // initial load
  useEffect(() => {
    fetchProducts().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When searchQuery changes, perform a debounced server search to keep Shop fetch-less (optional)
  useEffect(() => {
    // If searchQuery is empty, we already mirrored products above.
    // Debounce to avoid rapid calls.
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      const q = (searchQuery || "").toString().trim();
      if (q.length === 0) {
        // if empty, just keep current products (avoid clearing)
        setFilteredProducts(products);
      } else {
        // call server search and set products -> filteredProducts
        fetchProducts({ query: q })
          .then(({ products: serverProducts }) => {
            // serverProducts already set by fetchProducts
            // if you prefer to keep products separate and only set filteredProducts:
            setFilteredProducts(Array.isArray(serverProducts) ? serverProducts : []);
          })
          .catch(() => {
            // keep client-side filteredProducts fallback (already handled in other effect)
          });
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // CART functions (unchanged, kept for completeness)
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
        toast.error("Session expired. Please login again.");
      } else {
        setCartError(
          err?.response?.data?.message || err.message || "Failed to fetch cart"
        );
        setCart(null);
        toast.error("Failed to load cart.");
      }
      throw err;
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.warn("Please login first 👋");
      return;
    }

    // optimistic update
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
      const res = await api.post("/api/cart/items", { productId, quantity });
      toast.success("Item added to cart");
      return res.data;
    } catch (err) {
      console.error("addToCart:", err);
      // revert by refetching server state (simple strategy)
      try {
        await fetchCart();
      } catch (_) {}
      toast.error(err?.response?.data?.message || "Failed to add to cart");
      throw err;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!user) {
      toast.warn("Please login to update cart");
      throw new Error("User not logged in");
    }
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    }));
    try {
      await api.patch(`/api/cart/items/${productId}`, { quantity });
      toast.info("Cart updated");
    } catch (err) {
      console.error("updateCartItem:", err);
      try {
        await fetchCart();
      } catch (_) {}
      toast.error("Failed to update cart item");
      throw err;
    }
  };

  const removeCartItem = async (productId) => {
    if (!user) {
      toast.warn("Please login to remove items");
      throw new Error("User not logged in");
    }
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productId !== productId),
    }));
    try {
      await api.delete(`/api/cart/items/${productId}`);
      toast.success("Item removed");
    } catch (err) {
      console.error("removeCartItem:", err);
      try {
        await fetchCart();
      } catch (_) {}
      toast.error("Failed to remove item");
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
      try {
        await fetchCart();
      } catch (_) {}
      throw err;
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!user || !token) {
      setCart(null);
      return;
    }

    if (user.role === "admin") {
      setCart(null);
      return;
    }

    fetchCart().catch(() => {});
  }, [user]);

  const proceedToCheckout = (payload = {}) => {
    if (!user) {
      toast.warn("Please login first to continue to checkout");
      window.location.assign("/login");
      return;
    }

    try {
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

export const useGlobalContext = () => React.useContext(GlobalContext);
