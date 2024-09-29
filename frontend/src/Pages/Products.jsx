import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import LoadingSpinner from "../Components/LoadingSpinner";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/product/getcategories");
        setCategories(response.data);
      } catch (error) {
        console.error("There was an error fetching the categories!", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCategoryId(selectedId);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = selectedCategoryId === "all" || product.category === selectedCategoryId;

      const searchLower = searchQuery.toLowerCase();
      const productNameMatch = product.name.toLowerCase().includes(searchLower);
      const category = categories.find(cat => cat._id === product.category);
      const categoryNameMatch = category ? category.name.toLowerCase().includes(searchLower) : false;

      return categoryMatch && (productNameMatch || categoryNameMatch);
    });
  }, [products, selectedCategoryId, searchQuery, categories]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!products.length) {
    return <p className="text-center text-lg mt-5">No products available.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:mt-[40px]">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Products</h1>

      {/* Search Bar and Category Filter */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Accessible Label */}
        <label htmlFor="product-search" className="sr-only">Search Products</label>
        <input
          id="product-search"
          type="text"
          placeholder="Search by product name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border w-full max-w-[400px] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Category Dropdown */}
        <select
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="flex flex-wrap justify-center">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
