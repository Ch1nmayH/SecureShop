import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-white border-gray-300 py-8 border"
    style={{
      background: "linear-gradient(to right, #0A1A22, #2B3F4F)", // Different gradient for NavBar
    }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row flex-wrap justify-between items-center">
          {/* Logo and Links */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/">
              <h1 className="text-2xl font-bold mb-2 mt-3 md:mt">SecureShop</h1>
            </Link>
            <p className="text-sm mb-4">Your trusted eCommerce platform</p>
            <nav className="flex flex-col md:flex-row gap-4">
              <Link to="/" className="hover:text-cyan-500 transition ease-in-out">Home</Link>
              <Link to="/products" className="hover:text-cyan-500 transition ease-in-out">Products</Link>
              <Link to="/about" className="hover:text-cyan-500 transition ease-in-out">About</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-end border-t md:border-none mt-2">
            <h2 className="text-lg font-semibold mb-2 mt-2">Contact Us</h2>
            <p className="text-sm mb-1">Email: s3cureh0p@gmail.com</p>
            <p className="text-sm mb-1">Phone: +91 8660438044</p>
            <p className="text-sm">Address: Karnatak University, Dharwad 580003</p>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-gray-300 pt-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} SecureShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
