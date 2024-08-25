// src/Components/ProductCard.jsx

import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg m-4 bg-white">
      <img className="w-full h-48 object-cover" src={product.image} alt={product.title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{product.title}</div>
        <p className="text-gray-700 text-base">
          ${product.price}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          {product.description.substring(0, 100)}...
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">View Details</button>
      </div>
    </div>
  );
};

export default ProductCard;
