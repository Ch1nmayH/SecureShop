import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 border-gray-300 py-8 border">
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
              <Link to="/contact" className="hover:text-cyan-500 transition ease-in-out">Contact</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-end border-t md:border-none mt-2">
            <h2 className="text-lg font-semibold mb-2 mt-2">Contact Us</h2>
            <p className="text-sm mb-1">Email: support@secureshop.com</p>
            <p className="text-sm mb-1">Phone: +1 (234) 567-890</p>
            <p className="text-sm">Address: 123 Secure St, eCommerce City, EC 12345</p>
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
