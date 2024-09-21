// src/pages/FailedPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const FailedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 mt-[200px]">
      {/* Failed Indicator */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <div className="flex flex-col items-center mb-6">
          {/* Red Cross Icon */}
          <svg
            className="w-16 h-16 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <h2 className="text-3xl font-semibold text-gray-800">
            Transaction Failed!
          </h2>
          <p className="text-gray-600 mt-2">
            Unfortunately, your order could not be processed.
          </p>
        </div>

        {/* Error Message */}
        <div className="bg-red-100 p-4 rounded mb-6">
          <p className="text-red-700">
            <span className="font-semibold">Error:</span> Something went wrong
            during the transaction. Please try again later.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => navigate("/checkout")}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry Payment
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailedPage;
