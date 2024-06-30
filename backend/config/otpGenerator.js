import otpGenerator from "otp-generator";

const otp = otpGenerator.generate(6, {
	digits: true,
	lowerCaseAlphabets: false,
	upperCaseAlphabets: false,
	specialChars: false,
});

export default otp;
