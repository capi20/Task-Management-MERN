// controllers/commentController.js
import Comment from "../models/Comment.js";
import Task from "../models/Task.js";

// Add a comment to a task
export const addCommentToTask = async (req, res) => {
	const { taskId, author, text } = req.body;

	try {
		// Check if task exists
		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
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
		res.status(201).json(newComment);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
};
