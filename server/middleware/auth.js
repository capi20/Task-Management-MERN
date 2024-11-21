import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const auth = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		throw new UnauthenticatedError("Authentication Failed!");
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { userId: payload.userId };
		next();
	} catch (error) {
		throw new UnauthenticatedError("Authentication Failed!");
	}
};

export default auth;
