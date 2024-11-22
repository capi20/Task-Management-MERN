import express from "express";
import {
	createTask,
	getTasks,
	getTaskById,
	updateTask,
	deleteTask,
	searchTasks
} from "../controllers/taskController.js";
import { addCommentToTask } from "../controllers/commentController.js";
import { sendReminders } from "../scheduler/index.js";

const router = express.Router();

// Create a new task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Search tasks by title, priority, status and due date
router.get("/search", searchTasks);

// Send task reminders
router.get("/reminders", sendReminders);

// Get a single task by ID
router.get("/:id", getTaskById);

// Update a task by ID
router.put("/:id", updateTask);

// Delete a task by ID
router.delete("/:id", deleteTask);

// Add comment to a task
router.post("/:id/comments", addCommentToTask);

export default router;
