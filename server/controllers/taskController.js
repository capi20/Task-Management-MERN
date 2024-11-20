// controllers/taskController.js
import Comment from "../models/Comment.js";
import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
	try {
		const {
			title,
			description,
			status,
			priority,
			assignee,
			creator,
			dueDate
		} = req.body;
		const task = new Task({
			title,
			description,
			status,
			priority,
			assignee,
			creator,
			dueDate
		});
		await task.save();
		res.status(201).json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
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
		const tasks = await Task.find().skip(skip).limit(limitNumber);

		// Get the total count of tasks
		const totalTasks = await Task.countDocuments();

		// Calculate total pages
		const totalPages = Math.ceil(totalTasks / limitNumber);

		// Return paginated results
		res.status(200).json({
			totalTasks,
			totalPages,
			currentPage: pageNumber,
			tasks
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id).populate("comments");
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}
		res.status(200).json(task);
	} catch (error) {
		res.status(500).json({ message: error.message });
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
		res.status(200).json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}
		await Comment.deleteMany({ taskId: req.params.id });
		res.status(200).json({ message: "Task deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Search tasks by title
export const searchTasks = async (req, res) => {
	const { title, priority, status, page = 1, limit = 10 } = req.query;

	if (!title && !priority && !status) {
		return res
			.status(400)
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

		const tasks = await Task.find(filter).skip(skip).limit(limitNumber);

		// Get the total count of tasks
		const totalTasks = await Task.countDocuments(filter);

		// Calculate total pages
		const totalPages = Math.ceil(totalTasks / limitNumber);

		// Return paginated results
		res.status(200).json({
			totalTasks,
			totalPages,
			currentPage: pageNumber,
			tasks
		});
	} catch (err) {
		res.status(500).json({
			message: "Error searching tasks",
			error: err.message
		});
	}
};
