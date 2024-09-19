// CategoryCard.js
import React from "react";

const CategoryCard = ({ category, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md mb-4 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold">{category.name}</h3>
        <p className="text-gray-600">{category.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(category)} // <-- Ensure onEdit is used
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(category._id)} // Assuming you have a handleDelete function
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
