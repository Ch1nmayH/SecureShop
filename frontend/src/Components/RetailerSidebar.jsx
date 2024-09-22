import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import UserContext from "../utils/CreateContext";

const RetailerSidebar = ({ activeTab, setActiveTab }) => {
  const { token, setToken } = useContext(UserContext);
  let navigate = useNavigate();

  const handleLogout = () => {
    if (token) {
      setToken(null);
      Cookies.remove("token");
      navigate("/login");
    }
  };

  // Define the styling for each tab based on whether it's active or not
  const tabClass = (tabName) =>
    `mb-4 cursor-pointer p-2 transition-colors ${
      activeTab === tabName
        ? "bg-blue-500 text-white font-bold rounded-md" // Active tab style
        : "text-gray-300 hover:bg-gray-700 rounded-md"  // Inactive tab style
    }`;

  return (
    <div className="bg-gray-800 text-white w-64 p-4">
      <h1 className="text-2xl font-bold mb-6">SECURESHOP</h1>
      <ul>
        <li
          className={tabClass("dashboard")}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </li>
        <li
          className={tabClass("products")}
          onClick={() => setActiveTab("products")}
        >
          Manage Products
        </li>
        <li
          className={tabClass("categories")}
          onClick={() => setActiveTab("categories")}
        >
          Manage Categories
        </li>
        <li
          className={tabClass("changePassword")}
          onClick={() => setActiveTab("changePassword")}
        >
          Change Password
        </li>
        <li
          className="mb-4 cursor-pointer p-2 text-gray-300 hover:bg-gray-700 rounded-md"
          onClick={handleLogout}
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default RetailerSidebar;
