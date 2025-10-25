import React from "react";
import Hero from "../components/hero/Hero";
import BestSaleProducts from "../components/product/BestSaleProducts";
import FlashSale from "../components/flashsale/FlashSale";
import CategorySlider from "../components/category/CategorySlider";
import Seo from "../components/Seo";
import ConfidenceSection from "../components/confidenceSection/ConfidenceSection";

const Home = () => {
  return (
    <>
      <Seo
        title="DigitalHat | Modern Tech Gadgets in Bangladesh"
        description="Discover the latest smart gadgets, accessories, and tech products at DigitalHat. Countrywide delivery and authentic products."
        canonical="https://digitalhat.vercel.app/"
      />
      <div className="">
        <Hero />
        <CategorySlider />
        <FlashSale />
        <BestSaleProducts />
        <ConfidenceSection />
      </div>
    </>
  );
};

export default Home;
