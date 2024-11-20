// routes/taskRoutes.js
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

const router = express.Router();

// Create a new task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Search tasks
router.get("/search", searchTasks);

// Get a single task by ID
router.get("/:id", getTaskById);

// Update a task by ID
router.put("/:id", updateTask);

// Delete a task by ID
router.delete("/:id", deleteTask);

// Add comment to a task
router.post("/:id/comments", addCommentToTask);

export default router;
