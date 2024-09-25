import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	otp: { type: Number, required: true },
	verified: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now, expires: 300 }, // Apply expiration to `createdAt`
});

const otpModel = mongoose.model("Otp", otpSchema);

export default otpModel;
