import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserSidebar from "../Components/UserSidebar";
import Popup from "../Components/Popup";
import { useNavigate } from "react-router-dom";
import UserContext from "../utils/CreateContext";
import Cookies from "js-cookie";

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const { token, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
    }
  }, []);

  const fetchOrders = async (status = "") => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/getOrders?status=${status}`,
        { withCredentials: true }
      );
      setOrders(response.data.orders);
    } catch (error) {}
  };

  const fetchAddress = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/getAddress",
        { withCredentials: true }
      );
      setAddress(response.data.address);
    } catch (error) {}
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/user/changePassword`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      setPopupMessage("Password changed successfully");
      setShowPopup(true);
    } catch (error) {
      setPopupMessage("Error changing password");
      setShowPopup(true);
    }
  };

  const handleAddressEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/user/updateAddress`,
        { address: editAddress },
        { withCredentials: true }
      );
      setPopupMessage("Address updated successfully");
      setShowPopup(true);
      setIsEditingAddress(false);
      fetchAddress();
    } catch (error) {
      setPopupMessage("Error updating address");
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "address") fetchAddress();
  }, [activeTab]);

  return (
    <div className="flex min-h-screen">
      <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6 bg-gray-100 mt-[100px]">
        {activeTab === "orders" && (
          <div>
            <div className="flex justify-center mb-6">
              <div className="flex gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 text-lg rounded-lg" onClick={() => fetchOrders()}>
                  All
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 text-lg rounded-lg" onClick={() => fetchOrders("success")}>
                  Success
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 text-lg rounded-lg" onClick={() => fetchOrders("failed")}>
                  Failed
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 text-lg rounded-lg" onClick={() => fetchOrders("pending")}>
                  Pending
                </button>
              </div>
            </div>
            <div>
              {orders.map((order) => (
                <div key={order._id} className="border p-4 mb-2">
                  Order ID: {order._id} - Status: {order.status}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "address" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Address</h2>
            {!isEditingAddress ? (
              <div>
                <p>{address}</p>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 text-lg rounded-lg mt-4"
                  onClick={() => {
                    setIsEditingAddress(true);
                    setEditAddress(address);
                  }}
                >
                  Edit
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddressEditSubmit}>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="border p-2 mb-2 w-full"
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg rounded-lg">
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

        {activeTab === "changePassword" && (
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChangeSubmit}>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className="block mb-2 p-2 border rounded w-full"
                required
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="block mb-2 p-2 border rounded w-full"
                required
              />
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
