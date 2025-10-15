import React from "react";

const Title = ({ title, description, center = false, className }) => {
  return (
    <div
      className={`mb-8 w-full ${className} ${
        center ? "text-center" : "text-left"
      }`}
    >
      {/* Title */}
      <h2 className="text-2xl md:text-3xl text-text relative inline-block font-bold">
        {title}
        <span className="absolute left-0 -bottom-1 w-1/3 h-1 bg-primary   "></span>
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
