import mongoose from "mongoose";

const paymentHashSchema = new mongoose.Schema({
    paymentHash: { type: String, required: true },
    orderId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const paymentHashModel = mongoose.model("PaymentHash", paymentHashSchema);
