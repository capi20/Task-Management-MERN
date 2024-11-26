import { ForbiddenError } from "../errors/index.js";

export const checkCreatorPermission = (
	requestUserId,
	resourceUserId,
	action
) => {
	if (requestUserId === resourceUserId.toString()) return;

	throw new ForbiddenError(`You are not authorized to ${action}`);
};

export const checkCreatorOrAssigneePermission = (userEmail, task, action) => {
	if (
		task.creator.toString() !== userEmail &&
		task.assignee.toString() !== userEmail
	) {
		throw new ForbiddenError(
			`You are not authorized to ${action} this task`
		);
	}
};
