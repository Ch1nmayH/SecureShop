import React from 'react';
import { motion } from 'framer-motion';

const FeaturedProduct = ({ product, ethPrice }) => {
  const priceInEth = (product.price / ethPrice).toFixed(10);

  return (
    <motion.div
      className="bg-gray-50 shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 hover:bg-gray-100"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex flex-col items-center cursor-pointer">
        <motion.img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-contain rounded-md mb-4"
          whileHover={{ scale: 1.1 }}
        />
        <h3 className="text-xl font-semibold text-center">{product.title}</h3>
        <p className="text-gray-700 text-center">{product.description}</p>
        <p className="text-blue-600 mt-4 text-lg font-bold text-center">{priceInEth} ETH</p>
      </div>
    </motion.div>
  );
};

export default FeaturedProduct;
