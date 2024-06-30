import user from "../models/userModel.js";
import Otp from "../models/otpModel.js";
import bcrypt from "bcryptjs";
import otp from "../config/otpGenerator.js";
import transporter from "../config/mailTransporter.js";
import jwt from "jsonwebtoken";

const signup = async (req, res, next) => {
	const { firstName, lastName, email, mobile, password } = req.body;
	try {
		const existingUser = await user.findOne({ email });

		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User already exists with this email" });
		}

		const newUser = await user.create({
			firstName,
			lastName,
			email,
			mobile,
			password,
		});

		const mailOptions = {
			from: process.env.EMAIL,
			to: email,
			subject: "Email Verification",
			text: `Your OTP for Email Verification is ${otp}`,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log(`Email sent: ${info.response}`);
			}
		});

		const newOtp = await Otp.create({
			email,
			otp,
		});

		return res.status(201).json({
			message:
				"User Created Successfully, an otp has been sent to your email for account activation and email confirmation.",
			otp: otp,
		});
		next();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const signin = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const existingUser = await user.login(email, password);
		if (existingUser.isVerified) {
			const token = jwt.sign(
				{ email: existingUser.email, id: existingUser._id },
				process.env.JWT_SECRET,
				{
					expiresIn: "1h",
				},
			);

			return res
				.status(200)
				.cookie("token", token, {
					httpOnly: true,
					secure: false,
					maxAge: 1000 * 60 * 60 * 60 * 24,
				})
				.json({ user: existingUser, token });
		}

		return res.status(400).json({
			message: "User not verified, please verify your email first",
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const signOut = async (req, res, next) => {
	// let token = req.cookies.token;
	// console.log(token);
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(400).json({ message: "User not authenticated" });
		}
		const decodedData = jwt.verify(token, process.env.JWT_SECRET);
		if (!decodedData) {
			return res.status(400).json({ message: "User not authenticated" });
		}

		res.clearCookie("token");
		res.status(200).json({ message: "Signout Successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const verify = async (req, res, next) => {
	const { email, otp } = req.body;
	try {
		const existingOtp = await Otp.findOne({ email });
		if (existingOtp.verified)
			return res.status(400).json({ message: "Email already verified" });

		if (existingOtp.otp === otp) {
			await Otp.findOne({ email }).updateOne({ verified: true });
			await user.findOne({ email }).updateOne({ isVerified: true });
			return res.status(200).json({ message: "Email Verified Successfully" });
		}

		return res.status(400).json({ message: "Invalid OTP" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const resendOtp = async (req, res, next) => {
	const { email } = req.body;
	try {
		const existingUser = await user.findOne({ email });
		if (!existingUser) {
			return res.status(400).json({ message: "User not found" });
		}

		if (existingUser.isVerified) {
			return res.status(400).json({ message: "User already verified" });
		}

		const mailOptions = {
			from: process.env.EMAIL,
			to: email,
			subject: "Email Verification",
			text: `Your OTP for Email Verification is ${otp}`,
		};
		const newOtp = await Otp.findOne({ email });
		if (!newOtp) {
			await Otp.create({
				email,
				otp,
			});
		} else await Otp.findOne({ email }).updateOne({ otp });

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log(`Email sent: ${info.response}`);
			}
		});

		await Otp.findOne({ email }).updateOne({ otp });

		return res.status(200).json({ message: "Otp sent successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export default { signup, signin, signOut, verify, resendOtp };
