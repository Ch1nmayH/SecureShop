// ProductPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ethPrice, setEthPrice] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEthPrice = async () => {
      try {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr");
        setEthPrice(response.data.ethereum.inr);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    };

    fetchProduct();
    fetchEthPrice();
  }, [productId]);

  const convertToEth = (priceInInr) => (priceInInr / ethPrice).toFixed(10);

  const handleAddToCart = async () => {
    alert("Button clicked!");
    try {
      await axios.post("/api/cart", { productId });
      console.log("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <motion.div
        className="flex flex-col lg:flex-row items-center lg:items-start gap-8 bg-white rounded-lg shadow-lg p-6 lg:p-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Product Image */}
        <div className="w-full lg:w-5/12 max-w-md">
          <motion.img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-7/12 flex flex-col items-center lg:items-start gap-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center lg:text-left">{product.title}</h1>
          <p className="text-gray-600 text-lg text-center lg:text-left">{product.description}</p>
          <div className="text-2xl font-semibold text-green-500">
            {convertToEth(product.price)} ETH
          </div>
          <motion.button
            className="mt-6 w-full lg:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            onClick={handleAddToCart}
          >
            <ShoppingCartIcon fontSize="small" />
            Add to Cart
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductPage;
