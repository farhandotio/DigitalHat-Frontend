import React, { useContext, useState } from "react";
import { GlobalContext } from "../../../context/GlobalContext";

const ProductActions = ({
  productId,
  stock = 0,
  title = "Product",
  quantity = 1,
}) => {
  const { addToCart } = useContext(GlobalContext);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const handleAddToCart = async () => {
    if (Number(stock) <= 0) {
      alert("This product is out of stock.");
      return;
    }
    try {
      setAddingToCart(true);
      await addToCart(productId, quantity);
      // alert(`${quantity} x ${title} added to cart!`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert(err?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (Number(stock) <= 0) {
      alert("This product is out of stock.");
      return;
    }
    try {
      setBuyingNow(true);
      await addToCart(productId, quantity);
      window.location.href = "/checkout";
    } catch (err) {
      console.error("Failed to buy now:", err);
      alert(err?.message || "Failed to proceed");
    } finally {
      setBuyingNow(false);
    }
  };

  return (
    <div className="flex gap-4 mt-8 flex-wrap">
      <button
        className={`flex-1 py-3 px-6 rounded-full font-bold text-lg shadow-lg transition-colors ${
          Number(stock) <= 0
            ? "bg-gray-400 cursor-not-allowed text-white"
            : " bg-primary hover:scale-103  text-white hover:bg-orange-600"
        }`}
        disabled={addingToCart || Number(stock) <= 0}
        onClick={handleAddToCart}
      >
        {addingToCart
          ? "Adding..."
          : Number(stock) <= 0
          ? "Out of Stock"
          : "Add to Cart"}
      </button>

      <button
        className={`flex-1 py-3 px-6 rounded-full font-bold text-lg shadow-lg transition-colors ${
          Number(stock) <= 0
            ? "bg-gray-400 cursor-not-allowed text-white"
            : " bg-green-600 hover:scale-103  text-white hover:bg-green-600"
        }`}
        disabled={buyingNow || Number(stock) <= 0}
        onClick={handleBuyNow}
      >
        {buyingNow ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
};

export default ProductActions;
