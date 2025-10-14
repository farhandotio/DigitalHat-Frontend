// src/components/cart/OrderSummary.jsx
import React, { useContext } from "react";
import { Lock } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";

export default function OrderSummary({ totals, itemCount, currency, formatCurrency, cartItems }) {
  const { proceedToCheckout } = useContext(GlobalContext);
  const { subtotal, shipping, total } = totals;

  const handleProceed = () => {
    proceedToCheckout({
      items: cartItems,
      totals,
      currency,
      itemCount,
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl lg:sticky lg:top-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
      <div className="space-y-3 pb-6 border-b border-gray-200">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
          <span className="font-medium text-gray-900">{formatCurrency(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-medium text-gray-900">{formatCurrency(shipping, currency)}</span>
        </div>
      </div>
      <div className="flex justify-between text-2xl font-bold text-gray-900 pt-6">
        <span>Total</span>
        <span>{formatCurrency(total, currency)}</span>
      </div>
      <button
        onClick={handleProceed}
        className="w-full mt-6 py-4 bg-orange-500 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-orange-600 transition duration-200 flex items-center justify-center"
      >
        <Lock size={20} className="mr-2" />
        Proceed to Checkout
      </button>
    </div>
  );
}
