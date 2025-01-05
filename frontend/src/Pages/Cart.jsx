import React, { useContext, useEffect, useState } from "react";
import CartItem from "../Components/CartItem";
import { useNavigate } from "react-router-dom";
import CartContext from "../utils/CartContext";
import { Button, TextField } from "@mui/material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import axios from "axios"; // Assuming API calls are made using axios
import UserContext from "../utils/CreateContext";
import Cookies from "js-cookie";

const Cart = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const API_URL = process.env.REACT_APP_API_BASE_URL
  
  const { token } = useContext(UserContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [address, setAddress] = useState(""); // Default address
  const [isEditing, setIsEditing] = useState(false); // Toggle for showing/hiding form
  const [fullAddress, setFullAddress] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    mobile: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
    }
    const response = axios.get(
      `${API_URL}/api/user/checkAuth`,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    response
      .then((res) => {})
      .catch((err) => {
        navigate("/unauthenticated");
      });
  }, []);
  

  useEffect(() => {
    // Fetch address from API
    const fetchAddress = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/getUserAddress`, { withCredentials: true }); // Replace with actual API URL
        console.log("Address response:", response.data);
        setAddress(response.data.address || "Karnatak University, Dharwad 580003"); // Fallback if empty address
      } catch (error) {
        console.error("Error fetching address, using default:", error);
        setAddress("Karnatak University, Dharwad 580003"); // Default if API fails
      }
    };

    const fetchFullAddress = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/user/getUserAddress`,
          { withCredentials: true }
        );
        setFullAddress(response.data.fullAddress);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
    fetchFullAddress();
  }, [token, navigate]);

  // Update formValues when fullAddress changes
  useEffect(() => {
    if (fullAddress) {
      setFormValues({
        name: fullAddress.name || "",
        address1: fullAddress.address1 || "",
        address2: fullAddress.address2 || "",
        city: fullAddress.city || "",
        state: fullAddress.state || "",
        pinCode: fullAddress.pinCode || "",
        mobile: fullAddress.mobile || ""
      });
    }
  }, [fullAddress]);

  useEffect(() => {
    if (cartItems.length > 0) {
     
      updateTotalPriceAndQuantity(cartItems);
    } else {
      setTotalPrice(0); // Reset total price when cart is empty
      setTotalQuantity(0);
    }
  }, [cartItems]);


  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      handleCartEmpty(productId);
    } else {
      // Update cart item quantity in context
      updateCartItemQuantity(productId, newQuantity);
      
      // Update total price and quantity based on updated cartItems
      const updatedCartItems = cartItems.map((item) =>
        item.product._id === productId ? { ...item, quantity: newQuantity } : item
      );
      updateTotalPriceAndQuantity(updatedCartItems);
    }
  };
  

  const updateTotalPriceAndQuantity = (products) => {
    const total = products.reduce(
      (acc, product) => acc + product.product.price * (product.quantity || 1),
      0
    );
    const quantity = products.reduce(
      (acc, product) => acc + (product.quantity || 1),
      0
    );
    setTotalPrice(total);
    setTotalQuantity(quantity);
 };

  const handleCartEmpty = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = async () => {
    try {
      clearCart(); // Assuming clearCart removes all items from context
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleContinue = () => {
    navigate("/checkout");
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Submit the new address
  const handleSaveAddress = async () => {
    try {
      const updatedAddress = `
        ${formValues.name}, ${formValues.address1}, ${formValues.address2}, 
        ${formValues.city}, ${formValues.state} - ${formValues.pinCode}, 
        Mobile: ${formValues.mobile}`;

      setAddress(updatedAddress);

      // Send to backend
      await axios.post(
        `${API_URL}/api/user/addAddress`,
        {
          address: {
            name: formValues.name,
            address1: formValues.address1,
            address2: formValues.address2,
            city: formValues.city,
            state: formValues.state,
            pinCode: formValues.pinCode,
            mobile: formValues.mobile,
          }
        },
        { withCredentials: true }
      );

      // Optionally, update fullAddress state if needed
      setFullAddress({
        name: formValues.name,
        address1: formValues.address1,
        address2: formValues.address2,
        city: formValues.city,
        state: formValues.state,
        pinCode: formValues.pinCode,
        mobile: formValues.mobile,
      });

      setIsEditing(false); // Close the form on success
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  // Enter editing mode and set formValues with current fullAddress
  const handleEditAddress = () => {
    if (fullAddress) {
      setFormValues({
        name: fullAddress.name || "",
        address1: fullAddress.address1 || "",
        address2: fullAddress.address2 || "",
        city: fullAddress.city || "",
        state: fullAddress.state || "",
        pinCode: fullAddress.pinCode || "",
        mobile: fullAddress.mobile || ""
      });
    }
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-gray-100 flex justify-center md:mt-[100px]">
      <div className="w-full max-w-5xl flex flex-col space-y-6">
        {/* Address Section */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-bold text-center">Shipping Address</h2>
          {isEditing ? (
            // Address Form (only visible when editing)
            <div>
              <TextField
                label="Name"
                name="name"
                fullWidth
                margin="normal"
                value={formValues.name}
                onChange={handleInputChange}
              />
              <TextField
                label="Address 1"
                name="address1"
                fullWidth
                margin="normal"
                value={formValues.address1}
                onChange={handleInputChange}
              />
              <TextField
                label="Address 2"
                name="address2"
                fullWidth
                margin="normal"
                value={formValues.address2}
                onChange={handleInputChange}
              />
              <TextField
                label="City"
                name="city"
                fullWidth
                margin="normal"
                value={formValues.city}
                onChange={handleInputChange}
              />
              <TextField
                label="State"
                name="state"
                fullWidth
                margin="normal"
                value={formValues.state}
                onChange={handleInputChange}
              />
              <TextField
                label="Pincode"
                name="pinCode"
                fullWidth
                margin="normal"
                value={formValues.pinCode}
                onChange={handleInputChange}
              />
              <TextField
                label="Mobile Number"
                name="mobile"
                fullWidth
                margin="normal"
                value={formValues.mobile}
                onChange={handleInputChange}
              />
              <div className="flex justify-between mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveAddress}
                >
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // Display address and "Change Address" button when not editing
            <>
              <p className="text-center text-lg">{address}</p>
              <div className="text-center mt-4">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleEditAddress}
                >
                  Change Address
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Cart and Price Sections */}
        {!isEditing && (
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              <div className="bg-white p-4 rounded-md shadow-md mb-4">
                <h2 className="text-xl font-bold text-center">Your Cart</h2>
                <div className="mb-2 text-right">
                  {cartItems.length > 0 && (
                    <Button
                      startIcon={<ClearAllIcon />}
                      variant="outlined"
                      color="error"
                      onClick={handleClearCart}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                {cartItems.length > 0 ? (
                  cartItems.map((cartItem) => (
                    <CartItem
                      key={cartItem.product._id}
                      product={cartItem.product}
                      oldQuantity={cartItem.quantity}
                      onQuantityChange={handleQuantityChange}
                      removeFromCart={handleCartEmpty}
                    />
                  ))
                ) : (
                  <div className="text-center text-lg font-bold">Your cart is empty</div>
                )}
              </div>
            </div>

            {/* Price Details Section */}
            <div className="bg-white p-4 rounded-md shadow-md max-w-screen lg:w-[360px] h-[200px]">
              <h2 className="text-xl font-bold mb-4">PRICE DETAILS</h2>
              <div className="flex justify-between mb-2">
                <span>Price ({cartItems.length} items)</span>
                <span>{totalPrice.toFixed(10)} ETH</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-xl">
                <span>Total Amount</span>
                <span>{totalPrice.toFixed(10)} ETH</span>
              </div>
              <button
                className="bg-[#233745] text-white w-full mt-4 py-3 rounded-lg font-bold hover:bg-[#3d617a]"
                onClick={handleContinue}
                disabled={cartItems.length === 0} // Disable if cart is empty
              >
                Check Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
