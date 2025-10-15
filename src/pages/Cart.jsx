// src/pages/CartPage.jsx
import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { ShoppingBag } from "lucide-react";
import axios from "axios";

import { GlobalContext } from "../context/GlobalContext";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";

const SHIPPING_COST = 125;
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Cart() {
  const { cart, cartLoading, updateCartItem, removeCartItem, clearCart } =
    useContext(GlobalContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("USD");

  const formatCurrency = useCallback((amount, cur = "USD") => {
    if (cur === "BDT") return `৳${Number(amount ?? 0).toLocaleString("en-BD")}`;
    return `$${Number(amount ?? 0).toLocaleString("en-US")}`;
  }, []);

  useEffect(() => {
    // if no items in cart
    if (!cart?.items?.length) {
      setItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchItems = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          cart.items.map(async (ci) => {
            // use env base so prod/dev works
            const res = await axios.get(
              `${API_BASE}/api/products/${ci.productId}`
            );
            const p = res.data.product || res.data;

            // Normalize price and image fields according to your product model
            const priceAmount = Number(p?.price?.amount ?? p?.price ?? 0);
            const priceCurrency = p?.price?.currency ?? "USD";
            const imageUrl =
              (p?.images &&
                p.images.length &&
                (p.images[0].url ?? p.images[0])) ||
              "/placeholder.png";

            return {
              productId: ci.productId,
              quantity: ci.quantity,
              title: p.title || "Untitled Product",
              price: priceAmount,
              currency: priceCurrency,
              stock: p.stock ?? 0,
              image: imageUrl,
              _id: p._id || ci.productId,
            };
          })
        );

        if (!cancelled) {
          setItems(results);
          if (results[0]?.currency) setCurrency(results[0].currency);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch cart items:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchItems();

    return () => {
      cancelled = true;
    };
    // re-run when cart.items changes
  }, [cart?.items]);

  // --- Quantity update without refetch ---
  const handleUpdateQuantity = useCallback(
    (productId, quantity) => {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
      );
      updateCartItem(productId, quantity);
    },
    [updateCartItem]
  );

  const handleRemove = useCallback(
    (productId) => {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      removeCartItem(productId);
    },
    [removeCartItem]
  );

  const handleClearAll = useCallback(() => {
    setItems([]);
    clearCart();
  }, [clearCart]);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, i) => acc + Number(i.price ?? 0) * Number(i.quantity ?? 0),
      0
    );
    const total = subtotal + SHIPPING_COST;
    return { subtotal, shipping: SHIPPING_COST, total };
  }, [items]);

  const itemCount = items.reduce(
    (acc, i) => acc + (Number(i.quantity) || 0),
    0
  );

  if (cartLoading || loading)
    return <p className="text-center mt-20">Loading cart...</p>;

  if (!itemCount)
    return (
      <div className="text-center py-20    mt-8 shadow-md">
        <ShoppingBag size={48} className="text-gray-400 mx-auto mb-4" />
        <p className="text-xl text-gray-600">Your cart is empty.</p>
      </div>
    );

  return (
    <div className="min-h-screen font-sans antialiased p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-extrabold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Review your items before checkout
        </p>

        <div className="mt-8 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2    shadow-xl border bg-white border-gray-100 p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Cart Items ({itemCount})
              </h2>
              <button
                onClick={handleClearAll}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition duration-150"
              >
                Clear All
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* pass cart items so OrderSummary can navigate with full data */}
            <OrderSummary
              totals={totals}
              itemCount={itemCount}
              currency={currency}
              formatCurrency={formatCurrency}
              cartItems={items}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
