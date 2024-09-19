import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import CartRouter from "./routes/cartRoute.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import multer from 'multer';
import path from 'path';



const app = express();
const port = process.env.PORT || 6000;


// Set up path for the uploads folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
	origin: "http://localhost:3000", // Replace * with the specific origin
	credentials: true, // Allow sending of credentials (cookies)
  }));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("server is running...");
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", CartRouter);

app.listen(port, () => {
	try {
		connectDB();
		console.log(`Server is running on port ${port}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
});
