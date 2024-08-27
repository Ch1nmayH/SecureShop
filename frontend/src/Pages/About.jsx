import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="container mx-auto p-4 md:mt-[100px]">
      <motion.div
        className="bg-gray-50 shadow-lg rounded-lg p-6 mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.p
          className="text-gray-700 text-lg mb-4"></motion.p>        
        <motion.h1
          className="text-4xl font-bold text-center mb-6 text-[#1E6DDE]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          About SecureShop
        </motion.h1>
        <motion.p
          className="text-gray-700 text-lg mb-4 leading-relaxed"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          At <span className="font-semibold text-[#1E6DDE]">SecureShop</span>, we are dedicated to revolutionizing the online shopping experience by prioritizing security and convenience. Our platform leverages cutting-edge encryption and blockchain technology to safeguard every transaction, giving you peace of mind with each purchase.
        </motion.p>
        <motion.p
          className="text-gray-700 text-lg mb-4 leading-relaxed"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Whether you're new to cryptocurrency or a seasoned user, we offer educational resources to help you navigate the world of digital finance. With <span className="font-semibold text-[#1E6DDE]">SecureShop</span>, you're not just making a purchase; you're part of a community that values innovation, transparency, and trust.
        </motion.p>
        <motion.p
          className="text-gray-700 text-lg mb-4 leading-relaxed"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Thank you for choosing <span className="font-semibold text-[#1E6DDE]">SecureShop</span> as your go-to online shopping destination. We’re here to ensure that your experience is not only secure but also enjoyable and empowering.
        </motion.p>
        <motion.p
          className="text-gray-700 text-lg mb-4 leading-relaxed"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          Join us in embracing the future of e-commerce, where security meets innovation, and every transaction is backed by the power of blockchain.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default About;

