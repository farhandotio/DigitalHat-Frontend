import React, { useState } from "react";

// Reusable Icons (Keep these here for this file's context)
const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
const HeartIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ProductHeader = ({ product }) => {
  // Destructure data from the product prop and set defaults
  const {
    title = "Product Name",
    reviewCount = 2847,
    averageRating = 4.8,
    stock = 12,
    images = ["/placeholder-image.png"], // Ensure at least one image is a default
    description = "Industry-leading noise canceling with Dual Noise Sensor technology, 30-hour battery life with quick charge. Touch sensor controls to pause, play, skip tracks, control volume, activate voice assistant, and answer phone calls.",
    price = { amount: 34999.00, currency: 'BDT' }, // Updated default price to BDT format
    // You would add originalPrice and discount here if available
  } = product;

  const [quantity, setQuantity] = useState(1);
  // State to track the currently selected main image index
  const [mainImageIndex, setMainImageIndex] = useState(0); 

  const maxQuantity = stock;
  // Dynamically set the main image based on the state
  const mainImage = images[mainImageIndex] || images[0];
  const thumbnails = images;
  
  // Format price with BDT symbol
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
  }).format(price.amount || 34999.00).replace('BDT', '৳');

  const handleQuantityChange = (type) => {
    if (type === "inc" && quantity < maxQuantity) setQuantity(quantity + 1);
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
  };
  
  // New handler to change the main image on thumbnail click
  const handleThumbnailClick = (index) => {
      setMainImageIndex(index);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Image Gallery */}
      <div className="lg:w-1/2">
        <div className="bg-text/19 rounded-lg overflow-hidden mb-4">
          <img
            src={mainImage}
            alt={title}
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>
        <div className="flex gap-4">
          {thumbnails.slice(0, 4).map((img, idx) => ( // Show max 4 thumbnails
            <div
              key={idx}
              // Add onClick handler to switch the main image
              onClick={() => handleThumbnailClick(idx)}
              className={`w-1/4 aspect-square border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200
                ${
                  idx === mainImageIndex // Use mainImageIndex for active state
                    ? "border-primary" 
                    : "border-transparent hover:border-text/39"
                }
              `}
            >
              <img src={img} alt={`${title} ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Product Details & Actions */}
      <div className="lg:w-1/2">
        <h1 className="text-3xl font-semibold text-text/89 mb-2">{title}</h1>
        
        {/* Rating and Stock */}
        <div className="flex items-center text-sm space-x-2 mb-4">
          <span className="text-yellow-500">
            {"★".repeat(Math.floor(averageRating))}
          </span>
          <span className="text-text/69">
            ({averageRating}) {reviewCount.toLocaleString()} reviews
          </span>
          <span className="flex items-center text-green-600 font-medium">
            <CheckIcon /> {maxQuantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <hr className="my-4 text-border" />

        {/* Pricing */}
        <div className="flex items-end gap-3 mb-1">
          <span className="text-3xl font-bold text-text/99">
            {/* Display price using BDT format */}
            {formattedPrice}
          </span>
          {/* Add original price and discount logic here if needed */}
        </div>
        <p className="text-sm text-text/59 mb-6">Free shipping on orders over ৳150</p>
        
        <hr className="my-6 text-border" />

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-8">
          <p className="font-medium">Quantity</p>
          <div className="flex items-center border border-border rounded">
            <button
              onClick={() => handleQuantityChange("dec")}
              disabled={quantity <= 1}
              className="p-2 border-r border-border hover:bg-text/19 disabled:opacity-50"
            > - </button>
            <input type="text" value={quantity} readOnly className="w-12 text-center focus:outline-none" />
            <button
              onClick={() => handleQuantityChange("inc")}
              disabled={quantity >= maxQuantity}
              className="p-2 border-l border-border hover:bg-text/19 disabled:opacity-50"
            > + </button>
          </div>
          <p className="text-sm text-red-600">Only {maxQuantity} left in stock</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button className="flex-1 py-3 px-6 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"> Add to Cart </button>
          <button className="flex-1 py-3 px-6 bg-text/89 text-white font-semibold rounded-lg hover:bg-text/79 transition"> Buy Now </button>
        </div>

        <button className="flex items-center justify-center w-full py-3 px-6 border border-border text-text/79 font-semibold rounded-lg hover:bg-text/59transition mb-6">
          <HeartIcon /> Add to Wishlist
        </button>
      </div>
    </div>
  );
};

export default ProductHeader;