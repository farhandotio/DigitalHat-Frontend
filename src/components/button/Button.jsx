// src/components/ui/Button.jsx
import React from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm hover:shadow-md",
    outline:
      "border border-gray-400 text-gray-700 hover:bg-gray-100 shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const finalClass = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    disabled || loading ? "opacity-60 cursor-not-allowed" : "",
    className
  );

  return (
    <button
      type={type}
      className={finalClass}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

export default Button;
