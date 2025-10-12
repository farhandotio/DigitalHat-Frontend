// src/components/ui/LinkButton.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

const LinkButton = ({
  to = "/",
  children,
  icon: Icon, // pass an icon component
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  target,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-primary hover:bg-orange-600 text-white shadow-sm hover:shadow-md",
    secondary:
      "bg-secondary hover:bg-primary text-white shadow-sm hover:shadow-md",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const finalClass = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    loading ? "opacity-60 cursor-not-allowed" : "",
    className
  );

  return (
    <Link to={to} target={target} className={finalClass}>
      {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
      {children}
      {Icon && variant === "primary" && (
        <Icon className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </Link>
  );
};

export default LinkButton;
