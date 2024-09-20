import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const getCartItems = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userId = user.id;

  
    try {
      const cart = await Cart.findOne({ user: userId }).populate('items.product');
      
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      return res.status(200).json({ cart: cart.items });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching cart", error });
    }
  };
  


// Add to Cart
const addToCart = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
        }
    const  user  = jwt.verify(token, process.env.JWT_SECRET);
    const userId = user.id;
    const { productId, quantity } = req.body;
    try {
      let cart = await Cart.findOne({ user: userId });
  
      if (cart) {
        // If cart exists for user, check if product is already in the cart
        const productIndex = cart.items.findIndex(item => item.product == productId);
        
        if (productIndex > -1) {
          // If product exists in the cart, update its quantity
          let productItem = cart.items[productIndex];
          productItem.quantity += quantity;
          cart.items[productIndex] = productItem;
        } else {
          // If product doesn't exist, add to cart
          cart.items.push({ product: productId, quantity });
        }
  
        cart = await cart.save();
        return res.status(200).json(cart);
      } else {
        // If no cart exists, create a new cart
        const newCart = await Cart.create({
          user: userId,
          items: [{ product: productId, quantity }]
        });
        return res.status(201).json(newCart);
      }
    } catch (error) {
      return res.status(500).json({ message: "Error adding to cart", error });
    }
  };


  const removeFromCart = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userId = user.id;
    const { productId } = req.body;
  
    try {
      let cart = await Cart.findOne({ user: userId });
  
      if (cart) {
        const productIndex = cart.items.findIndex(item => item.product == productId);
  
        if (productIndex > -1) {
          const productItem = cart.items[productIndex];
          cart.items.splice(productIndex, 1);
          cart = await cart.save();
          return res.status(200).json(cart);
        } else {
          return res.status(404).json({ message: "Product not found in cart" });
        }
      } else {
        return res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error removing from cart", error });
    }
  }

  const getProductQuantity = async (req,res)=> {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userId = user.id;
  
    const { productId } = req.body;
  
    try {
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      const productItem = cart.items.find((item) => item.product == productId);
  
      if (productItem) {
        return res.status(200).json({ quantity: productItem.quantity });
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching product quantity", error });
    }
  };

  const updateQuantity = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userId = user.id;
  
    const { productId, quantity } = req.body;
  
    try {
      let cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      const productIndex = cart.items.findIndex((item) => item.product == productId);
  
      if (productIndex > -1) {
        cart.items[productIndex].quantity = quantity;
        cart = await cart.save();
        return res.status(200).json(cart);
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error updating quantity", error });
    }
  }

const clearCart = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userId = user.id;
  
    try {
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      cart.items = [];
      await cart.save();
  
      return res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
      return res.status(500).json({ message: "Error clearing cart", error });
    }
  }

export default { getCartItems, addToCart, removeFromCart, getProductQuantity,updateQuantity, clearCart };