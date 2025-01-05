import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';


const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const orderStatusParam = useParams().orderStatus;

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
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/transaction/transactions/${orderStatusParam}`, {withCredentials:true});  // Replace with user-specific endpoint
        setOrders(response.data.transactions);
        console.log(response.data.transactions);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold mb-6">Your Orders</h1>
      <div className="bg-white shadow-md rounded-lg p-8">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Total Amount (ETH)</th>
              <th className="py-2 px-4 border-b">Order Status</th>
              <th className="py-2 px-4 border-b">Transaction Hash</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="py-2 px-4 border-b text-center">{order._id}</td>
                <td className="py-2 px-4 border-b text-center">{order.totalAmount}</td>
                <td className="py-2 px-4 border-b text-center">{order.orderStatus}</td>
                <td className="py-2 px-4 border-b text-center">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${order.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {order.transactionHash}
                  </a>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => navigate(`/success/${order._id}`)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
