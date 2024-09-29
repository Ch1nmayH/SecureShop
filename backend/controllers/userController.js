import user from "../models/userModel.js";
import Otp from "../models/otpModel.js";
import bcrypt from "bcryptjs";
import generateOtp from "../config/otpGenerator.js";
import transporter from "../config/mailTransporter.js";
import jwt from "jsonwebtoken";
import Address from "../models/AddressModel.js";
import ForgotPassword from "../models/forgotPasswordOtp.js";


import dotenv from "dotenv";
dotenv.config();

const signup = async (req, res, next) => {
  const { firstName, lastName, email, mobile, password } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    const existingMobile = await user.findOne({ mobile });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists with this email" });
    }
    if (existingMobile) {
      return res
        .status(200)
        .json({ message: "User already exists with this mobile number" });
    }

    const newUser = await user.create({
      firstName,
      lastName,
      email,
      mobile,
      password,
    });

    const encryptedEmail = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    let otp = generateOtp();
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
    
    const newOtpModel = await Otp.create({
      email,
      otp,
    });
    console.log(newOtpModel);

    return res.status(201).json({
      message:
        "User Created Successfully, an otp has been sent to your email for account activation and email confirmation.",
      otp: otp,
      token: encryptedEmail,
    });
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(200).json({ message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(200).json({ message: "Invalid password" });
    }

    if (existingUser.isVerified) {
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET
      );

      return res
        .status(201)
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
        })
        .json({ user: existingUser, token });
    }

    const userToken = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      } // 1 hour
    );
    return res.status(200).json({
      message: "User not verified, please verify your email first",
      token: userToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const signOut = async (req, res, next) => {
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
  let { token, otp } = req.body;
  otp = parseInt(otp);
  console.log(token, otp);
 
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData) {
      return res.status(200).json({ message: "Invalid token" });
    }
    console.log(decodedData);
    const email = decodedData.email;
    const existingOtp = await Otp.findOne({ email });
    console.log(existingOtp);
    if (existingOtp.verified)
      return res.status(200).json({ message: "Email already verified" });

    if (existingOtp.otp === otp) {
      await Otp.findOne({ email }).updateOne({ verified: true });
      await user.findOne({ email }).updateOne({ isVerified: true });
      return res.status(200).json({ message: "Email Verified Successfully" });
    }
    

    return res.status(200).json({ message: "Invalid OTP" });
  } catch (error) {
    console.log(error.message);
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

    let otp = generateOtp();
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

const getAllUsers = async (req, res) => {
  try {
    const users = await user.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    if (req.query.isRetailer == "true") {
      const users = await user.find({ isRetailer: true });
      return res.status(200).json({ users });
    }

    if (req.query.isAdmin == "false" && req.query.isRetailer == "false") {
      const users = await user.find({ isAdmin: false, isRetailer: false });
      return res.status(200).json({ users });
    }

    const users = await user.find({ isAdmin: false, isRetailer: false });
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRetailers = async (req, res) => {
  try {
    const retailers = await user.find({ isRetailer: true });
    res.status(200).json({ retailers });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const bulkInsert = async (req, res, next) => {
  try {
    const users = req.body;

    // Validate the structure of the users data if needed
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "Invalid user data format" });
    }

    // Insert users into the database
    await user.insertMany(users);
    res.status(200).json({ message: "Users inserted successfully" });
    next();
  } catch (error) {
    console.error("Error inserting users:", error);
    res.status(500).json({ message: "Server error", error });
    next();
  }
};

const checkAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "You are not Authenticated" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: "Token Verification Failed" });
    }

    const email = verified.email;
    let User = await user.findOne({ email });
    // console.log(User);

    if (!User.isAdmin) {
      return res
        .status(401)
        .json({ message: "You need to be admin to view this page" });
    }

    return res.status(200).json({ message: "success" });
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
    next();
  }
};

const checkRetailerAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "You are not Authenticated" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: "Token Verification Failed" });
    }
    const email = verified.email;
    let User = await user.findOne({ email });

    if (!User.isRetailer || !user.isAdmin) {
      return res
        .status(401)
        .json({
          message: "You need to be a retailer or an admin to view this page",
        });
    }
    return res.status(200).json({ message: "success" });

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
    next();
  }
};

