import React, { useState } from "react";
import { motion } from "framer-motion";

const CartItem = ({ product, ethPrice, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(product.id, newQuantity);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(product.id, newQuantity);
    }
  };

  // Shorten the title if it's too long
  const shortTitle = product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title;

  return (
    <motion.div
      className="flex justify-between items-center border-b pb-4 mb-4 max-w-xs"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={product.image}
        alt={shortTitle}
        className="w-16 h-16 object-cover rounded-md"
      />
      <div className="flex-1 ml-4">
        <div className="font-bold text-lg text-gray-800">{shortTitle}</div>
        <div className="text-lg font-semibold text-green-500 mt-2">
          {((product.price * quantity) / ethPrice).toFixed(10)} ETH
        </div>
      </div>
      <div className="flex items-center">
        <button
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded-l-md"
          onClick={decreaseQuantity}
        >
          -
        </button>
        <span className="px-4 py-1">{quantity}</span>
        <button
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded-r-md"
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;
