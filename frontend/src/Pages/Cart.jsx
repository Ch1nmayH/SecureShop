import React, { useState, useEffect } from "react";
import axios from "axios";
import CartItem from "../Components/CartItem";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("Karnatak University, 580003");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(address);
  const [ethPrice, setEthPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products?limit=4');
        const products = response.data;

        if (Array.isArray(products)) {
          setCartProducts(products);
          updateTotalPrice(products);
        } else {
          console.error('Unexpected data structure:', response.data);
          setError('Unexpected data structure');
        }
      } catch (error) {
        console.error("Failed to fetch cart products:", error);
        setError('Failed to fetch cart products');
      }
    };

    const fetchEthPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const ethInInr = response.data.ethereum.inr;
        setEthPrice(ethInInr);
      } catch (error) {
        console.error("Failed to fetch ETH price:", error);
      }
    };

    fetchCartProducts();
    fetchEthPrice();
  }, []);

  const updateTotalPrice = (products) => {
    const total = products.reduce((acc, product) => acc + product.price * (product.quantity || 1), 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCartProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        if (product.id === id) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      });
      updateTotalPrice(updatedProducts);
      return updatedProducts;
    });
  };

  const handleContinue = () => {
    navigate('/checkout');
  };

  const handleAddressChange = () => {
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    try {
      await axios.post('https://example.com/api/update-address', { address: newAddress });
      setAddress(newAddress);
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
        <div className="text-center p-6">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!cartProducts.length) {
    return (
      <div className="p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
        <div className="text-center p-6">
          <p>Your cart is empty!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 flex justify-center md:mt-[100px]">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row justify-between lg:space-x-8">
        <div className="lg:w-2/3">

          {/* Delivery Address Section */}
          <div className="bg-white p-4 rounded-md shadow-md mb-4">
            <div className="flex justify-between items-center">
              <div className="flex-grow">
                {isEditingAddress ? (
                  <>
                    <input
                      type="text"
                      className="border p-2 w-3/4 rounded"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                    />
                    <button
                      className="bg-blue-600 text-white mt-2 px-4 py-2 rounded"
                      onClick={handleSaveAddress}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-lg">Deliver to: Karnatak University, 580003</span>
                    <span className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm">Other</span>
                    <p className="text-gray-600 inline-block">{address}</p>
                    <button
                      className="text-blue-600 font-bold ml-4"
                      onClick={handleAddressChange}
                    >
                      Change
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white p-4 rounded-md shadow-md mb-4 max-w-screen flex flex-col items-center">
            {cartProducts.map((product) => (
              <CartItem
                key={product.id}
                product={product}
                ethPrice={ethPrice}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        </div>

        {/* Price Details */}
        <div className="bg-white p-4 rounded-md shadow-md max-w-screen lg:w-[360px] h-[200px]">
          <h2 className="text-xl font-bold mb-4">PRICE DETAILS</h2>
          <div className="flex justify-between mb-2">
            <span>Price ({cartProducts.length} items)</span>
            <span>{(totalPrice / ethPrice).toFixed(10)} ETH</span> {/* Price in ETH */}
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-xl">
            <span>Total Amount</span>
            <span>{(totalPrice / ethPrice).toFixed(10)} ETH</span> {/* Total price in ETH */}
          </div>
          <button
            className="bg-[#233745] text-white w-full mt-4 py-3 rounded-lg font-bold hover:bg-[#3d617a]"
            onClick={handleContinue}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
