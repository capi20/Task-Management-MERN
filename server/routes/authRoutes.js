import express from "express";
import {
	register,
	login,
	getCurrentUser,
	logout,
	updateUser
} from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/updateUser", authenticateUser, updateUser);
router.get("/logout", logout);
router.get("/getCurrentUser", authenticateUser, getCurrentUser);

export default router;
