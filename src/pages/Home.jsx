import React from "react";
import Hero from "../components/hero/Hero";
import BestSaleProducts from "../components/product/BestSaleProducts";
import FlashSale from "../components/flashsale/FlashSale";
import CategorySlider from "../components/category/CategorySlider";

const Home = () => {
  return (
    <div className="">
      <Hero />
      <CategorySlider />
      <FlashSale />
      <BestSaleProducts />
    </div>
  );
};

export default Home;
