import React from 'react';

const FeaturedProduct = ({ product, ethPrice }) => {
  const priceInEth = (product.price / ethPrice).toFixed(3);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 hover:bg-gray-100">
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-md" />
      <h3 className="text-xl font-semibold mt-4">{product.title}</h3>
      <p className="text-gray-700 mt-2">{product.description}</p>
      <p className="text-blue-600 mt-4 text-lg font-bold">{priceInEth} ETH</p>
    </div>
  );
};


export default FeaturedProduct;
