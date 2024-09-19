import React from "react";
const apiUrl = process.env.REACT_APP_API_BASE_URL;


const ManageProductCard = ({ product, onEdit, onDelete, onManageStock }) => {
  return (
    <div className="bg-white shadow-md rounded p-4">
      {console.log(apiUrl)}
     
      <img
        src={"http://localhost:5000/" + product.image}
        alt={product.name}
        className="h-[400px] w-full object-contain rounded"
      />
      <h3 className="text-xl font-bold my-2">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-gray-900 font-bold">{product.price} ETH</p>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onEdit(product)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={() => onManageStock(product)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Manage Stock
        </button>
      </div>
    </div>
  );
};

export default ManageProductCard;
