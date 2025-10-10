import React from "react";

const ProductImages = ({ images, mainImage, setSelectedImage, title }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full mb-4 bg-gray-50 border border-border rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={mainImage}
          alt={title}
          className="object-cover w-full aspect-square"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 w-full py-2 px-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img.url)}
              className={`flex-1 aspect-square rounded-lg border-2 transition-all duration-200 ${
                mainImage === img.url
                  ? "border-primary ring-1 ring-primary"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <img
                src={img.url}
                alt={`${title} thumbnail ${idx}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
