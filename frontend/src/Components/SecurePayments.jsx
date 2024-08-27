import React from 'react';
import { motion } from 'framer-motion';

const SecurePayments = () => {
  const cards = [
    {
      id: 1,
      title: "MetaMask Wallet",
      description: "Easily manage your Ethereum and ERC-20 tokens with MetaMask. Your keys, your crypto. It ensures secure, private transactions with seamless integration.",
      icon: "🔐",
    },
    {
      id: 2,
      title: "Cryptocurrency",
      description: "Experience the future of finance with cryptocurrencies. Fast, secure, and decentralized transactions, perfect for global trade and investment.",
      icon: "💸",
    },
    {
      id: 3,
      title: "Secure Payments",
      description: "Make secure payments through blockchain technology and MetaMask. We guarantee transaction security with transparency and no intermediaries.",
      icon: "🛡️",
    },
  ];

  return (
    <div className="p-6">
      <motion.h2
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Secure Payments with MetaMask
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="bg-gray-50 shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105 hover:bg-gray-100 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-5xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-700">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SecurePayments;
