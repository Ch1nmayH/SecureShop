import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import axios from "axios";
import { motion } from "framer-motion";

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRetailerMenuOpen, setIsRetailerMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true); // for simplicity, we assume true initially

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleRetailerMenu = () => setIsRetailerMenuOpen(!isRetailerMenuOpen);

  const checkAuthorization = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users"); // Check if user is authorized
      setIsAuthorized(response.data.isAuthorized);
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/users",{
        withCredentials: true});
      setUsers(response.data);
      console.log(response.data);   
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Unauthorized");
        setIsAuthorized(false);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const fetchRetailers = async () => {
    try {
      const response = await axios.get("/api/retailers");
      setRetailers(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Unauthorized");
        setIsAuthorized(false);
      } else {
        setError("Something went wrong");
      }
    }
  };

  useEffect(() => {
    //checkAuthorization(); // Check for permissions when component mounts
  }, []);

  if (!isAuthorized) {
    return <div className="text-center mt-20 text-red-500 text-lg">Not Authorized</div>
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`fixed lg:relative bg-gray-800 text-white w-64 p-4 transition-transform transform lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:w-64`}>
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold">SECURESHOP</span>
          <button onClick={toggleSidebar} className="lg:hidden">
            <CloseIcon />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="space-y-4">
          {/* Manage User */}
          <div>
            <button
              className="flex items-center justify-between w-full text-left focus:outline-none"
              onClick={toggleUserMenu}
            >
              Manage User
              {isUserMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
            {isUserMenuOpen && (
              <motion.div
                className="ml-4 space-y-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
                  onClick={fetchUsers}
                >
                  Fetch Users
                </button>
                {/* Actions for Add, Update, Delete */}
                <a href="#" className="block hover:bg-gray-700 p-2 rounded">Add New User</a>
                <a href="#" className="block hover:bg-gray-700 p-2 rounded">Update User</a>
                <a href="#" className="block hover:bg-gray-700 p-2 rounded">Delete User</a>
              </motion.div>
            )}
          </div>

          {/* Manage Retailer */}
          <div>
            <button
              className="flex items-center justify-between w-full text-left focus:outline-none"
              onClick={toggleRetailerMenu}
            >
              Manage Retailer
              {isRetailerMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
            {isRetailerMenuOpen && (
              <motion.div
                className="ml-4 space-y-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
                  onClick={fetchRetailers}
                >
                  Fetch Retailers
                </button>
                {/* Actions for Add, Update, Delete */}
                <a href="#" className="block hover:bg-gray-700 p-2 rounded">Add New Retailer</a>
                <a href="#" className="block hover:bg-gray-700 p-2 rounded">Update Retailer</a>
                <a href="#" className="block hover:bg-gray-700 p-2 rounded">Delete Retailer</a>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-6 bg-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button onClick={toggleSidebar} className="lg:hidden">
            <MenuIcon />
          </button>
        </div>

        {/* User or Retailer List */}
        <div>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Users List */}
          {users.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Users</h2>
              <ul>
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="bg-white p-4 rounded shadow-lg flex justify-between items-center"
                  >
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Retailers List */}
          {retailers.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Retailers</h2>
              <ul>
                {retailers.map((retailer) => (
                  <li
                    key={retailer.id}
                    className="bg-white p-4 rounded shadow-lg flex justify-between items-center"
                  >
                    <span>{retailer.name}</span>
                    <span>{retailer.category}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
