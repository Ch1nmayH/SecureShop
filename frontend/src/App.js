import React, { useEffect, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import NavBar from "./Components/NavBar";
import HomePage from "./Pages/HomePage";
import Products from "./Pages/Products";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ErrorPage from "./Pages/ErrorPage";
import Footer from "./Components/Footer";
import About from "./Pages/About";
import AdminPanel from "./Pages/AdminPanel";
import OTPVerification from "./Pages/OTPVerification";
import UserContext from "./utils/CreateContext";
import Cookies from "js-cookie";
import RetailerPanel from "./Pages/RetailerPanel";
import UnauthorizedPage from "./Pages/UnauthorizedPage";
import { CartProvider } from "./utils/CartContext";
import CheckoutPage from "./Pages/CheckoutPage ";
import SuccessPage from "./Pages/SuccessPage";
import OrdersPage from "./Pages/OrdersPage";
import FailedPage from "./Pages/FailedPage";
import UserPanel from "./Pages/UserPanel";

const Layout = () => (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <NavBar />
    <main className="flex-grow">
      <Outlet /> {/* This renders the matched child route */}
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout to wrap routes with NavBar
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/product/:productId",
        element: <Product />,
      },
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/otp-verification/:token",
        element: <OTPVerification />,
      },

      {
        path:"/success/:orderId",
        element:<SuccessPage/>
      },

      {
        path:"/failed/:orderId",
        element:<FailedPage/>
      },
      {
     path:"/OrderPage/:orderStatus",
      element:<OrdersPage/>
      },
      {
        path:"/userDashboard",
        element:<UserPanel/>
      }
    ],
  },
  {
    path: "/admin",
    element: <AdminPanel />,
  },
  {
    path: "/retailer",
    element: <RetailerPanel />,
  },
  {
    path: "/notAuthorized",
    element: <UnauthorizedPage />,
  },
]);

const App = () => {
  const [token, setToken] = useState(Cookies.get("token"));
  useEffect(() => {
    if (token) setToken(token);
    else setToken(null);
  }, []);

  return (
    <>
      <UserContext.Provider value={{ token, setToken }}>
        <CartProvider>
          <RouterProvider router={router} />;
        </CartProvider>
      </UserContext.Provider>
    </>
  );
};

export default App;
