import PaymentHashModel from '../models/PaymentHashModel.js'; // Import the Transaction model
import jwt from 'jsonwebtoken'; // For verifying JWT token

// API to create a transaction
const createTransaction = async (req, res) => {
    try {
        const token = req.cookies.token; // Make sure you're using 'cookies' to get the token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify JWT token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = verified.id; // Extract the user ID from the verified token

        // Extract transaction data from the request body
        const { products, totalAmount, transactionHash, orderStatus } = req.body;

     

        // Validate that the required fields are present
        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No products in the transaction." });
        }

        if (!totalAmount) {
            return res.status(400).json({ message: "Total amount is required." });
        }

        // Create a new transaction object using the PaymentHashModel
        const newTransaction = new PaymentHashModel({
            userRef: userId, // Associate the transaction with the user
            products, // The products array from the request
            totalAmount, // Total price of the order
            transactionHash, // Hash from the smart contract transaction (optional for failed)
            orderStatus: orderStatus || 'pending' // Set status based on the input or default to 'pending'
        });

        // Save the transaction to the database
        const savedTransaction = await newTransaction.save();
        const transactionPlaced = await PaymentHashModel.findById(savedTransaction._id);
        // Return success response
        res.status(201).json({
            message: "Transaction created successfully.",
            transaction: transactionPlaced
        });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getParticularTransaction = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = verified.id;

        const transactions = await PaymentHashModel.find({ _id: req.params.id, userRef: userId });

        res.status(200).json({ transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}
const getAllUserTransactions = async (req, res) => {
    try {
        const token = req.cookies.token;
        const orderStatusParams = req.params.orderStatus;
        console.log(orderStatusParams);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = verified.id;

        if(orderStatusParams === "all"){
            const transactions = await PaymentHashModel.find({ userRef: userId });
            return res.status(200).json({ transactions });
        }

        if(orderStatusParams == "failed"){
            const transactions = await PaymentHashModel.find({ userRef: userId, orderStatus: 'failed' });
            return res.status(200).json({ transactions });
        }

        if(orderStatusParams === "pending"){
            const transactions = await PaymentHashModel.find({ userRef: userId, orderStatus: 'pending' });
            return res.status(200).json({ transactions });
        }

        const transactions = await PaymentHashModel.find({ userRef: userId, orderStatus: 'success' });

        res.status(200).json({ transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export default {createTransaction, getParticularTransaction, getAllUserTransactions};
