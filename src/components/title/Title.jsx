import React from "react";

const Title = ({ title, description, center = false }) => {
  return (
    <div className={`mb-8 w-full ${center ? "text-center" : "text-left"}`}>
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 relative inline-block">
        {title}
        <span className="absolute left-0 -bottom-1 w-16 h-1 bg-primary rounded-full"></span>
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
