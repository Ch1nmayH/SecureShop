import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FeaturedProduct = ({ product }) => {
  const navigate = useNavigate(); // Initialize navigate

  const priceInEth = (product.price).toFixed(10);

  const handleClick = () => {
    navigate(`/product/${product._id}`); // Navigate to the product's detail page
  };

  return (
    <motion.div
      className="bg-gray-50 shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 hover:bg-gray-100 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={handleClick} // Set onClick handler to navigate
    >
      <div className="flex flex-col items-center">
        <motion.img
          src={`http://localhost:5000/${product.image}`}
          alt={product.name}
          className="w-full h-48 object-contain rounded-md mb-4"
          whileHover={{ scale: 1.1 }}
        />
        <h3 className="text-xl font-semibold text-center">{product.name}</h3>
        <p className="text-gray-700 text-center">{product.description}</p>
        <p className="text-blue-600 mt-4 text-lg font-bold text-center">{priceInEth} ETH</p>
      </div>
    </motion.div>
  );
};

export default FeaturedProduct;