const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "You are not Authenticated" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: "Token Verification Failed" });
    }
    return res.status(200).json({ message: "success" });

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
    next();
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await user.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, mobile, password } = req.body;
    await user.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      mobile,
      password,
    });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      isVerified,
      isAdmin,
      isRetailer,
    } = req.body;
    const newUser = await user.create({
      firstName,
      lastName,
      email,
      mobile,
      password,
      isVerified,
      isAdmin,
      isRetailer,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const token = req.cookies.token;
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.id) {
      return res.status(401).json({ message: "You are not authenticated" });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await user.findByIdAndUpdate(verified.id, { password: hashedPassword });
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserAddress = async (req, res) => {
  try {
    const token = req.cookies.token;
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: "You are not authenticated" });
    }
    const id = verified.id;
    const address = await Address.findOne({ user: id });
    console.log(address)
    // console.log(address);
    let addressToString = `${address.name}, ${address.address1}, ${address.address2}, ${address.city}, ${address.state}, ${address.pinCode}`;
    res.status(200).json({ address: addressToString, fullAddress: address });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    // Extract the token from cookies and verify it
    const token = req.cookies.token;
    console.log(req.body);
    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = verified.id; // Extract the user ID from the verified token
    
    // Destructure the address fields from request body
    const { name, address1, address2, city, pinCode, state, mobile } =
      req.body.address;

    // Validate input fields
    if (!name || !address1 || !city || !pinCode || !state || !mobile) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Check if the user already has an address
    let userAddress = await Address.findOne({ user: userId });

    if (userAddress) {
      // If address exists, update it with the new details
      userAddress.name = name;
      userAddress.address1 = address1;
      userAddress.address2 = address2;
      userAddress.city = city;
      userAddress.pinCode = pinCode;
      userAddress.state = state;
      userAddress.mobile = mobile;

      await userAddress.save(); // Save the updated address
      return res
        .status(200)
        .json({
          message: "Address updated successfully",
          address: userAddress,
        });
    } else {
      // If no address exists, create a new one
      const newAddress = new Address({
        user: userId, // Ensure the userId is assigned to the `user` field
        name,
        address1,
        address2,
        city,
        pinCode, // Ensure correct field is used
        state,
        mobile,
      });

      await newAddress.save(); // Save the new address to the database

      return res
        .status(201)
        .json({ message: "Address added successfully", address: newAddress });
    }
  } catch (error) {
    // Handle errors and send a response with an error message
    console.log(error.message);
    console.log(req.body.address.pinCode);
    res
      .status(500)
      .json({ message: `Error adding/updating address: ${error.message}` });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if(!existingUser.isVerified){
      return res.status(400).json({ message: "User not verified" });
    }

    if(existingUser.isAdmin){
      return res.status(400).json({ message: "Admin cannot reset password" });
    }

    if(existingUser.isRetailer){
      return res.status(400).json({ message: "Retailer cannot reset password" });
    }
    let forgotPasswordOtp = generateOtp();

    const alreadyExists = await ForgotPassword.findOne({ email});
    if(alreadyExists){
      await ForgotPassword.findOne({ email }).updateOne({ forgotPasswordOtp });
    }

    else {
      const ForgotPasswordOtpSave = await ForgotPassword.create({
        email,
        forgotPasswordOtp,
      });
    }
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Forgot Password",
      text: `Your OTP reset your password is ${forgotPasswordOtp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

  

    const encryptedEmail = jwt.sign(
      { email: existingUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ message: "Otp sent successfully", token: encryptedEmail });

  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

const forgotPasswordVerify = async (req, res) => {
  let { token, otp } = req.body;
  otp = parseInt(otp);
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData) {
      return res.status(200).json({ message: "Invalid token" });
    }
    console.log(decodedData);
    const email = decodedData.email;
    const existingOtp = await ForgotPassword.findOne({ email });



    if (!existingOtp) {
      return res.status(200).json({ message: "Invalid Email" });
    }

    let randomSecret = Math.floor(1000 + Math.random() * 9000).toString();
    const secret = jwt.sign(
      { secret: randomSecret },
      process.env.JWT_SECRET,
    );
    if (existingOtp.forgotPasswordOtp === otp) {
      const addSecret = await ForgotPassword.updateOne({ email, secret:randomSecret });
      return res.status(200).json({ message: "Otp Verified Successfully", token, secret });
    }
    return res.status(200).json({ message: "Invalid OTP" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

const newPassword = async (req, res) => {
  try {
    const { password, token, secret } = req.body;
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData) {
      return res.status(200).json({ message: "Invalid token" });
    }
    const email = decodedData.email;
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(200).json({ message: "Invalid user" });
    }
    const decodedSecret = jwt.verify(secret, process.env.JWT_SECRET);
    if (!decodedSecret) {
      return res.status(200).json({ message: "Invalid secret" });
    }

    const matchSecret = await ForgotPassword.findOne({ email, secret: decodedSecret.secret });
    if (!matchSecret) {
      return res.status(200).json({ message: "Invalid secret" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await user.findOne({ email }).updateOne({ password: hashedPassword });
    await ForgotPassword.deleteOne({ email });
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export default {
  signup,
  signin,
  signOut,
  verify,
  resendOtp,
  getAllUsers,
  getUsers,
  getRetailers,
  bulkInsert,
  checkAdminAuth,
  checkRetailerAuth,
  checkAuth,
  deleteUser,
  updateUser,
  createUser,
  changePassword,
  getUserAddress,
  addAddress,
  forgotPassword,
  forgotPasswordVerify,
  newPassword,

};
