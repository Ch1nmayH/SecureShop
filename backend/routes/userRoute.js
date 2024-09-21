import express from "express";
import userController from "../controllers/userController.js";
import {adminAuth, retailerAuth, auth} from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.post("/signout", userController.signOut);

router.post("/verify", userController.verify);
router.post("/resend", userController.resendOtp);


//Bulk Insert:

router.get("/bulkInsert",  userController.bulkInsert);


//Get All Users
router.get("/users", adminAuth,  userController.getAllUsers);
router.get("/getUsers", adminAuth,  userController.getUsers);
router.get("/getRetailers", adminAuth,  userController.getRetailers);

//checkAuth
router.get("/checkAdminAuth",  userController.checkAdminAuth);
router.get("/checkRetailerAuth",  userController.checkRetailerAuth);
router.get("/checkAuth", userController.checkAuth);

//delete user
router.delete("/deleteUser/:id", adminAuth,  userController.deleteUser);

//update user
router.put("/updateUser/:id", adminAuth,  userController.updateUser);

//Create User
router.post("/createUser", adminAuth,  userController.createUser);

//Change password
router.put("/changePassword", auth,  userController.changePassword);



//get user Address
router.get("/getUserAddress", auth,  userController.getUserAddress);

//add user Address
router.post("/addAddress", auth,  userController.addAddress);
//update user Address
// router.put("/updateAddress", auth,  userController.updateAddress);

export default router;
