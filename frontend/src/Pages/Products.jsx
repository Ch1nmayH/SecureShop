// src/Pages/Products.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import LoadingSpinner from "../Components/LoadingSpinner";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://fakestoreapi.in/api/products")
      .then((response) => {
        // Extract the products array from the response data
        const { products } = response.data;
        console.log("API Response Products:", products); // Check the extracted data

        if (Array.isArray(products)) {
          setProducts(products);
        } else {
          console.error("API response products is not an array");
          
        }
        setTimeout(() => setLoading(false), 500);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        setTimeout(() => setLoading(false), 500);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!products.length) {
    return <p className="text-center text-lg mt-5">No products available.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center"></h1>
      <div className="flex flex-wrap justify-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
