import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecurePayments from '../Components/SecurePayments'; // Import your SecurePayments component
import FeaturedProduct from '../Components/FeaturedProduct'; // Import your FeaturedProduct component
import BannerImage from "../Assets/banner.jpg";
import { motion } from "framer-motion";

const HomePage = () => {
  const [products, setProducts] = useState([]); // Initialize products as an empty array
  const [ethPrice, setEthPrice] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const API_URL = process.env.REACT_APP_API_BASE_URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/product/getproducts`);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError('Unexpected data structure');
        }
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state
  }

  return (
    <div className="bg-gray-100 min-h-screen">
    {/* Banner Section */}
    <div className="relative h-[400px] bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${BannerImage})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <motion.div
        className="relative flex justify-center items-center h-full text-white text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold">Welcome to SecureShop</h1>
      </motion.div>
    </div>
  
    {/* Title Section */}
    <div className="text-center mt-8">
      <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
    </div>
  
    {/* Products Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
      {products.slice(0, 3).map((product) => (
        <FeaturedProduct key={product.id} product={product} />
      ))}
    </div>
  
    <SecurePayments />
  </div>
  );
};

export default HomePage;
