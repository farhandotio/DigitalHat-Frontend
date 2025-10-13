// src/pages/CartPage.jsx
import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { ShoppingBag } from "lucide-react";
import axios from "axios";

import { GlobalContext } from "../context/GlobalContext";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";

const SHIPPING_COST = 125;

export default function Cart() {
  const { cart, cartLoading, updateCartItem, removeCartItem, clearCart } = useContext(GlobalContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("USD");

  const formatCurrency = useCallback((amount, cur = "USD") => {
    if (cur === "BDT") return `৳${amount.toLocaleString("en-BD")}`;
    return `$${amount.toLocaleString("en-US")}`;
  }, []);

  useEffect(() => {
    if (!cart?.items?.length) {
      setItems([]);
      setLoading(false);
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          cart.items.map(async (ci) => {
            const res = await axios.get(`http://localhost:3000/api/products/${ci.productId}`);
            const p = res.data.product || res.data;
            return {
              productId: ci.productId,
              quantity: ci.quantity,
              title: p.title || "Untitled Product",
              price: Number(p.price?.amount ?? p.price ?? 0),
              currency: p.price?.currency ?? "USD",
              stock: p.stock ?? 0,
              image: p.images?.[0] || "/placeholder.png",
            };
          })
        );

        setItems(results);
        if (results[0]?.currency) setCurrency(results[0].currency);
      } catch (err) {
        console.error("Failed to fetch cart items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

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
    const subtotal = items.reduce((acc, i) => acc + (i.price ?? 0) * (i.quantity ?? 0), 0);
    const total = subtotal + SHIPPING_COST;
    return { subtotal, shipping: SHIPPING_COST, total };
  }, [items]);

  const itemCount = items.length;

  if (cartLoading || loading)
    return <p className="text-center mt-20">Loading cart...</p>;

  if (!itemCount)
    return (
      <div className="text-center py-20 rounded-xl mt-8 shadow-md">
        <ShoppingBag size={48} className="text-gray-400 mx-auto mb-4" />
        <p className="text-xl text-gray-600">Your cart is empty.</p>
      </div>
    );

  return (
    <div className="min-h-screen font-sans antialiased p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-extrabold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2 text-lg">Review your items before checkout</p>

        <div className="mt-8 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 rounded-2xl shadow-xl border bg-white border-gray-100 p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Cart Items ({itemCount})</h2>
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
            <OrderSummary totals={totals} itemCount={itemCount} currency={currency} formatCurrency={formatCurrency} />
          </div>
        </div>
      </div>
    </div>
  );
}
