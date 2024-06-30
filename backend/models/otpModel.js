import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	otp: { type: Number, required: true, expires: 300 },
	verified: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

const otpModel = mongoose.model("Otp", otpSchema);

export default otpModel;
