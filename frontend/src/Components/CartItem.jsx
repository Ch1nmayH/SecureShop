import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CartContext from "../utils/CartContext";
import axios from "axios";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CartItem = ({ product, onQuantityChange, oldQuantity, removeFromCart }) => {
  const [quantity, setQuantity] = useState(oldQuantity); 
  const [loading, setLoading] = useState(false); 
  const { updateCartItemQuantity } = React.useContext(CartContext);
  const API_URL = process.env.REACT_APP_API_BASE_URL

  useEffect(() => {
    const fetchProductQuantity = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/cart/getProductQuantity`, { productId: product._id }, { withCredentials: true });
        if (response.status === 200) {
          setQuantity(response.data.quantity);
        } else {
          console.error("Product not found in cart.");
        }
      } catch (error) {
        console.error("Error fetching quantity:", error);
      }
    };

    fetchProductQuantity();
  }, [product._id]);

  const increaseQuantity = async () => {
    if (loading) return;
    setLoading(true);
    const newQuantity = quantity + 1;

    try {
      setQuantity(newQuantity); 
      await updateCartItemQuantity(product._id, newQuantity);
      onQuantityChange(product._id, newQuantity); 
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false); 
    }
  };

  const decreaseQuantity = async () => {
    if (loading) return;
    if (quantity === 1) {
      return;
    }
    setLoading(true);
    const newQuantity = quantity - 1;

    try {
      setQuantity(newQuantity);
      await updateCartItemQuantity(product._id, newQuantity);
      onQuantityChange(product._id, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = () => {
    removeFromCart(product._id);
  };

  const shortTitle = product.name.length > 20 ? product.name.substring(0, 20) + "..." : product.name;

  return (
    <motion.div
      className="flex justify-between items-center border-b pb-4 mb-4 max-w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={`${API_URL}/${product.image}`}
        alt={shortTitle}
        className="w-16 h-16 object-cover rounded-md"
      />
      <div className="flex-1 ml-4">
        <div className="font-bold text-lg text-gray-800">{product.name}</div>
        <div className="text-lg font-semibold text-green-500 mt-2">
          {(product.price * quantity).toFixed(10)} ETH
        </div>
      </div>

      <div className="flex items-center space-x-4"> 
        <button
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded-l-md"
          onClick={decreaseQuantity}
          disabled={loading || quantity <= 1}
        >
          -
        </button>
        <span className="px-4 py-1">{quantity}</span>
        <button
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded-r-md"
          onClick={increaseQuantity}
          disabled={loading}
        >
          +
        </button>
      </div>

      <IconButton aria-label="delete" color="error" onClick={handleDeleteItem}>
        <DeleteIcon />
      </IconButton>
    </motion.div>
  );
};

export default CartItem;
