// controllers/taskController.js
import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import { StatusCodes } from "http-status-codes";
import {
	checkCreatorOrAssigneePermission,
	checkCreatorPermission
} from "../utils/checkPermissions.js";
import User from "../models/User.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

// check due date is not a past date
export const checkDueDate = (dueDate) => {
	const selectedDate = new Date(dueDate);
	const today = new Date();

	today.setHours(0, 0, 0, 0);

	if (selectedDate < today) {
		throw new BadRequestError("Due date can not be a past date.");
	} else {
		return;
	}
};

export const checkAssignee = async (assignee) => {
	let assigneeData = await User.findOne({
		email: assignee.trim().toLowerCase()
	});
	if (!assigneeData) {
		throw new NotFoundError("Please provide a valid assignee email id");
	} else {
		return assigneeData;
	}
};

// Create a new task
export const createTask = async (req, res) => {
	let { assignee, dueDate } = req.body;

	checkDueDate(dueDate);

	const assigneeData = await checkAssignee(assignee);

	const creator = req.user.userEmail;
	const creatorName = req.user.userName;
	const task = new Task({
		...req.body,
		creator,
		creatorName,
		assignee: assigneeData.email,
		assigneeName: assigneeData.name
	});
	await task.save();
	res.status(StatusCodes.CREATED).json(task);
};

// Get all tasks
export const getTasks = async (req, res) => {
	// Extract query parameters
	const {
		page = 1,
		limit = 10,
		title,
		priority,
		status,
		dueDate,
		assignedMe
	} = req.query;

	// Convert page and limit to integers
	const pageNumber = parseInt(page, 10);
	const limitNumber = parseInt(limit, 10);

	// Calculate the number of documents to skip
	const skip = (pageNumber - 1) * limitNumber;

	const userEmail = req.user.userEmail;
	const filter = assignedMe
		? { assignee: userEmail }
		: {
				$or: [{ creator: userEmail }, { assignee: userEmail }]
		  };

	// Apply additional query filters
	if (title) {
		filter.title = { $regex: title, $options: "i" }; // Case-insensitive search
	}

	if (priority) {
		filter.priority = priority; // Exact match
	}

	if (status) {
		filter.status = status; // Exact match
	}

	if (dueDate) {
		filter.dueDate = dueDate; // Exact match
	}

	// Fetch tasks with pagination
	const tasks = await Task.find(filter)
		.sort({ dueDate: 1 })
		.skip(skip)
		.limit(limitNumber);

	// Get the total count of tasks
	const totalTasks = await Task.countDocuments(filter);

	// Calculate total pages
	const totalPages = Math.ceil(totalTasks / limitNumber);

	// Return paginated results
	res.status(StatusCodes.OK).json({
		totalTasks,
		totalPages,
		currentPage: pageNumber,
		tasks
	});
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
	const task = await Task.findById(req.params.id).populate({
		path: "comments",
		options: { sort: { createdAt: -1 } }
	});
	if (!task) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "Task not found" });
	}

	// Ensure the user is either the creator or the assignee of the task
	const userEmail = req.user.userEmail;
	checkCreatorOrAssigneePermission(userEmail, task, "access");
	res.status(StatusCodes.OK).json(task);
};

// Update a task by ID
export const updateTask = async (req, res) => {
	const { assignee, dueDate } = req.body;

	if (dueDate) {
		checkDueDate(dueDate);
	}

	if (assignee) {
		const assigneeData = await checkAssignee(assignee);
		req.body.assigneeName = assigneeData.name;
		req.body.assignee = assigneeData.email;
	}

	const task = await Task.findById(req.params.id);

	if (!task) {
		return res.status(404).json({ message: "Task not found" });
	}

	const userEmail = req.user.userEmail;
	checkCreatorOrAssigneePermission(userEmail, task, "update");

	const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
		new: true
	});
	res.status(StatusCodes.OK).json(updatedTask);
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
	const taskId = req.params.id;

	const task = await Task.findById(taskId);
	if (!task) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "Task not found" });
	}

	checkCreatorPermission(
		req.user.userEmail,
		task.creator,
		"delete this task"
	);

	await Task.deleteOne({ _id: taskId });
	await Comment.deleteMany({ taskId: taskId });

	res.status(StatusCodes.OK).json({
		message: "Task deleted successfully"
	});
};

// Get stats
export const getTaskStats = async (req, res) => {
	const { assignedMe } = req.query;

	const userEmail = req.user.userEmail;

	// Match tasks where the user is either the creator or the assignee
	const matchCondition = assignedMe
		? { assignee: userEmail }
		: {
				$or: [{ creator: userEmail }, { assignee: userEmail }]
		  };

	const priorityStats = await Task.aggregate([
		{ $match: matchCondition },
		{ $group: { _id: "$priority", count: { $sum: 1 } } }
	]);

	const statusStats = await Task.aggregate([
		{ $match: matchCondition },
		{ $group: { _id: "$status", count: { $sum: 1 } } }
	]);

	const priority = priorityStats.reduce((acc, item) => {
		acc[item._id] = item.count;
		return acc;
	}, {});

	const status = statusStats.reduce((acc, item) => {
		acc[item._id] = item.count;
		return acc;
	}, {});

	res.status(StatusCodes.OK).json({ priority, status });
};
