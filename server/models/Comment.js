import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		taskId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Task", // This links the comment to a task
			required: [true, "Task id is required"]
		},
		author: {
			type: String, // You can use userID or username
			required: [true, "Author is required"]
		},
		authorId: {
			type: String, // You can use userID or username
			required: [true, "Author Id is required"],
			select: false
		},
		text: {
			type: String,
			required: [true, "Comment is required"],
			trim: true
		}
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
