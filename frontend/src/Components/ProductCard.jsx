import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion } from "framer-motion";
import CartContext from "../utils/CartContext";

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleCartToggle = () => {
    if (isInCart) {
      removeFromCart(product._id); // Remove from cart if it's already in
    } else {
      addToCart(product._id, 1); // Add to cart if not in the cart
    }
  };

  // Check if product is already in the cart
  const isInCart = cartItems.some((item) => item.product._id === product._id);

  return (
    <motion.div
      className="max-w-xs rounded-lg overflow-hidden shadow-lg m-4 bg-white transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <motion.img
          className="w-full h-48 object-contain transition-opacity duration-300 ease-in-out p-2"
          src={"http://localhost:5000/" + product.image || 'default-image.jpg'}
          onClick={handleCardClick}
          alt={product.name}
          whileHover={{ opacity: 0.9 }}
        />
      </div>
      <div className="px-4 py-4 flex flex-col items-center justify-between h-full">
        <motion.div
          className="font-bold text-md mb-2 text-gray-900 text-center border-b-2 pb-1 border-gray-200 w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={handleCardClick}
        >
          {product.name.substring(0, 61)}
        </motion.div>
        <motion.p
          className="text-gray-600 text-sm text-center mb-3 border-b-2 pb-1 border-gray-200 w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleCardClick}
        >
          {product.description.substring(0, 60)}...
        </motion.p>
        <motion.div
          className="text-lg font-bold text-green-700 mb-4 border-b-2 pb-1 border-gray-200 w-full text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleCardClick}
        >
          {product.price} ETH
        </motion.div>
        <motion.button
          className={`${
            isInCart
              ? "bg-red-500 text-white" // Change color when product is in the cart
              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          } px-4 py-2 rounded-full flex items-center gap-2 transition-colors justify-center`}
          whileHover={{ scale: 1.1 }}
          onClick={handleCartToggle}
        >
          <ShoppingCartIcon fontSize="small" />
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
