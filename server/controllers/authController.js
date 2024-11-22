import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import attachCookies from "../utils/attachCookies.js";

export const register = async (req, res, next) => {
	let { name, email, password } = req.body;
	email = email.toLowerCase();

	if (!email || !name || !password) {
		throw new BadRequestError(
			`Please provide ${!name && "Name"} ${!email && "Email"} ${
				!password && "Password"
			}.`
		);
	}

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

	if (!email || !password) {
		throw new BadRequestError(
			`Please provide ${!email && "Email"} ${!password && "Password"}.`
		);
	}
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
