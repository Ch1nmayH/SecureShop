import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import LoadingSpinner from "../Components/LoadingSpinner";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
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

    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.in/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("There was an error fetching the categories!", error);
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
    fetchCategories();
    fetchEthRate();
  }, []);

  const convertToEth = (priceInInr) => {
    return (priceInInr / ethRate).toFixed(10); // Convert to ETH and format to 4 decimals
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!products.length) {
    return <p className="text-center text-lg mt-5">No products available.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:mt-[40px]">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Products</h1>
      <div className="mb-6 flex justify-center">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap justify-center">
        {filteredProducts.map((product) => (
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
