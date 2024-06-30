import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const verifyAuth = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ message: "You are not Authenticated" });
		}

		const verified = jwt.verify(token, process.env.JWT_SECRET);
		if (!verified) {
			return res.status(401).json({ message: "Token Verification Failed" });
		}

		let user = await User.findById({ _id: verified.id });

		if (!user) {
			return res.status(401).json({ message: "User Not Found" });
		}
		if (!user.isVerified) {
			return res.status(401).json({ message: "User Not Verified" });
		}
		if (!user.isAdmin) {
			return res
				.status(401)
				.json({ message: "You need to be admin to view this page" });
		}

		req._id = verified.id;
		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
		next();
	}
};

export default verifyAuth;
