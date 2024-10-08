import React, { useState } from "react";

const RetailerEditForm = ({
  data,
  categories,
  activeTab,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    description: data?.description || "",
    price: data?.price || "",
    category:
      data?.category || (categories.length > 0 ? categories[0]._id : ""),
    stock: data?.stock || "",
    selectedImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, selectedImage: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!data) {
    return <p>Loading...</p>; // Show a loading message or a spinner until data is ready
  }

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Edit {activeTab === "products" ? "Product" : "Category"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Common fields for both Product and Category */}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="block mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="block mb-2 p-2 border rounded"
          required
        />

        {/* Conditional form fields for Product */}
        {activeTab === "products" && (
          <>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="block mb-2 p-2 border rounded"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
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
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Stock"
              className="block mb-2 p-2 border rounded"
              required
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="block mb-2"
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default RetailerEditForm;
