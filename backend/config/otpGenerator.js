import otpGenerator from "otp-generator";

const otp = ()=>{

	return otpGenerator.generate(6, {
		digits: true,
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});
} 

export default otp;
