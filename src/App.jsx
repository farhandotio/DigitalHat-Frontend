// src/App.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GlobalProvider } from "./context/GlobalContext.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import DigitalHatLoading from "./components/loading/DigitalHatLoading.jsx";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const About = lazy(() => import("./pages/About"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Setting = lazy(() => import("./pages/Settings"));
const CategoryProducts = lazy(() => import("./pages/CategoryProducts"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

const AccountLayout = lazy(() => import("./pages/account/AccountLayout"));
const AccountDashboard = lazy(() => import("./pages/account/Dashboard"));
const AccountOrders = lazy(() => import("./pages/account/Orders"));
const AccountAddresses = lazy(() => import("./pages/account/Addresses"));
const AccountSettings = lazy(() => import("./pages/account/Settings"));

// Admin pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/orders/OrdersList"));
const AdminOrderDetail = lazy(() => import("./pages/admin/orders/OrderDetail"));
const AdminUsers = lazy(() => import("./pages/admin/users/UsersList"));
const AdminUserProfile = lazy(() => import("./pages/admin/users/UserProfile"));
const AdminProducts = lazy(() => import("./pages/admin/products/ProductsList"));
const AdminProductCreate = lazy(() =>
  import("./pages/admin/products/CreateProduct")
);
const AdminProductEdit = lazy(() =>
  import("./pages/admin/products/EditProduct")
);
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const App = () => {
  return (
    <HelmetProvider>
      <GlobalProvider>
        <BrowserRouter>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            preventDuplicates
          />
          <div className="max-w-[1580px] bg-white min-h-screen mx-auto flex flex-col justify-between outline-1 outline-border">
            <Header />
            <Suspense fallback={<DigitalHatLoading isLoading={true} />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
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
            </Suspense>
            <Footer />
          </div>
        </BrowserRouter>
      </GlobalProvider>
    </HelmetProvider>
  );
};

export default App;
