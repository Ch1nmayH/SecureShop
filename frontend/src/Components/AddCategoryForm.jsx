// AddCategoryForm.js
import React from "react";

const AddCategoryForm = ({ newCategoryData, handleAddInputChange, handleSubmitAdd, setIsAdding }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Category</h2>
      <form onSubmit={handleSubmitAdd}>
        <input
          type="text"
          name="name"
          value={newCategoryData.name}
          onChange={handleAddInputChange}
          placeholder="Name"
          className="block mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="description"
          value={newCategoryData.description}
          onChange={handleAddInputChange}
          placeholder="Description"
          className="block mb-2 p-2 border rounded"
          required
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

export default AddCategoryForm;
