// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Shop from "./pages/Shop";
import About from "./pages/About";
import ProductDetails from "./pages/ProductDetails";
import Setting from "./pages/Settings";
import CategoryProducts from "./pages/CategoryProducts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import {
  AccountLayout,
  Dashboard as AccountDashboard,
  Orders as AccountOrders,
  Addresses as AccountAddresses,
  Settings as AccountSettings,
} from "./pages/account";

// ---------- Admin page imports (adjust paths to your project) ----------
import AdminLayout from "./pages/admin/AdminLayout"; // layout that includes Sidebar + Outlet
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/orders/OrdersList";
import AdminOrderDetail from "./pages/admin/orders/OrderDetail";
import AdminUsers from "./pages/admin/users/UsersList";
import AdminUserProfile from "./pages/admin/users/UserProfile";
import AdminProducts from "./pages/admin/products/ProductsList";
import AdminProductCreate from "./pages/admin/products/CreateProduct";
import AdminProductEdit from "./pages/admin/products/EditProduct";
import AdminSettings from "./pages/admin/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
// -----------------------------------------------------------------------------------------------

const App = () => {
  return (
    <div className="max-w-[1580px] bg-white min-h-screen mx-auto flex flex-col justify-between outline-1 outline-border">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* -------------------------
           ADMIN NESTED ROUTES (guarding happens inside AdminLayout)
           Parent: /admin  (AdminLayout renders Sidebar + <Outlet />)
           ------------------------- */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* index -> /admin (dashboard) */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Orders */}
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />

          {/* Users */}
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserProfile />} />

          {/* Products */}
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<AdminProductCreate />} />
          <Route path="products/:id/edit" element={<AdminProductEdit />} />

          {/* Settings / Reports / Integrations under /admin/... */}
          <Route path="settings" element={<AdminSettings />} />
          {/* add reports & integrations similarly when implemented */}
        </Route>

        {/* ACCOUNT AREA - nested routes */}
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<AccountDashboard />} />
          <Route path="orders" element={<AccountOrders />} />
          <Route path="addresses" element={<AccountAddresses />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>

        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/privacy&policy" element={<PrivacyPolicy />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/category/:categoryName" element={<CategoryProducts />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
