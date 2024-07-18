import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
	const error = useRouteError();
	return (
		<>
			<div id="error-page">
				<h1>OH NOO!!</h1>
				<p>Unexpected Error has occured.</p>
				<p>
					<i>{error.statusText || error.message}</i>
				</p>
			</div>
		</>
	);
};

export default ErrorPage;
