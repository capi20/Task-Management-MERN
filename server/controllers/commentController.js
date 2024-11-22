// controllers/commentController.js
import { StatusCodes } from "http-status-codes";
import Comment from "../models/Comment.js";
import Task from "../models/Task.js";

// Add a comment to a task
export const addCommentToTask = async (req, res) => {
	const { author, text } = req.body;
	const taskId = req.params.id;

	try {
		// Check if task exists
		const task = await Task.findById(taskId);
		if (!task) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "Task not found" });
		}

		// Create a new comment
		const newComment = new Comment({
			taskId,
			author,
			text
		});

		// Save the comment to the database
		await newComment.save();

		// Add the comment's ObjectId to the task's comments array
		task.comments.push(newComment._id);
		await task.save();

		// Return the newly created comment
		res.status(StatusCodes.CREATED).json(newComment);
	} catch (error) {
		console.error(error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: "Server Error"
		});
	}
};
