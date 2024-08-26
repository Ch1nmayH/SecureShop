import React from "react";
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
import Checkout from "./Pages/Checkout";

// Layout component to include NavBar and Outlet for nested routes
const Layout = () => (
  <div
    className="flex flex-col min-h-screen bg-gray-100"
  >
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
        element: <Checkout />,
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
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
