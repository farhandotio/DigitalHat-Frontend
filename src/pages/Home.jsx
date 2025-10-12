import React from "react";
import Hero from "../components/hero/Hero";
import CategorySlider from "../components/category/CategorySlider";
import BestSaleProducts from "../components/product/BestSaleProducts";
import Testimonials from "../components/testimonials/Testimonials";

const Home = () => {
  return (
    <div className="">
      <Hero />
      <CategorySlider />
      <BestSaleProducts />
      <Testimonials />
    </div>
  );
};

export default Home;
