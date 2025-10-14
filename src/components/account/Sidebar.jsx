import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, MapPin, Settings, LogOut } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext"; // adjust path

const NavItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center space-x-3 p-3 rounded-xl transition-colors w-full text-left font-medium ${
        isActive
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
          : "text-gray-600 hover:bg-gray-100 hover:text-orange-500"
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm">{label}</span>
  </NavLink>
);

export default function Sidebar({ user, onSignOut }) {
  const { setUser } = useContext(GlobalContext); // get setUser from context

  const handleSignOut = () => {
    localStorage.removeItem("userToken");
    if (setUser) setUser(null); // remove user from global context
    if (onSignOut) onSignOut();
  };

  const navigationItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "." },
    { label: "Orders", icon: ShoppingBag, to: "orders" },
    { label: "Addresses", icon: MapPin, to: "addresses" },
    { label: "Account Settings", icon: Settings, to: "settings" },
  ];

  return (
    <aside className="flex flex-col w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {user && (
        <div className="p-4 pt-6 flex flex-col items-center border-b border-gray-100">
          <img
            src={`https://placehold.co/150x150/f0f9ff/1d4ed8?text=${(user.fullName || "U").charAt(0)}`}
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover mb-3 shadow-inner"
          />
          <p className="font-semibold text-gray-800">{user.fullName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <span className="mt-2 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
            {user.role === "admin" ? "Administrator" : "Member"}
          </span>
        </div>
      )}

      <nav className="p-4 flex-grow space-y-1">
        {navigationItems.map(item => (
          <NavItem key={item.label} icon={item.icon} label={item.label} to={item.to} />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 p-3 rounded-xl transition-colors w-full text-left text-red-500 hover:bg-red-50 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
