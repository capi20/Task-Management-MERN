// controllers/taskController.js
import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import { StatusCodes } from "http-status-codes";

// Create a new task
export const createTask = async (req, res) => {
	try {
		const creator = req.user.name;
		const task = new Task({
			...req.body,
			creator
		});
		await task.save();
		res.status(StatusCodes.CREATED).json(task);
	} catch (error) {
		res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
	}
};

// Get all tasks
export const getTasks = async (req, res) => {
	try {
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
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message
		});
	}
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
	try {
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
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message
		});
	}
};

// Update a task by ID
export const updateTask = async (req, res) => {
	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new: true
		});
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}
		res.status(StatusCodes.OK).json(task);
	} catch (error) {
		res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
	}
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "Task not found" });
		}
		await Comment.deleteMany({ taskId: req.params.id });
		res.status(StatusCodes.OK).json({
			message: "Task deleted successfully"
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message
		});
	}
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

	try {
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
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: "Error searching tasks",
			error: err.message
		});
	}
};
