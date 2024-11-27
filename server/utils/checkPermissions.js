import { ForbiddenError } from "../errors/index.js";

export const checkCreatorPermission = (
	requestUserId,
	resourceUserId,
	action
) => {
	if (requestUserId === resourceUserId.toString()) return;

	throw new ForbiddenError(`You are not authorized to ${action}`);
};

export const checkCreatorOrAssigneePermission = (
	userId,
	assigneeId,
	creatorId,
	action
) => {
	if (assigneeId.toString() !== userId && creatorId.toString() !== userId) {
		throw new ForbiddenError(
			`You are not authorized to ${action} this task`
		);
	}
};
