import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";
import User from "../models/User.js";

const auth = async (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		throw new UnauthenticatedError("Access denied. No token provided.");
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(payload.userId);
		if (!user) {
			throw new UnauthenticatedError(
				"Invalid token. User does not exist."
			);
		}
		req.user = {
			userId: payload.userId,
			userName: user.name
		};
		next();
	} catch (error) {
		throw new UnauthenticatedError("Invalid or expired token");
	}
};

export default auth;
