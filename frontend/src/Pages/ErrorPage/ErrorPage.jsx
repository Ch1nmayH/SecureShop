import React from "react";
import "./ErrorPage.css";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="error-container">
      <h1>Oops!</h1>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/" className="back-home">
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
