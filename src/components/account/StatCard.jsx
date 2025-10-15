// src/components/account/StatCard.jsx
import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  isCurrency,
}) {
  return (
    <div className="flex flex-col p-4 bg-white    shadow-md flex-1 min-w-[150px]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`p-2    ${bgColor} ${color}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-800">
        {isCurrency ? `$${Number(value || 0).toLocaleString()}` : value}
      </div>
    </div>
  );
}
