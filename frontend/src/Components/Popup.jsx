import React from "react";
import { motion } from "framer-motion";

const Popup = ({ message, onClose }) => {
  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
    >
      {message}
    </motion.div>
  );
};

export default Popup;
