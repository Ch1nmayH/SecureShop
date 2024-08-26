import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../Assets/logo.png";
// import banner from "../Assets/banner.jpg";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const NavBar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
  ];

  return (
    <div className="h-[80px] shadow-2xl bg-gradient-to-r from-cyan-500 to-blue-500 sticky top-0 z-10 transition-all"
    style={{
      background: "linear-gradient(to right, #0A1A22, #2B3F4F)", // Different gradient for NavBar
    }}>
      <div className="w-full my-auto">
        <div className="flex items-center justify-between p-4">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <CloseOutlinedIcon fontSize="large" className="text-white" />
              ) : (
                <MenuIcon fontSize="large" className="text-white" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-4 flex-1">
            <Link to={"/"}>
              <img src={logo} alt="Logo" className="h-10 hidden xl:block" />
            </Link>
            <Link
              to={"/"}
              className="font-[pacifico-regular,cursive] text-2xl font-bold uppercase text-white"
            >
              SecureShop
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex items-center flex-grow justify-center">
            <input
              type="text"
              placeholder="Search"
              className="border w-full max-w-[400px] md:max-w-[300px] lg:max-w-[350px] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <div className="ml-2">
              <Link to={"/"}>
                <SearchIcon fontSize="large" className="text-white" />
              </Link>
            </div>
          </div>

          {/* Right: Cart and Login */}
          <div className="flex items-center gap-6 ml-4">
            <div className="relative flex items-center">
              <Link to={"/cart"}>
                <ShoppingCartOutlinedIcon
                  fontSize="large"
                  className="text-white"
                />
              </Link>
              <span className="absolute h-3.5 w-3.5 text-xs bg-red-500 text-center text-white rounded-2xl right-[-1px] top-[-4px]">
                {cartCount}
              </span>
            </div>
            <Link to={"/login"}>
              <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Login
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Links */}
        <div className={`md:hidden ${menuOpen ? "block" : "hidden"}`}>
          <nav className="flex flex-col items-center gap-4 p-4 bg-white shadow-md">
            {menuLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="w-full text-center py-2 bg-gradient-to-r from-[#1B2932] to-[#3A5564] text-lg font-semibold text-white rounded-lg hover:from-[#1C3446] hover:to-[#4B6C78] transition ease-in-out"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Menu Links */}
        <div className="hidden md:flex items-center justify-center gap-8 bg-gray-50 py-2 border shadow-xl">
          {menuLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-lg font-semibold text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition ease-in-out"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
