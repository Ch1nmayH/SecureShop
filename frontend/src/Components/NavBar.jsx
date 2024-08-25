import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../Assets/logo.png";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const NavBar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(true);
  const [menu, setMenu] = useState("Home");
  return (
    <div className="h-[80px] shadow-2xl">
      <div className="w-full my-auto">
        <div className="flex justify-between items-center">
          <div className="flex justify-center gap-4 p-2 items-center">
            {/* Left */}
            <div className="flex justify-center items-center gap-2 p-2">
              <Link to={"/"}>
                <img src={logo} alt="Logo" className="h-10" />
              </Link>
              <Link
                to={"/"}
                className="font-[pacifico-regular,cursive] text-2xl font-bold uppercase" 
              >
                SecureShop
              </Link>
              <input type="text" name="" id="" className="border hidden md:block ml-[100px]"/>
              <div className="">
              <Link to={"/"} className="">
                <SearchIcon fontSize="large" />
              </Link>
            </div>
            </div>
          </div>
          <div>
            {/* middle */}
            <nav className="flex justify-around gap-20">
              <ul className="flex justify-center gap-4 p-2">
                <li>
                  <Link
                    to={"/"}
                    className="hover:text-cyan-600 text-xl font-bold focus:text-cyan-600 transition ease-in-out"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/product"}
                    className="hover:text-cyan-600 text-xl font-bold focus:text-cyan-600 transition ease-in-out"
                  >
                    Category
                  </Link>
                </li>
              </ul>
              <Link to={'/login'}>
              <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Login
                </span>
              </button>{" "}
              </Link>
            </nav>
          </div>
          <div className="flex gap-3 mx-[20px]">
            {/* right */}
            <div className="relative flex">
              <Link to={"/cart"} className="">
                <ShoppingCartOutlinedIcon fontSize="large" />
              </Link>
              <span className="absolute before:h-3.5 w-3.5 text-xs bg-red-500 text-center text-white rounded-2xl right-[0px] top-[-2px]">
                {cartCount}
              </span>
            </div>
            <Link
              to={"/"}
              className="md:hidden"
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
            >
              {menuOpen ? (
                <MenuIcon fontSize="large" />
              ) : (
                <CloseOutlinedIcon fontSize="large" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
