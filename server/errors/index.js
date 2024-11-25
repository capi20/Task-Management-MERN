import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
	constructor(message) {
		super(message);
	}
}

class ForbiddenError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.FORBIDDEN;
	}
}

class BadRequestError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

class NotFoundError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.NOT_FOUND;
	}
}

class UnauthenticatedError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}

export { BadRequestError, NotFoundError, UnauthenticatedError, ForbiddenError };
