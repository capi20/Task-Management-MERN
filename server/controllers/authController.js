import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import attachCookies from "../utils/attachCookies.js";

export const register = async (req, res, next) => {
	const { name, email, password } = req.body;

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
		user: {
			email: user.email,
			name: user.name
		}
	});
};

export const login = async (req, res) => {
	const { email, password } = req.body;

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
	res.status(StatusCodes.OK).json({ user });
};

export const getCurrentUser = async (req, res) => {
	const user = await User.findOne({ _id: req.user.userId });
	res.status(StatusCodes.OK).json({ name: user.name, email: user.email });
};

export const logout = async (req, res) => {
	const cookieOptions = {
		expires: new Date(Date.now() + 5 * 1000),
		httpOnly: true
	};
	if (process.env.NODE_ENV === "production") {
		cookieOptions.secure = true;
		cookieOptions.sameSite = "None";
	}
	res.cookie("token", "logout", cookieOptions);

	res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
