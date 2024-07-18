import React from "react";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
	return (
		<>
			<Outlet />
		</>
	);
};

export default App;
