import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import UserContext from "../utils/CreateContext";

const UserSidebar = ({ activeTab, setActiveTab }) => {
  const { token, setToken } = useContext(UserContext);
  const navigate = useNavigate();

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
          className={`mb-4 cursor-pointer ${activeTab === "orders" && "font-bold"}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </li>
        <li
          className={`mb-4 cursor-pointer ${activeTab === "address" && "font-bold"}`}
          onClick={() => setActiveTab("address")}
        >
          Address
        </li>
        <li
          className={`mb-4 cursor-pointer ${activeTab === "changePassword" && "font-bold"}`}
          onClick={() => setActiveTab("changePassword")}
        >
          Change Password
        </li>
        <li className="cursor-pointer" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
