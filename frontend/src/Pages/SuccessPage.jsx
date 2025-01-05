// src/pages/SuccessPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";


const SuccessPage = () => {
  const navigate = useNavigate();
  const orderId = useParams().orderId;
  const [orderedItems, setOrderedItems] = useState([]);
  const [transactionHash, setTransactionHash] = useState(null);

  const API_URL = process.env.REACT_APP_API_BASE_URL


  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
    }
    const response = axios.get(
      `${API_URL}/api/user/checkAuth`,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    response
      .then((res) => {})
      .catch((err) => {
        navigate("/unauthenticated");
      });
  }, []);

  useEffect(() => {
    // Fetch the transaction details using the orderId
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/transaction/getParticularTransaction/${orderId}`,
          { withCredentials: true }
        );
        setOrderedItems(response.data.transactions[0]);
        setTransactionHash(response.data.transactions[0].transactionHash);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };
    fetchTransaction();
  }, []);

  // If no state is passed, redirect to home or another appropriate page
  if (!orderedItems || !transactionHash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-4">No Transaction Found</h2>
          <p className="mb-6">It seems like you accessed this page directly.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Calculate total amount
  const totalAmount = parseFloat(orderedItems.totalAmount).toFixed(10)
   
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 mt-[130px]">
      {/* Success Indicator */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <div className="flex flex-col items-center mb-6">
          {/* Green Checkmark Icon */}
          <svg
            className="w-16 h-16 text-green-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h2 className="text-3xl font-semibold text-gray-800">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mt-2">Thank you for your purchase.</p>
        </div>

        {/* Transaction Hash */}
        <div className="bg-green-100 p-4 rounded mb-6">
          <p className="text-green-700">
            <span className="font-semibold">Transaction Hash:</span>{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-all"
            >
              {transactionHash}
            </a>
          </p>
        </div>

        {/* Purchased Products */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Product</th>
                <th className="py-2 px-4 border-b">Price (ETH)</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Total (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {orderedItems.products.map((item) => (
                <tr key={item.productId}>
                  <td className="py-2 px-4 border-b text-center">
                    {item.productName}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.price}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.quantity}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {(parseFloat(item.price) * item.quantity).toFixed(
                      6
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div className="flex justify-end mt-4">
          <span className="text-xl font-semibold">
            Total Amount: {totalAmount} ETH
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Continue Shopping
          </button>
          {/* Add more buttons if needed, e.g., View Orders */}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
