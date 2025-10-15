import React from "react";
import Hero from "../components/hero/Hero";
import BestSaleProducts from "../components/product/BestSaleProducts";
import FlashSale from "../components/flashsale/FlashSale";

const Home = () => {
  return (
    <div className="">
      <Hero />
      <FlashSale />
      <BestSaleProducts />
    </div>
  );
};

export default Home;
