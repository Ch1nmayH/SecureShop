import React from "react";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login/Login";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import Products from "./Pages/Products/Products";
import Contact from "./Pages/Contact/Contact";
import Cart from "./Pages/Cart/Cart";
import Product from "./Pages/Product/Product";
import Register from "./Pages/Register/Register";

// Layout component to include NavBar and Outlet for nested routes
const Layout = () => (
	<>
	  <NavBar />
	  <Outlet />  {/* This renders the matched child route */}
	</>
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
			path: "/contact",
			element: <Contact />,
		},

		{
			path: "/cart",
			element: <Cart/>
		},

		{

			path: "/product/:productId",
			element: <Product />,
		},
	  ],
	},
	  {
		path: "/login",
		element: <Login />,
	  },

	  {
		path: "/register",
		element: <Register/>,
	  },

  ]);
  
  const App = () => {
	return <RouterProvider router={router} />;
  };

export default App;
