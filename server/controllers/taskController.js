// controllers/taskController.js
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
		const tasks = await Task.find();
		res.status(200).json(tasks);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
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
		res.status(200).json({ message: "Task deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
