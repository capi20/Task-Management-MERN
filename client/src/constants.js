export const taskFields = {
	title: "title",
	description: "description",
	status: "status",
	priority: "priority",
	assignee: "assignee",
	dueDate: "dueDate",
	comment: "comment"
};

export const statusList = ["Todo", "In Progress", "Done"];
export const priorityList = ["Low", "Medium", "High"];

export const NO_TASK =
	"No tasks found. You have not created or been assigned any tasks yet.";
export const SEARCH_NO_TASK =
	"No tasks match your search or filter criteria. Please adjust your filters and try again.";
export const EMAIL_ERROR = "Invalid email format.";
export const PASSWORD_ERROR = "Password must be at least 8 characters long.";
export const REMINDER_TASK =
	"Task Reminder: You have the following tasks due today.";
export const REMINDER_NO_TASK = "Task Reminder: No task due today.";
