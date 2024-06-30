import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	mobile: { type: Number, required: true, unique: true, maxlength: 10 },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, required: true, default: false },
	isVerified: { type: Boolean, required: true, default: false },
	createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		// console.log("Password Hashed", this.password);
		return next();
	} catch (error) {
		console.log(error);
		throw new Error(error);
		next();
	}
});

userSchema.statics.login = async function (email, password) {
	try {
		const user = await this.findOne({ email });
		if (user) {
			const auth = await bcrypt.compare(password, user.password);
			if (auth) {
				return user;
			}
			throw Error("Incorrect Password");
		} else {
			throw Error("Incorrect Email");
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
