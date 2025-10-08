import React, { useState, useEffect } from "react";
import ProductGrid from "../components/product/ProductGrid";
import { products as productsData } from "../../public/assets/assets";

const Shop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productsData);
  }, []);

  return (
    <div className="px-5 md:px-10 lg:px-20 py-5">
      <ProductGrid products={products} />
    </div>
  );
};

export default Shop;
