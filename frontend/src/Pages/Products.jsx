import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import LoadingSpinner from "../Components/LoadingSpinner";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ethRate, setEthRate] = useState(0); // State to store ETH rate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.in/api/products");
        const { products } = response.data;

        if (Array.isArray(products)) {
          setProducts(products);
        } else {
          console.error("API response products is not an array");
        }
      } catch (error) {
        console.error("There was an error fetching the products!", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    const fetchEthRate = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
        );
        const ethInInr = response.data.ethereum.inr;
        setEthRate(ethInInr); // Store ETH rate
      } catch (error) {
        console.error("There was an error fetching the ETH rate!", error);
      }
    };

    fetchProducts();
    fetchEthRate();
  }, []);

  const convertToEth = (priceInInr) => {
    return (priceInInr / ethRate).toFixed(4); // Convert to ETH and format to 4 decimals
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!products.length) {
    return <p className="text-center text-lg mt-5">No products available.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Products</h1>
      <div className="flex flex-wrap justify-center">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              ethPrice: convertToEth(product.price), // Add converted ETH price
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
