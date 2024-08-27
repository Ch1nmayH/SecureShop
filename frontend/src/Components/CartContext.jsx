import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const incrementCartCount = () => setCartCount(cartCount);

  return (
    <CartContext.Provider value={{ cartCount, incrementCartCount }}>
      {children}
    </CartContext.Provider>
  );
};