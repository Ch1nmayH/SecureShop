import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserSidebar from "../Components/UserSidebar";
import Popup from "../Components/Popup";
import { useNavigate } from "react-router-dom";
import UserContext from "../utils/CreateContext";
import Cookies from "js-cookie";

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState(null)
  const [fullAddress, setFullAddress] = useState(null)
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddress, setEditAddress] = useState({
    name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    mobile: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
    }
  }, []);

  // Fetch orders based on status
  const fetchOrders = async (status = "success") => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/transaction/transactions/${status}`,
        {
          withCredentials: true,
        }
      );

      setOrders(response.data.transactions);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch the user's address
  const fetchAddress = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/getUserAddress",
        { withCredentials: true }
      );
      setAddress(response.data.address);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };


  const fetchFullAddress = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/getUserAddress",
        { withCredentials: true }
      );
      setFullAddress(response.data.fullAddress);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };
  // Handle password change
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordErrorMessage("Passwords do not match");
      return;
    }
    setPasswordErrorMessage("");
    try {
      await axios.put(
        "http://localhost:5000/api/user/changePassword",
        { password },
        { withCredentials: true }
      );
      setPopupMessage("Password changed successfully");
      setShowPopup(true);
    } catch (error) {
      setPopupMessage("Error changing password");
      setShowPopup(true);
    }
  };

  // Handle address update
  const handleAddressEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/user/addAddress",
        { address: editAddress },
        { withCredentials: true }
      );
      setPopupMessage("Address updated successfully");
      setShowPopup(true);
      setIsEditingAddress(false);
      fetchAddress(); // Re-fetch updated address
    } catch (error) {
      setPopupMessage("Error updating address");
      setShowPopup(true);
    }
  };

  // Fetch data when the active tab changes
  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "address") fetchAddress() && fetchFullAddress();
  }, [activeTab]);

  return (
    <div className="flex min-h-screen">
      <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6 bg-gray-100 mt-[100px]">
        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <div className="flex justify-center mb-6">
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 text-lg rounded-lg"
                  onClick={() => fetchOrders()}
                >
                  All
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 text-lg rounded-lg"
                  onClick={() => fetchOrders("success")}
                >
                  Success
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 text-lg rounded-lg"
                  onClick={() => fetchOrders("failed")}
                >
                  Failed
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 text-lg rounded-lg"
                  onClick={() => fetchOrders("pending")}
                >
                  Pending
                </button>
              </div>
            </div>
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
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-2 px-4 border-b text-center">
                        {order._id}
                      </td>

                      <td className="py-2 px-4 border-b text-center">
                        {order.totalAmount}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {order.orderStatus}
                      </td>
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
        )}

{activeTab === "address" && (
  <div>
    <h2 className="text-xl font-bold mb-4">Address</h2>
    {!isEditingAddress ? (
      <div>
        <p>
          {address}
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 text-lg rounded-lg mt-4"
          onClick={() => {
            setIsEditingAddress(true);
            setEditAddress(fullAddress); // Pre-fill the form with current address details
          }}
        >
          Edit
        </button>
      </div>
    ) : (
      <form onSubmit={handleAddressEditSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={editAddress.name}
            onChange={(e) =>
              setEditAddress({ ...editAddress, name: e.target.value })
            }
            className="border p-2 mb-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Address 1</label>
          <input
            type="text"
            value={editAddress.address1}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                address1: e.target.value,
              })
            }
            className="border p-2 mb-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Address 2</label>
          <input
            type="text"
            value={editAddress.address2}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                address2: e.target.value,
              })
            }
            className="border p-2 mb-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">City</label>
          <input
            type="text"
            value={editAddress.city}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                city: e.target.value,
              })
            }
            className="border p-2 mb-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">State</label>
          <input
            type="text"
            value={editAddress.state}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                state: e.target.value,
              })
            }
            className="border p-2 mb-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Pincode</label>
          <input
            type="text"
            value={editAddress.pinCode}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                pinCode: e.target.value,
              })
            }
            className="border p-2 mb-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Mobile Number</label>
          <input
            type="text"
            value={editAddress.mobile}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                mobile: e.target.value,
              })
            }
            className="border p-2 mb-2 w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg rounded-lg"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 text-lg rounded-lg"
            onClick={() => setIsEditingAddress(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    )}
  </div>
)}


        {/* Change Password Tab */}
        {activeTab === "changePassword" && (
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChangeSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="new Password"
                className="block mb-2 p-2 border rounded w-full"
                required
              />
              
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="block mb-2 p-2 border rounded w-full"
                required
              />
              <p className="text-red-600 mb-[10px]">{passwordErrorMessage}</p>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg rounded-lg"
              >
                Save
              </button>
            </form>
          </div>
        )}
      </div>
      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default UserPanel;
