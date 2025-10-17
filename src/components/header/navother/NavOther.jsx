import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ProfileIcon from "../profileIcon/ProfileIcon";

const NavOther = ({ cartCount }) => {
  const actionItems = [
    {
      key: "cart",
      to: "/cart",
      label: "Cart",
      Icon: ShoppingCart,
      count: cartCount,
    },
  ];

  return (
    <div className="flex items-center gap-4 md:gap-4">
      {actionItems.map(({ key, to, label, Icon, count }) => (
        <Link
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          key={key}
          to={to}
          className="relative flex items-center gap-2 px-3 py-2    transition hover:bg-white/5"
          aria-label={label}
        >
          <Icon className="w-5 h-5 text-white" />
          <span className="sr-only">{label}</span>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[11px] px-1 rounded-full">
              {count}
            </span>
          )}
        </Link>
      ))}

      {/* Profile / Seller */}
      <div className="block">
        <ProfileIcon />
      </div>
    </div>
  );
};

export default React.memo(NavOther);
