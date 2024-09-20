import express from "express";
import CartController from "../controllers/cartController.js";

const app = express.Router();

//get all cart items
app.get("/getCartItems", CartController.getCartItems);

//add to cart
app.post("/addToCart", CartController.addToCart);

//remove from cart
app.post("/removeFromCart", CartController.removeFromCart);

//update cart
// app.post("/updateCart", CartController.updateCart);

//get Cart Quantity
app.get("/getProductQuantity", CartController.getProductQuantity);

//Update Cart Quantity
app.post("/updateQuantity", CartController.updateQuantity);

//clear cart
app.post("/clearCart", CartController.clearCart);




export default app;