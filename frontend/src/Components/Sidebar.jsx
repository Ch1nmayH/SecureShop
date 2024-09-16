import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import UserContext from "../utils/CreateContext";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { token, setToken } = useContext(UserContext);
  let navigate = useNavigate();

  const handleLogout = () => {
    if (token) {
      setToken(null);
      Cookies.remove("token");
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 p-4">
      <h1 className="text-2xl font-bold mb-6">SECURESHOP</h1>
      <ul>
        <li
          className={`mb-4 cursor-pointer ${
            activeTab === "users" && "font-bold"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </li>
        <li
          className={`mb-4 cursor-pointer ${
            activeTab === "retailers" && "font-bold"
          }`}
          onClick={() => setActiveTab("retailers")}
        >
          Manage Retailers
        </li>
        <li
          className="mb-4 cursor-pointer"
          onClick={() => setActiveTab("changePassword")}
        >
          Change Password
        </li>
        <li className="cursor-pointer" onClick={() => handleLogout()}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
