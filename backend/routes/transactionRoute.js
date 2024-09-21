import express from "express";
import transactionController from "../controllers/transactionController.js";

const app = express.Router();


app.post("/transactions", transactionController.createTransaction);

app.get("/getParticularTransaction/:id", transactionController.getParticularTransaction);

app.get("/transactions/:orderStatus", transactionController.getAllUserTransactions);

export default app;