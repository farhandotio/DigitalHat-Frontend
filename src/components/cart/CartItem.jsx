// src/components/Cart/CartItem.jsx
import React, { useState } from "react";
import { Plus, Minus, X } from "lucide-react";

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  formatCurrency,
}) {
  const [quantity, setQuantity] = useState(item.quantity ?? 1);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onUpdateQuantity(item.productId, newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onUpdateQuantity(item.productId, newQty);
  };
  console.log(item)

  return (
    <div className="grid grid-cols-2">
      <div className="flex p-4 border-b border-border last:border-b-0">
        <img
          src={item.image || "/placeholder.png"}
          alt={item.title || "Product"}
          className="w-20 h-20 rounded-lg object-cover mr-4 shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.png";
          }}
        />
        <div className="flex-grow">
          <strong className="text-text text-lg block">
            {item.title || "Untitled Product"}
          </strong>
          <p className="text-text/80 text-sm mt-1">
            Stock:{" "}
            <span className="font-medium text-text/90">{item.stock ?? 0}</span>
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center border border-border rounded-lg overflow-hidden h-9">
              <button
                onClick={handleDecrease}
                className="p-2 h-full bg-white hover:bg-gray-100 transition duration-150 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus size={14} className="text-gray-600" />
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-10 text-center border-l border-r border-border text-sm font-medium"
              />
              <button
                onClick={handleIncrease}
                className="p-2 h-full bg-white hover:bg-gray-100 transition duration-150"
              >
                <Plus size={14} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-right text-lg md:text-xl font-bold text-text flex h-full flex-col justify-between items-end py-5 border-b border-border">
        <h2>{formatCurrency(quantity * (item.price ?? 0), item.currency)}</h2>
        <button
          onClick={() => onRemove(item.productId)}
          className="text-red-700 hover:text-red-600 text-sm font-medium transition duration-150 flex items-center"
        >
          <X size={12} className="mr-1" /> Remove
        </button>
      </div>
    </div>
  );
}
