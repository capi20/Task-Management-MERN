// controllers/taskController.js
import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "../utils/checkPermissions.js";
import User from "../models/User.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

// check due date is not a past date
const checkDueDate = (dueDate) => {
	const selectedDate = new Date(dueDate);
	const today = new Date();

	today.setHours(0, 0, 0, 0);

	if (selectedDate < today) {
		throw new BadRequestError("Due date can not be a past date.");
	} else {
		return;
	}
};

const checkAssignee = async (assignee) => {
	let assigneeData = await User.findOne({ email: assignee.toLowerCase() });
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
	const creatorId = req.user.userId;
	const task = new Task({
		...req.body,
		creator,
		creatorName,
		creatorId,
		assignee: assigneeData.email,
		assigneeName: assigneeData.name
	});
	await task.save();
	task.creatorId = null;
	res.status(StatusCodes.CREATED).json(task);
};

// Get all tasks
export const getTasks = async (req, res) => {
	// Extract query parameters
	const { page = 1, limit = 10 } = req.query;

	// Convert page and limit to integers
	const pageNumber = parseInt(page, 10);
	const limitNumber = parseInt(limit, 10);

	// Calculate the number of documents to skip
	const skip = (pageNumber - 1) * limitNumber;

	// Fetch tasks with pagination
	const tasks = await Task.find()
		.sort({ dueDate: 1 })
		.skip(skip)
		.limit(limitNumber);

	// Get the total count of tasks
	const totalTasks = await Task.countDocuments();

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

	const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
		new: true
	});
	if (!task) {
		return res.status(404).json({ message: "Task not found" });
	}
	res.status(StatusCodes.OK).json(task);
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
	const taskId = req.params.id;

	const task = await Task.findById(taskId).select("+creatorId");
	if (!task) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "Task not found" });
	}

	checkPermissions(req.user.userId, task.creatorId);

	await Task.deleteOne({ _id: taskId });
	await Comment.deleteMany({ taskId: taskId });

	res.status(StatusCodes.OK).json({
		message: "Task deleted successfully"
	});
};

// Search tasks by title
export const searchTasks = async (req, res) => {
	const {
		title,
		priority,
		status,
		dueDate,
		assignee,
		page = 1,
		limit = 10
	} = req.query;

	if (!title && !priority && !status && !dueDate && !assignee) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "At least one query parameter is required" });
	}

	const pageNumber = parseInt(page, 10);
	const limitNumber = parseInt(limit, 10);

	const skip = (pageNumber - 1) * limitNumber;

	const filter = {};

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

	if (assignee) {
		filter.assignee = assignee; // Exact match
	}

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
