import React from "react";

const Title = ({ title, description, center = false, className }) => {
  return (
    <div
      className={`mb-8 bg-white p-4 sm:p-6 border-b border-border shadow-md rounded-xl ${className} ${
        center ? "text-center" : "text-left"
      }`}
    >
      {/* Title */}
      <h2 className="text-2xl md:text-3xl text-text relative inline-block font-bold">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-text/90 text-base md:text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default Title;
