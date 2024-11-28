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

	const task = new Task({
		...req.body,
		assignee: assigneeData._id.toString(),
		creator: req.user.userId
	});
	await task.save();

	task.assignee = undefined;
	task.creator = undefined;
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

	const userId = req.user.userId;
	const filter = assignedMe
		? { assignee: userId }
		: {
				$or: [{ creator: userId }, { assignee: userId }]
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
		.limit(limitNumber)
		.populate("creator", "name email -_id") // Include `name` and `email` from User model
		.populate("assignee", "name email -_id"); // Include `name` and `email` from User model;

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
	const task = await Task.findById(req.params.id)
		.populate("assignee", "email")
		.populate("creator", "email")
		.populate({
			path: "comments",
			options: { sort: { createdAt: -1 } }
		});

	if (!task) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "Task not found" });
	}

	// Ensure the user is either the creator or the assignee of the task
	checkCreatorOrAssigneePermission(
		req.user.userId,
		task.assignee._id,
		task.creator._id,
		"access"
	);

	task.assignee = task.assignee.email;
	task.creator = task.creator.email;

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
		req.body.assignee = assigneeData._id;
	}

	const task = await Task.findById(req.params.id);

	if (!task) {
		return res.status(404).json({ message: "Task not found" });
	}

	checkCreatorOrAssigneePermission(
		req.user.userId,
		task.assignee,
		task.creator,
		"access"
	);

	const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
		new: true
	});

	updatedTask.assignee = undefined;
	updatedTask.creator = undefined;

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

	checkCreatorPermission(req.user.userId, task.creator, "delete this task");

	await Task.deleteOne({ _id: taskId });
	await Comment.deleteMany({ taskId: taskId });

	res.status(StatusCodes.OK).json({
		message: "Task deleted successfully"
	});
};

// Get stats
export const getTaskStats = async (req, res) => {
	const { assignedMe } = req.query;

	// const userId = new mongoose.Types.ObjectId(req.user.userId);
	const userId = req.user.userId;

	// Match tasks where the user is either the creator or the assignee
	const matchCondition = assignedMe
		? { assignee: userId }
		: {
				$or: [{ creator: userId }, { assignee: userId }]
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
