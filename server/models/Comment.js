import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		taskId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Task", // This links the comment to a task
			required: true
		},
		author: {
			type: String, // You can use userID or username
			required: true
		},
		text: {
			type: String,
			required: true,
			trim: true
		}
		// createdAt: {
		// 	type: Date,
		// 	default: Date.now
		// }
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
