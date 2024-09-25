import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"; // for animations

const OTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const token = useParams().token;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(countdown - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleOtpChange = (element, index) => {
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpCode = otp.join("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/verify",
        { token, otp: otpCode }
      );

      if (response.status === 200) {
        if (response.data.message === "Email already verified") {
          setErrorMessage("User is already verified!");
          setSuccessMessage("");
          setTimeout(() => {
            // Redirect to login page after 2 seconds
            navigate("/login");
          }, 2000);
        } else if (response.data.message === "Invalid token") {
          setErrorMessage("Invalid user or URL.");
          setSuccessMessage("");
        } else if (response.data.message === "Invalid OTP") {
          setErrorMessage("Incorrect OTP. Please try again.");
          setSuccessMessage("");
        } else if (response.data.message === "Email Verified Successfully") {
          setSuccessMessage("Email verified successfully!");
          setErrorMessage("");
          setTimeout(() => {
            // Redirect to login page after 2 seconds
            navigate("/login");
          }, 2000);
        }
      }

      setLoading(false);
    } catch (error) {
      setErrorMessage("Invalid OTP.");
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCountdown(300); // Reset the countdown
    setResendDisabled(true);
    // Resend OTP logic here, similar to the one in `handleSubmit`
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          OTP Verification
        </h2>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 text-red-700 p-2 mb-4 rounded-lg"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 text-green-700 p-2 mb-4 rounded-lg"
          >
            {successMessage}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex space-x-2 mb-4">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                required
              />
            ))}
          </div>

          <button
            type="submit"
            className={`w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendDisabled}
            className={`w-full mt-4 py-2 bg-gray-400 text-white font-semibold rounded-md ${
              resendDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-500"
            }`}
          >
            Resend OTP ({Math.floor(countdown / 60)}:
            {("0" + (countdown % 60)).slice(-2)})
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
