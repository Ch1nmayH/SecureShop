import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import router from "./router/routes.js";
import connectDB from "./config/db.js";

const app = express();
const port = process.env.PORT || 6000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("server is running...");
});

app.use("/api", router);

app.listen(port, () => {
	try {
		connectDB();
		console.log(`Server is running on port ${port}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
});
