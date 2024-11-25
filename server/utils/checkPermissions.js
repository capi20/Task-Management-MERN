import { ForbiddenError } from "../errors/index.js";

const checkPermissions = (requestUserId, resourceUserId, action) => {
	if (requestUserId === resourceUserId.toString()) return;

	throw new ForbiddenError(`You are not authorized to ${action}`);
};

export default checkPermissions;
