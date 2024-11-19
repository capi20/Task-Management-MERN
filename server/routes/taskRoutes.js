// routes/taskRoutes.js
import express from "express";
import {
	createTask,
	getTasks,
	getTaskById,
	updateTask,
	deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

// Create a new task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Get a single task by ID
router.get("/:id", getTaskById);

// Update a task by ID
router.put("/:id", updateTask);

// Delete a task by ID
router.delete("/:id", deleteTask);

export default router;
