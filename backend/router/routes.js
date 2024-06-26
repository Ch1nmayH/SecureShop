import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
	res.send("Api is running...");
});

router.post("/signup", (req, res) => {
	res.send("Signup route");
});

router.post("/signin", (req, res) => {
	res.send("Signin route");
});

export default router;
