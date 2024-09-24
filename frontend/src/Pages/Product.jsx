import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartContext from "../utils/CartContext"; // Import CartContext
import UserContext from "../utils/CreateContext";

const Product = () => {
  const { productId } = useParams();
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext); // Use CartContext to get cart functions
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/product/getproduct/${productId}`
        );
        setProduct(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Check if the product is already in the cart
  const isInCart = cartItems.some((item) => item.product._id === productId);

  const handleCartToggle = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (isInCart) {
      removeFromCart(productId); // If in the cart, remove it
    } else {
      addToCart(productId, 1); // If not in the cart, add it
    }
  };

  const convertToEth = (priceInInr) => priceInInr.toFixed(10);

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
            src={`http://localhost:5000/${product.image}`}
            alt={product.title}
            className="w-full h-72 object-contain rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: "400px", height: "300px" }}
          />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-7/12 flex flex-col items-center lg:items-start gap-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center lg:text-left">
            {product.title}
          </h1>
          <p className="text-gray-600 text-lg text-center lg:text-left">
            {product.description}
          </p>
          <div className="text-2xl font-semibold text-green-500">
            {convertToEth(product.price)} ETH
          </div>

          {/* Add/Remove from Cart Button */}
          <motion.button
            className={`mt-6 w-full lg:w-auto ${
              isInCart
                ? "bg-red-500"
                : "bg-gradient-to-r from-cyan-500 to-blue-500"
            } text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-transform transform hover:scale-105`}
            whileHover={{ scale: 1.05 }}
            onClick={handleCartToggle}
          >
            <ShoppingCartIcon fontSize="small" />
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Product;
