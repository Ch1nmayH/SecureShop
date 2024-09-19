import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CartContext from "../utils/CartContext";
import axios from "axios";

const CartItem = ({ product, onQuantityChange,oldQuantity }) => {
  const [quantity, setQuantity] = useState(oldQuantity); // Default to 1
  const [loading, setLoading] = useState(false); // To prevent multiple updates
  const { updateCartItemQuantity } = React.useContext(CartContext);

  useEffect(() => {
    // Fetch product quantity when the component mounts
    const fetchProductQuantity = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cart/getProductQuantity", { productId: product._id }, { withCredentials: true });
        if (response.status === 200) {
          setQuantity(response.data.quantity); // Update with fetched quantity
        } else {
          console.error("Product not found in cart.");
        }
      } catch (error) {
        console.error("Error fetching quantity:", error);
      }
    };

    fetchProductQuantity();
  }, [product._id]);

  // Function to increase quantity
  const increaseQuantity = async () => {
    if (loading) return; // Prevent multiple requests
    setLoading(true);
    const newQuantity = quantity + 1;

    try {
      setQuantity(newQuantity); // Update quantity on the frontend immediately
      await updateCartItemQuantity(product._id, newQuantity); // Update backend
      onQuantityChange(product._id, newQuantity); // Notify parent component of change
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to decrease quantity
  const decreaseQuantity = async () => {
    if (loading) return; // Prevent requests if quantity is <=1
    if( quantity == 1) {
      
    }
    setLoading(true);
    const newQuantity = quantity - 1;

    try {
      setQuantity(newQuantity); // Update frontend immediately
      await updateCartItemQuantity(product._id, newQuantity); // Update backend
      onQuantityChange(product._id, newQuantity); // Notify parent component
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const shortTitle = product.name.length > 20 ? product.name.substring(0, 20) + "..." : product.name;

  return (
    <motion.div
      className="flex justify-between items-center border-b pb-4 mb-4 max-w-xs"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img src={`http://localhost:5000/${product.image}`} alt={shortTitle} className="w-16 h-16 object-cover rounded-md" />
      <div className="flex-1 ml-4">
        <div className="font-bold text-lg text-gray-800">{shortTitle}</div>
        <div className="text-lg font-semibold text-green-500 mt-2">
          {(product.price * quantity).toFixed(10)} ETH
        </div>
      </div>
      <div className="flex items-center">
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
    </motion.div>
  );
};

export default CartItem;
