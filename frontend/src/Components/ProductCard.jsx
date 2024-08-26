import React from "react";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      className="max-w-xs rounded-lg overflow-hidden shadow-lg m-4 bg-white transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer"
      onClick={handleCardClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <motion.img
          className="w-full h-40 object-cover transition-opacity duration-300 ease-in-out"
          src={product.image}
          alt={product.title}
          whileHover={{ opacity: 0.9 }}
        />
      </div>
      <div className="px-4 py-4 flex flex-col items-center">
        <motion.div
          className="font-bold text-lg mb-1 text-gray-900 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {product.title}
        </motion.div>
        <motion.p
          className="text-gray-600 text-sm text-center mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {product.description.substring(0, 60)}...
        </motion.p>
        <motion.div
          className="text-lg font-bold text-green-700 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ₹{product.price}
        </motion.div>
        <motion.button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors hover:from-purple-600 hover:to-pink-600"
          whileHover={{ scale: 1.1 }}
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}
        >
          <ShoppingCartIcon fontSize="small" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;