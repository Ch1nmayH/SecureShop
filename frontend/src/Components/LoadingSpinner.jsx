import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0 }}
        animate={{ scale: [0.8, 1.2, 1] }}
        transition={{ duration: 0.6, ease: "easeInOut", loop: Infinity, repeatDelay: 0.5 }}
      >
        {/* Spinner with animation */}
        <CircularProgress size={80} className="text-blue-600" />

        {/* Animated Loading Message */}
        <motion.p
          className="mt-4 text-lg text-gray-700 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, loop: Infinity }}
        >
          Loading, please wait...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
