import { BadRequestError } from "../errors/index.js";

const checkPermissions = (requestUserId, resourceUserId) => {
	if (requestUserId === resourceUserId.toString()) return;

	throw new BadRequestError("Not authorized to perform this action");
};

export default checkPermissions;
