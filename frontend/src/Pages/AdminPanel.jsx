import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import UserCard from "../Components/UserCard";
import Popup from "../Components/Popup";
import EditForm from "../Components/EditForm";
import { useNavigate } from "react-router-dom";
import UserContext from "../utils/CreateContext";
import Cookies from "js-cookie";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]); // Placeholder for orders
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newData, setNewData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_BASE_URL

  const { token, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
    }
    const response = axios.get(
      `${API_URL}/api/user/checkAdminAuth`,
      {
        withCredentials: true,
      }
    );
    response
      .then((res) => {})
      .catch((err) => {
        navigate("/notAuthorized");
      });
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/user/getUsers?isRetailer=false?isAdmin=false`,
        { withCredentials: true }
      );
      setUsers(response.data.users);
    } catch (error) {}
  };

  const fetchRetailers = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/user/getUsers?isRetailer=true`,
        { withCredentials: true }
      );
      setRetailers(response.data.users);
    } catch (error) {}
  };

  const fetchOrders = async () => {
    // Placeholder: you can update this once you have an API for fetching orders
    setOrders([
      { id: 1, status: "Success" },
      { id: 2, status: "Pending" },
    ]);
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "retailers") fetchRetailers();
    if (activeTab === "dashboard") {
      fetchUsers();
      fetchRetailers();
      fetchOrders(); // Call fetch orders API when it's set
    }
  }, [activeTab]);

  const handleEdit = (user) => {
    setEditData(user);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`${API_URL}/api/user/deleteUser/${id}/`, {
          withCredentials: true,
        })
        .then(() => {
          setPopupMessage("User deleted successfully");
          setShowPopup(true);
          if (activeTab === "users") {
            fetchUsers(); // Refresh user list
          } else {
            fetchRetailers(); // Refresh retailer list
          }
        })
        .catch((err) => {
          setPopupMessage("Error deleting user");
          setShowPopup(true);
        });
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setNewData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      isVerified: true,
      isAdmin: false,
      isRetailer: false,
    });
    if (activeTab === "retailers") {
      setNewData({ ...newData, isRetailer: true, isVerified:true });
    }
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/api/user/createuser`, newData, {
        withCredentials: true,
      })
      .then(() => {
        setPopupMessage("User added successfully");
        setShowPopup(true);
        setIsAdding(false);
        if (activeTab === "users") {
          fetchUsers(); // Refresh user list
        } else {
          fetchRetailers(); // Refresh retailer list
        }
      });
  };

  const handleInputChange = (e) => {
    
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editData || !editData._id) {
      setPopupMessage("Invalid data for update");
      setShowPopup(true);
      return;
    }
  
    try {
      // Make sure the data is populated
      console.log("Updating user with data:", editData);
  
      await axios.put(
        `${API_URL}/api/user/updateuser/${editData._id}`,
        editData,
        { withCredentials: true }
      );
  
      setPopupMessage("User updated successfully");
      setShowPopup(true);
      setIsEditing(false);
      fetchUsers(); // Refresh user list
      fetchRetailers();
    } catch (error) {
      setPopupMessage("Error updating user");
      setShowPopup(true);
      console.error("Error in update:", error); // Log any error from the request
    }
  };
  

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPopupMessage("Passwords do not match!");
      setShowPopup(true);
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/user/changePassword`,
        { password: newPassword },
        { withCredentials: true }
      );
      setPopupMessage("Password changed successfully");
      setShowPopup(true);
      setActiveTab("users"); // After password change, reset the tab
    } catch (error) {
      setPopupMessage("Error changing password");
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "retailers") fetchRetailers();
  }, [activeTab]);

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6 bg-gray-100">
        {activeTab === "dashboard" ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">
              <div className="p-6 rounded shadow-md text-center bg-[#915cdb] text-white h-[250px] min-w-[250px] flex flex-col justify-center items-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300 ease-in-out">
                <h2 className="text-xl font-bold">Retailers</h2>
                <p className="text-2xl">{retailers.length}</p>
              </div>
              <div className="p-6 rounded shadow-md text-center bg-[#07838a] text-white h-[250px] min-w-[250px] flex flex-col justify-center items-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300 ease-in-out">
                <h2 className="text-xl font-bold">Users</h2>
                <p className="text-2xl">{users.length}</p>
              </div>
              <div className="p-6 rounded shadow-md text-center bg-[#db4863] text-white h-[250px] min-w-[250px] flex flex-col justify-center items-center transition-transform transform hover:scale-105 hover:shadow-lg duration-300 ease-in-out">
                <h2 className="text-xl font-bold">Orders</h2>
                <p className="text-2xl">{orders.length}</p>
              </div>
            </div>
          </div>
        ) : activeTab === "changePassword" ? (
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChangeSubmit}>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="block mb-2 p-2 border rounded"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="block mb-2 p-2 border rounded"
                required
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setActiveTab("users")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAdd}
              >
                Add New {activeTab === "users" ? "User" : "Retailer"}
              </button>
            </div>

            {isAdding ? (
              <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">
                  Add New {activeTab === "users" ? "User" : "Retailer"}
                </h2>
                <form onSubmit={handleSubmitAdd}>
                  <input
                    type="text"
                    name="firstName"
                    value={newData.firstName}
                    onChange={handleAddInputChange}
                    placeholder="First Name"
                    className="block mb-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={newData.lastName}
                    onChange={handleAddInputChange}
                    placeholder="Last Name"
                    className="block mb-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={newData.email}
                    onChange={handleAddInputChange}
                    placeholder="Email"
                    className="block mb-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    name="mobile"
                    value={newData.mobile}
                    onChange={handleAddInputChange}
                    placeholder="Mobile"
                    className="block mb-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    value={newData.password}
                    onChange={handleAddInputChange}
                    placeholder="Password"
                    className="block mb-2 p-2 border rounded"
                    required
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add User
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : isEditing ? (
              <EditForm
              formData={editData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmitEdit} // pass handleSubmitEdit directly
              handleCancel={() => setIsEditing(false)}
          />
            ) : (
              <div>
                {activeTab === "users" &&
                  users.map((user) => (
                    <UserCard
                      key={user._id}
                      user={user}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  ))}
                {activeTab === "retailers" &&
                  retailers.map((retailer) => (
                    <UserCard
                      key={retailer._id}
                      user={retailer}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  ))}
              </div>
            )}
          </>
        )}
        {showPopup && (
          <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
