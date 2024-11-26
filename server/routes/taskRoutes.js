import express from "express";
import {
	createTask,
	getTasks,
	getTaskById,
	updateTask,
	deleteTask,
	getTaskStats
} from "../controllers/taskController.js";
import {
	addCommentToTask,
	deleteComment,
	editComment,
	getTaskCommentsById
} from "../controllers/commentController.js";
import { sendReminders } from "../scheduler/index.js";

const router = express.Router();

// Create a new task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Send task reminders
router.get("/reminders", sendReminders);

// Add comment to a task
router.post("/comments", addCommentToTask);

// Edit a comment by ID
router.put("/comments", editComment);

// Edit a comment by ID
router.get("/getStats", getTaskStats);

// Get a single task by ID
router.get("/:id", getTaskById);

// Update a task by ID
router.put("/:id", updateTask);

// Delete a task by ID
router.delete("/:id", deleteTask);

// Get comments by Task ID
router.get("/:id/comments", getTaskCommentsById);

// Delete a comment by ID
router.delete("/:id/comments/:commentId", deleteComment);

export default router;
