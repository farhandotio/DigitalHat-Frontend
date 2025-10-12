import React, { useState, useMemo, useContext } from "react";
import {
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  Clock,
  CheckSquare,
  Wallet,
  Filter,
  Search,
  Laptop,
  Headphones,
  Smartphone,
  Eye,
  RotateCw,
  CornerDownLeft,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { GlobalContext } from "../context/GlobalContext";

// --- Sub Components ---
const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 p-3 rounded-xl transition-colors w-full text-left font-medium ${
      isActive
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
        : "text-gray-600 hover:bg-gray-100 hover:text-orange-500"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon: Icon, color, bgColor, isCurrency }) => (
  <div className="flex flex-col p-4 bg-white rounded-xl shadow-md flex-1 min-w-[150px]">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className={`p-2 rounded-full ${bgColor} ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="mt-2 text-2xl font-bold text-gray-800">
      {isCurrency ? `$${value.toLocaleString()}` : value}
    </div>
  </div>
);
const OrderItem = ({ order }) => {
  const Icon = order.icon;
  const isDelivered = order.status === "Delivered";
  const isProcessing = order.status === "Processing";

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100 mb-4">
      <div className="flex justify-between items-start flex-wrap">
        {/* Product Info */}
        <div className="flex items-start space-x-4 mb-4 sm:mb-0">
          <div className="p-3 bg-gray-100 rounded-lg text-gray-700">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {order.productName}
            </p>
            <p className="text-xs text-gray-500 mt-1">Order #{order.orderId}</p>
            <p className="text-xs text-gray-500">Placed on {order.orderDate}</p>
          </div>
        </div>

        {/* Status and Price */}
        <div className="flex flex-col items-end">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              isDelivered
                ? "bg-green-100 text-green-700"
                : isProcessing
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
          <p className="text-xl font-bold text-gray-900 mt-2">
            ${order.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Delivery Status and Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center text-sm text-gray-600">
          {isDelivered && (
            <span className="flex items-center">
              <CheckSquare className="w-4 h-4 mr-2 text-green-500" />
              Delivered on {order.deliveryDate}
            </span>
          )}
          {isProcessing && (
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-yellow-500" />
              Expected delivery: {order.deliveryExpected}
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-orange-600 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors shadow-sm">
            <Eye className="w-4 h-4 mr-1" /> View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const Pagination = () => (
  <div className="flex justify-center items-center space-x-2 mt-8">
    <button className="p-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
      <ChevronLeft className="w-5 h-5" />
    </button>
    {[1, 2, 3].map((page) => (
      <button
        key={page}
        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
          page === 1
            ? "bg-orange-500 text-white shadow-md shadow-orange-500/50"
            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
        }`}
      >
        {page}
      </button>
    ))}
    <button className="p-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
);

// --- Main Component ---
const Account = () => {
  const { user } = useContext(GlobalContext); // <-- real user data
  const [activeMenu, setActiveMenu] = useState("Orders");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = useMemo(
    () => [
      { label: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
      { label: "Orders", icon: ShoppingBag, path: "orders" },
      { label: "Wishlist", icon: Heart, path: "wishlist" },
      { label: "Addresses", icon: MapPin, path: "addresses" },
      { label: "Account Settings", icon: Settings, path: "settings" },
    ],
    []
  );

  const Sidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-40 flex-shrink-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:static h-full flex flex-col`}
    >
      {/* User Info */}
      {user && (
        <div className="p-4 pt-10 flex flex-col items-center border-b border-gray-100">
          <img
            src={`https://placehold.co/150x150/f0f9ff/1d4ed8?text=${user.fullName.charAt(
              0
            )}`}
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover mb-3"
          />
          <p className="font-semibold text-gray-800">{user.fullName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <span className="mt-2 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
            {user.role === "admin" ? "Administrator" : "Member"}
          </span>
        </div>
      )}

      <nav className="p-4 flex-grow space-y-1">
        {navigationItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={activeMenu === item.label}
            onClick={() => {
              setActiveMenu(item.label);
              setIsSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center space-x-3 p-3 rounded-xl transition-colors w-full text-left text-red-500 hover:bg-red-50 font-medium">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );

  const MainHeader = () => (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4 flex items-center justify-between lg:justify-end shadow-sm">
      <button
        className="p-2 lg:hidden text-gray-600 hover:text-orange-500"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center space-x-3 w-full max-w-md ml-auto">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>
        <button className="flex items-center space-x-1 p-2 bg-orange-500 text-white rounded-xl shadow-md hover:bg-orange-600 transition-colors">
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>
    </div>
  );

  // Use real user orders or keep MOCK for now
  const MOCK_ORDERS = [
    {
      id: "001",
      productName: 'MacBook Pro 16" M2',
      icon: Laptop,
      orderId: "0DH-2024-001",
      orderDate: "March 15, 2024",
      deliveryDate: "March 18, 2024",
      status: "Delivered",
      price: 2499,
    },
    {
      id: "002",
      productName: "AirPods Pro (2nd Gen)",
      icon: Headphones,
      orderId: "0DH-2024-002",
      orderDate: "March 20, 2024",
      deliveryExpected: "March 25, 2024",
      status: "Processing",
      price: 249.0,
    },
  ];

  const MainContent = () => (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>
      <p className="text-gray-500 mb-6">Track and manage your orders</p>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard
          title="Total Orders"
          value={MOCK_ORDERS.length}
          icon={ShoppingCart}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Pending"
          value={MOCK_ORDERS.filter((o) => o.status === "Processing").length}
          icon={Clock}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
        />
        <StatCard
          title="Delivered"
          value={MOCK_ORDERS.filter((o) => o.status === "Delivered").length}
          icon={CheckSquare}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Spent"
          value={MOCK_ORDERS.reduce((acc, o) => acc + o.price, 0)}
          icon={Wallet}
          color="text-orange-600"
          bgColor="bg-orange-50"
          isCurrency
        />
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination />
    </main>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <MainHeader />
        <MainContent />
      </div>

      {isSidebarOpen && (
        <button
          className="fixed top-4 right-4 z-50 p-2 text-white bg-gray-800 rounded-full lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Account;
