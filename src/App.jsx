// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GlobalProvider } from "./context/GlobalContext.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import Home from "./pages/Home";
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
import PrivacyPolicy from "./pages/PrivacyPolicy";

import {
  AccountLayout,
  Dashboard as AccountDashboard,
  Orders as AccountOrders,
  Addresses as AccountAddresses,
  Settings as AccountSettings,
} from "./pages/account";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/orders/OrdersList";
import AdminOrderDetail from "./pages/admin/orders/OrderDetail";
import AdminUsers from "./pages/admin/users/UsersList";
import AdminUserProfile from "./pages/admin/users/UserProfile";
import AdminProducts from "./pages/admin/products/ProductsList";
import AdminProductCreate from "./pages/admin/products/CreateProduct";
import AdminProductEdit from "./pages/admin/products/EditProduct";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
  return (
    <HelmetProvider>
      <GlobalProvider>
        <BrowserRouter>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            // theme="colored"
            preventDuplicates
          />
          <div className="max-w-[1580px] bg-white min-h-screen mx-auto flex flex-col justify-between outline-1 outline-border">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                {/* you can keep only one of index or dashboard if you prefer */}
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserProfile />} />
                <Route path="products" element={<AdminProducts />} />
                <Route
                  path="products/create"
                  element={<AdminProductCreate />}
                />
                <Route
                  path="products/:id/edit"
                  element={<AdminProductEdit />}
                />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Account routes */}
              <Route path="/account" element={<AccountLayout />}>
                <Route index element={<AccountDashboard />} />
                <Route path="orders" element={<AccountOrders />} />
                <Route path="addresses" element={<AccountAddresses />} />
                <Route path="settings" element={<AccountSettings />} />
              </Route>

              {/* Shop & other pages */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/settings" element={<Setting />} />
              <Route
                path="/category/:categoryName"
                element={<CategoryProducts />}
              />

              {/* fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </GlobalProvider>
    </HelmetProvider>
  );
};

export default App;
