import React from 'react'
import './NavBar.css'
import { useState } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [menu, setMenu] = useState("Home");
  return (
	<div className="navbar">
    <div className="nav__logo">
      <CurrencyBitcoinIcon className='nav__icon' fontSize="large"/>
      <h1>SecureShop</h1>
      <input type="text" placeholder="Search for products, brands and more"/>
      <SearchIcon className='nav__search' fontSize='large'/>
      <ul>
        <Link to='/'><li onClick={()=>{setMenu("Home")}}>Home{menu === "Home" ? <hr/> : <></>}</li> </Link>
        <Link to='/contact'><li onClick={()=>{setMenu("Contact Us")}}>Contact Us {menu === "Contact Us" ? <hr/> : <></>}</li> </Link>
      </ul> 
      </div>
      <div className="nav-login-cart">
        <Link to='/login'><button>Login</button></Link>
        <Link to='/cart'><ShoppingCartOutlinedIcon className='cart-icon' fontSize='large'/></Link>
        <div className="cart__count">
          {cartCount}
        </div>
      </div>
  </div>
  )
}

export default NavBar