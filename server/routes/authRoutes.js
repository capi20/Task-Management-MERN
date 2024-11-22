import express from "express";
import rateLimiter from "express-rate-limit";
import {
	register,
	login,
	getCurrentUser,
	logout
} from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";

// const apiLimiter = rateLimiter({
// 	windowMs: 15 * 60 * 1000,
// 	max: 10,
// 	message:
// 		"Too many requests from this IP address, please try again after 15 minutes"
// });

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getCurrentUser", authenticateUser, getCurrentUser);

export default router;
