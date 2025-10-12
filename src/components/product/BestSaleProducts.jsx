import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "./ProductGrid";
import Title from "../title/Title";
import { ArrowRight, ShoppingCart } from "lucide-react";
import LinkButton from "../button/LinkButton";
import { Link } from "react-router-dom";

const BestSaleProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSaleProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/products");
        const allProducts = data.products;

        const topProducts = allProducts
          .sort((a, b) => {
            if (b.sold === a.sold) {
              return b.reviews.length - a.reviews.length;
            }
            return b.sold - a.sold;
          })
          .slice(0, 10);

        setProducts(topProducts);
      } catch (error) {
        console.error("Error fetching best sale products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSaleProducts();
  }, []);

  return (
    <div className="px-5 md:px-10 lg:px-20 pt-20">
      <Title title="Best Selling Products" center />
      <ProductGrid products={products} isLoading={loading} />
      <div className="flex items-center justify-end pt-10">
        <Link to="/shop" className="flex items-center gap-1 text-secondary hover:text-primary">
          Shop Now <ArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default BestSaleProducts;
