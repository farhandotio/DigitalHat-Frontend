import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Shop from "./pages/Shop";
import About from "./pages/About";
import ProductDetails from "./pages/ProductDetails";
import Support from "./pages/Support";
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
import Admin from "./pages/admin/Admin";

const App = () => {
  return (
    <div className="max-w-[1580px] bg-gray-50 min-h-screen mx-auto flex flex-col justify-between outline-1 outline-border">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={<Admin />} />

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
        <Route path="/support" element={<Support />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/category/:categoryName" element={<CategoryProducts />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
