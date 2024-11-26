import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import attachCookies from "../utils/attachCookies.js";

export const register = async (req, res, next) => {
	let { name, email, password } = req.body;

	email = email.toLowerCase();

	const user = await User.create({ name, email, password });
	const token = user.createJWT();
	attachCookies(res, token);
	res.status(StatusCodes.CREATED).json({
		email: user.email,
		name: user.name
	});
};

export const login = async (req, res) => {
	let { email, password } = req.body;

	email = email.toLowerCase();

	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		throw new UnauthenticatedError("Invalid Credentials");
	}

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError("Invalid Credentials");
	}

	const token = user.createJWT();
	user.password = undefined;
	attachCookies(res, token);
	res.status(StatusCodes.OK).json({
		email: user.email,
		name: user.name
	});
};

export const updateUser = async (req, res, next) => {
	const { name, password, email } = req.body;
	const userId = req.user.userId;

	// Email is not editable
	if (email) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: "You can not update email address"
		});
	}

	// Ensure at least one field is provided for update
	if (!name && !password) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: "At least one of 'name' or 'password' must be provided"
		});
	}

	// Find the user by ID
	const user = await User.findById(userId);
	if (!user) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "User not found" });
	}

	// Update fields if provided
	if (name) {
		user.name = name;
	}
	if (password) {
		user.password = password;
	}

	// Save updated user
	await user.save();

	res.status(StatusCodes.OK).json({
		message: "User updated successfully",
		email: user.email,
		name: user.name
	});
};

export const getCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({
		name: req.user.userName,
		email: req.user.userEmail
	});
};

export const logout = async (req, res) => {
	attachCookies(res, "logout", 5 * 1000);

	res.status(StatusCodes.OK).json({ message: "Logged out successfully!" });
};
