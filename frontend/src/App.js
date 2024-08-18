import React from "react";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login/Login";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";

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
	  ],
	},
	  {
		path: "/login",
		element: <Login />,
	  },
  ]);
  
  const App = () => {
	return <RouterProvider router={router} />;
  };

export default App;
