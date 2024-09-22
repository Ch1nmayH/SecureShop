import React, { useContext, useEffect, useState } from "react";
import CartContext from "../utils/CartContext"; // Adjust the path as needed
import Web3 from "web3";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OrderManager from "../Contract/OrderManager.json"; // Adjust the path as needed

const CheckoutPage = () => {
  const OrderManagerABI = OrderManager.abi;
  const { cartItems, clearCart } = useContext(CartContext); // Assuming clearCart is available
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState(null); // Generate unique order ID
  const navigate = useNavigate();

  // Replace with your contract's deployed address
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

  const [web3, setWeb3] = useState(null);

  // Function to connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        // Initialize web3 instance
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        // Get balance
        const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
        const balanceEth = web3Instance.utils.fromWei(balanceWei, "ether");
        setBalance(parseFloat(balanceEth).toFixed(4));
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        alert("Failed to connect wallet.");
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  // Function to handle order placement
  const placeOrder = async () => {
    if (!account) {
      alert("Please connect your MetaMask wallet first.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setIsPlacingOrder(true);

  

      // Initialize contract
      const contract = new web3.eth.Contract(OrderManagerABI, CONTRACT_ADDRESS);

      // Prepare products array for smart contract
      const productsForContract = cartItems.map((item) => ({
        name: item.product.name,
        price: web3.utils.toWei(item.product.price.toString(), "ether"), // Convert price to Wei
        quantity: item.quantity,
      }));

      // Calculate total cost in ETH
      const totalCost = cartItems.reduce(
        (acc, item) => acc + parseFloat(item.product.price) * item.quantity,
        0
      );
      const totalCostWei = web3.utils.toWei(totalCost.toString(), "ether");

      // Define receiver address (modify as needed)
      const receiverAddress = account; // Sending to self for simplicity

      // Prepare transaction data
      const tx = contract.methods.placeOrder(receiverAddress, productsForContract);

      // Estimate gas
      const gas = await tx.estimateGas({ from: account, value: totalCostWei });
      const gasPrice = await web3.eth.getGasPrice();

      // Send transaction
      const receipt = await tx.send({
        from: account,
        value: totalCostWei,
        gas,
        gasPrice,
      });

      console.log("Transaction successful:", receipt.transactionHash);

      // Prepare data for backend
      const transactionData = {
        products: cartItems.map((item) => ({
          productId: item.product._id, // Use product._id
          productName: item.product.name,
          quantity: item.quantity,
          price: parseFloat(item.product.price),
        })),
        totalAmount: totalCost,
        transactionHash: receipt.transactionHash,
        orderStatus: "success",
      };

      // Post to backend
      const response = await axios.post("http://localhost:5000/api/transaction/transactions", transactionData, {
        withCredentials: true,
      }); // Adjust the endpoint as needed
      // Clear the cart
      clearCart();
    
      // Navigate to success page with order ID
      setOrderId(response.data.transaction);
      navigate(`/success/${orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");

      // Attempt to retrieve transaction hash if available
      const txHash = error?.transactionHash || null;

      // Prepare data for backend
      const transactionData = {
        products: cartItems.map((item) => ({
          productId: item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
          price: parseFloat(item.product.price),
        })),
        totalAmount: cartItems.reduce(
          (acc, item) => acc + parseFloat(item.product.price) * item.quantity,
          0
        ),
        transactionHash: txHash,
        orderStatus: "failed",
      };

      // Post to backend
      try {
        const response = await axios.post("http://localhost:5000/api/transaction/transactions", transactionData, {
          withCredentials: true,
        }); // Adjust the endpoint as needed
      } catch (backendError) {
        console.error("Error posting failed transaction:", backendError);
      }

      // Navigate to failed page
      navigate("/failed");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Fetch account balance when account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (account && web3) {
        try {
          const balanceWei = await web3.eth.getBalance(account);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setBalance(parseFloat(balanceEth).toFixed(4));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [account, web3]);

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Optionally, fetch the new balance
          if (web3) {
            web3.eth.getBalance(accounts[0]).then((balanceWei) => {
              const balanceEth = web3.utils.fromWei(balanceWei, "ether");
              setBalance(parseFloat(balanceEth).toFixed(4));
            });
          }
        } else {
          setAccount(null);
          setBalance("0");
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [web3]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Connect Wallet Section */}
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        {!account ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isConnecting ? "Connecting..." : "Connect MetaMask"}
          </button>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 break-all">
              <span className="font-semibold">Account:</span> {account}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Balance:</span> {balance} ETH
            </p>
          </div>
        )}
      </div>

      {/* Cart Items Section */}
      <div className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Cart Items</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Product</th>
                  <th className="py-2 px-4 border-b">Price (ETH)</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Total (ETH)</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id}>
                    <td className="py-2 px-4 border-b text-center">
                      {item.product.name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {item.product.price}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {item.quantity}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {(parseFloat(item.product.price) * item.quantity).toFixed(6)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <span className="text-xl font-semibold">
            Total:{" "}
            {cartItems
              .reduce(
                (acc, item) =>
                  acc + parseFloat(item.product.price) * item.quantity,
                0
              )
              .toFixed(6)}{" "}
            ETH
          </span>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="w-full max-w-md">
        <button
          onClick={placeOrder}
          disabled={isPlacingOrder || !account || cartItems.length === 0}
          className={`w-full ${
            isPlacingOrder || !account || cartItems.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-700"
          } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        >
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
