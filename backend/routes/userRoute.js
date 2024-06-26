import express from "express";
import userController from "../controllers/userController.js";
import userAuth from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.post("/signout", userController.signOut);

router.post("/verify", userController.verify);
router.post("/resend", userController.resendOtp);

//Get All Users
router.get("/users", userAuth, userController.getUsers);

export default router;
