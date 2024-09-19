import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import LoadingSpinner from "../Components/LoadingSpinner";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/product/getproducts");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("API response products is not an array");
        }
      } catch (error) {
        console.error("There was an error fetching the products!", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/product/getcategories");
        // Assuming each category has both id and name
        setCategories(response.data); // Store full category objects (with id and name)
      } catch (error) {
        console.error("There was an error fetching the categories!", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    if (selectedCategoryName === "all") {
      setSelectedCategoryId("all");
    } else {
      const selectedCategory = categories.find(category => category.name === selectedCategoryName);
      if (selectedCategory) {
        setSelectedCategoryId(selectedCategory._id); // Use the category's ID to filter products
      }
    }
  };

  const filteredProducts = selectedCategoryId === "all"
    ? products
    : products.filter(product => product.category === selectedCategoryId);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!products.length) {
    return <p className="text-center text-lg mt-5">No products available.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:mt-[40px]">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Products</h1>
      <div className="mb-6 flex justify-center">
        <select
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap justify-center">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product} // Pass product directly without conversion
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
