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
        const { data } = await axios.get(
          "  https://digitalhat-server.onrender.com/api/products"
        );
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
    <div className="px-5 md:px-10 lg:px-20 py-10">
      <Title title="Best Salling Products" />
      <ProductGrid products={products} isLoading={loading} />
      <div className="text-center mt-10">
        <Link
          to={"/shop"}
          className="bg-white text-primary border border-primary font-semibold cursor-pointer py-3 px-8 rounded-full shadow-md hover:bg-primary/20  transition duration-300"
        >
          View More Products
        </Link>
      </div>
    </div>
  );
};

export default BestSaleProducts;
