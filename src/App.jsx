import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Shop from "./pages/Shop";
import About from "./pages/About";
import ProductDetails from "./pages/ProductDetails";
import Support from "./pages/Support";
import Profile from "./pages/user/Profile";
import Order from "./pages/Order";
import Setting from "./pages/Settings";
import CategoryProducts from "./pages/CategoryProducts";

const App = () => {
  return (
    <div className="max-w-[1580px] min-h-screen mx-auto flex flex-col justify-between">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order" element={<Order />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/category/:categoryName" element={<CategoryProducts />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
