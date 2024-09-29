import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import UserContext from "./CreateContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Store cart items
  const [cartCount, setCartCount] = useState(0); // Cart count
  const { token, setToken } = useContext(UserContext);

  // Fetch cart items from the API
  const fetchCartItems = async () => {
    if (token) {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/cart/getCartItems",
          {
            withCredentials: true,
          }
        );

        const cartItemsData = response.data.cart;
        setCartItems(cartItemsData); // Store cart items
        setCartCount(cartItemsData.length);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  };

  // Add product to the cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/addtocart",
        { productId, quantity },
        { withCredentials: true }
      );

      if (response.status === 200) {
        await fetchCartItems(); // Re-fetch cart items after adding product
      }
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  // Remove product from the cart
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/removeFromCart",
        { productId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        await fetchCartItems(); // Re-fetch cart items after removing product
      }
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/clearCart",
        {},
        { withCredentials: true }
      );
      setCartItems([]); // Clear cart items from context
      setCartCount(0); // Reset cart count
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // Update product quantity in the cart
  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/updateQuantity",
        { productId, quantity },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  // Fetch the current quantity of a product in the cart
  const fetchProductQuantity = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/getProductQuantity",
        { productId },
        { withCredentials: true }
      );
      return response.data.quantity;
    } catch (error) {
      console.error("Failed to fetch product quantity:", error);
      return 1; // Default to 1 if error occurs
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        fetchProductQuantity,
        fetchCartItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
