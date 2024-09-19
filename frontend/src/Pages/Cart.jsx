import React, { useContext, useEffect, useState } from "react";
import CartItem from "../Components/CartItem";
import { useNavigate } from "react-router-dom";
import CartContext from "../utils/CartContext";

const Cart = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useContext(CartContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems && cartItems.length) {
      updateTotalPrice(cartItems);
    }
  }, [cartItems]);

  const updateTotalPrice = (products) => {
    const total = products.reduce(
      (acc, product) => acc + product.product.price * (product.quantity || 1),
      0
    );
    setTotalPrice(total);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      // Remove item if the quantity is 0
      handleCartEmpty(productId);
    } else {
      // Update quantity
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const handleCartEmpty = (productId) => {
    removeFromCart(productId);
  };


  const handleContinue = () => {
    navigate("/checkout");
  };

  return (
    <div className="p-6 bg-gray-100 flex justify-center md:mt-[100px]">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row justify-between lg:space-x-8">
        <div className="lg:w-2/3">
          <div className="bg-white p-4 rounded-md shadow-md mb-4">
            {cartItems.map((cartItem) => (
              <CartItem
                key={cartItem.product._id}
                product={cartItem.product}
                oldQuantity={cartItem.quantity}
                onQuantityChange={handleQuantityChange} // Pass the quantity handler
                removeFromCart = {handleCartEmpty}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-md max-w-screen lg:w-[360px] h-[200px]">
          <h2 className="text-xl font-bold mb-4">PRICE DETAILS</h2>
          <div className="flex justify-between mb-2">
            <span>Price ({cartItems.length} items)</span>
            <span>{totalPrice.toFixed(10)} ETH</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-xl">
            <span>Total Amount</span>
            <span>{totalPrice.toFixed(10)} ETH</span>
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
