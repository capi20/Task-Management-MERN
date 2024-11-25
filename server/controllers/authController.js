import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import attachCookies from "../utils/attachCookies.js";

const checkRequired = (reqBody, requiredFields) => {
	const missingFields = requiredFields.filter((field) => !reqBody[field]);

	if (missingFields.length > 0) {
		throw new BadRequestError(
			`The following fields are required: ${missingFields.join(", ")}.`
		);
	}
};

export const register = async (req, res, next) => {
	let { name, email, password } = req.body;

	checkRequired(req.body, ["name", "email", "password"]);

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

	checkRequired(req.body, ["email", "password"]);

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
