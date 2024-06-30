import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "s3cureh0p@gmail.com",
		pass: "oqsmonkcwkevuqtl",
	},
});

export default transporter;
