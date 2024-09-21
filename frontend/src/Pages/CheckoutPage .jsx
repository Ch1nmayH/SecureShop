import React, { useState, useEffect, useContext } from "react";
import { Button } from "@mui/material";
import CartContext from "../utils/CartContext"; // Import your Cart Context
import Web3 from "web3"; // Use web3.js for handling Ethereum transactions

const CheckoutPage = () => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const { cartItems, totalPrice = 0 } = useContext(CartContext); // Default totalPrice to 0
    const [isLoading, setIsLoading] = useState(false);
  

    const connectToMetaMask = async () => {
        if (window.ethereum) {
            try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
    
            // Fetch account balance
            const balance = await web3.eth.getBalance(accounts[0]);
            setBalance(web3.utils.fromWei(balance, "ether"));
            } catch (error) {
            console.error("Failed to connect to MetaMask:", error);
            }
        } else {
            console.error("MetaMask not found");
        }
        }
    // Ensure price is defined before calling toFixed
    const renderCartItems = () => {
      return cartItems.map((item) => {
        const price = item.product.price || 0; // Default to 0 if undefined
        return (
          <div key={item.product._id} className="flex items-center mb-2">
            <img
              src={`http://localhost:5000/${item.product.image}`}
              alt={item.product.name}
              className="w-12 h-12 object-cover rounded-md"
            />
            <div className="ml-4">
              <p className="text-lg">{item.product.name}</p>
              <p className="text-gray-500">{item.quantity} x {price.toFixed(5)} ETH</p>
            </div>
          </div>
        );
      });
    };
  
    return (
      <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
  
        {/* MetaMask Connection */}
        <div className="mb-4">
          {account ? (
            <div>
              <p className="text-lg font-bold">Connected Account:</p>
              <p className="text-gray-700">{account}</p>
              <p className="text-lg font-bold mt-2">Balance: {balance} ETH</p>
            </div>
          ) : (
            <Button variant="contained" color="primary" onClick={connectToMetaMask}>
              Connect to MetaMask
            </Button>
          )}
        </div>
  
        {/* Cart Items Overview */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Order Summary</h2>
          {renderCartItems()}
  
          {/* Total Price */}
          <div className="mt-4">
            <p className="text-lg font-bold">Total: {totalPrice.toFixed(5)} ETH</p>
          </div>
        </div>
  
        {/* Complete Transaction Button */}
        <Button
          variant="contained"
          color="secondary"
        //   onClick={completeTransaction}
        onClick={console.log("Transaction completed")}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Complete Transaction"}
        </Button>
      </div>
    );
  };
  

export default CheckoutPage;