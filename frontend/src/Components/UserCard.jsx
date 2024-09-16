import React from "react";
import { motion } from "framer-motion";

const UserCard = ({user, handleEdit, handleDelete}) => {
  return (
    <motion.div
      className="bg-white border border-gray-300 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h2 className="text-xl font-bold mb-2">{user.firstName} {user.lastName}</h2>
      <p className="mb-2">Email: {user.email}</p>
      <p className="mb-2">Password: ******</p>
      <p className="mb-4">Mobile: {user.mobile}</p>
      <div className="flex justify-between gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() => handleEdit(user)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          onClick={() => handleDelete(user._id)}
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default UserCard;
