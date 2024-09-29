import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import wallpaper from "../Assets/formWall.png";
import { Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../utils/CreateContext";

const NewPassword = () => {
  const { token } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const verifyToken = useParams().token;
  const secret = useParams().secret;

  console.log(verifyToken, secret);
  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  useEffect(() => {
    if (!verifyToken || !secret) navigate("/error");
  }, [verifyToken, secret]);

  const validatePassword = () => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) return "Confirm Password is required";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordValidation = validatePassword();
    const confirmPasswordValidation = validateConfirmPassword();
    setPasswordError(passwordValidation);
    setConfirmPasswordError(confirmPasswordValidation);
    if (passwordValidation || confirmPasswordValidation) return;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/newPassword",
        { password, token:verifyToken, secret }
      );
      if (response.status === 200 && response.data.message === "Password changed successfully") {
        setServerError("Password changed successfully");
        setTimeout(() => {
            navigate("/login");
            }, 2000);

      }

      else{
        setServerError(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        setServerError(error.response.data.message);
      } else {
        setServerError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] bg-cover bg-center"
      style={{
        backgroundImage: `url(${wallpaper})`,
      }}
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-7 md:mt-20 mb-10">
        <h2 className="text-2xl font-semibold text-center mb-6">
          New Password
        </h2>
        {serverError && (
          <p className="text-red-500 text-center mb-4">{serverError}</p>
        )}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* Password */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm">{confirmPasswordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reset
          </button>
        </form>
        <p className="text-center mt-6 text-sm">
          Don't have a reason to be here?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Go Back
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NewPassword;
