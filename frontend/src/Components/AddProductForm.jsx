// AddProductForm.js
import React, { useState } from "react";

const AddProductForm = ({ categories, newProductData, setNewProductData, handleAddInputChange, handleImageChange, handleSubmitAdd, setIsAdding }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmitAdd}>
        <input
          type="text"
          name="name"
          value={newProductData.name}
          onChange={handleAddInputChange}
          placeholder="Name"
          className="block mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="description"
          value={newProductData.description}
          onChange={handleAddInputChange}
          placeholder="Description"
          className="block mb-2 p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={newProductData.price}
          onChange={handleAddInputChange}
          placeholder="Price"
          className="block mb-2 p-2 border rounded"
          required
        />
        <select
          name="category"
          value={newProductData.category}
          onChange={handleAddInputChange}
          className="block mb-2 p-2 border rounded"
          required
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={handleImageChange}
          className="block mb-2"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
