// controllers/commentController.js
import { StatusCodes } from "http-status-codes";
import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import checkPermissions from "../utils/checkPermissions.js";

// Add a comment to a task
export const addCommentToTask = async (req, res) => {
	const { text, taskId } = req.body;
	const author = req.user.userName;
	const authorId = req.user.userId;

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
		authorId,
		text
	});

	// Save the comment to the database
	await newComment.save();

	// Add the comment's ObjectId to the task's comments array
	task.comments.push(newComment._id);
	await task.save();

	newComment.authorId = null;
	// Return the newly created comment
	res.status(StatusCodes.CREATED).json(newComment);
};

export const editComment = async (req, res) => {
	const { text, commentId } = req.body; // New text for the comment

	// Check if the comment exists
	const comment = await Comment.findById(commentId).select("+authorId");
	if (!comment) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "Comment not found" });
	}

	checkPermissions(req.user.userId, comment.authorId, "edit this comment");

	// Update the text of the comment
	comment.text = text;
	await comment.save(); // Save the updated comment

	comment.authorId = null;
	// Return the updated comment
	res.status(StatusCodes.OK).json(comment);
};

export const deleteComment = async (req, res) => {
	const taskId = req.params.id;
	const commentId = req.params.commentId;

	const comment = await Comment.findById(commentId).select("+authorId");
	if (!comment) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "Comment not found" });
	}

	checkPermissions(req.user.userId, comment.authorId, "delete this comment");

	// Find the task and remove the comment's ObjectId from the task's comments array

	const task = await Task.findById(taskId);
	if (!task) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: "Task not found" });
	}

	// Remove the comment ID from the task's comments array
	task.comments = task.comments.filter(
		(comment) => comment.toString() !== commentId
	);

	await task.save(); // Save the task with the updated comments array

	await comment.deleteOne({ _id: commentId });

	// Return a success message
	res.status(StatusCodes.NO_CONTENT).json({
		message: "Comment deleted successfully"
	});
};
