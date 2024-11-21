import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			trim: true
		},
		status: {
			type: String,
			default: "Todo",
			enum: ["Todo", "In Progress", "Done"]
		},
		priority: {
			type: String,
			enum: ["Low", "Medium", "High"],
			required: [true, "Priority is required"]
		},
		assignee: {
			type: String,
			required: [true, "Assignee is required"]
		},
		creator: {
			type: String,
			required: [true, "Creator is required"]
		},
		dueDate: {
			type: String,
			required: [true, "Due date is required"]
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment"
			}
		]
	},
	{ timestamps: true }
);

// if no assignee then assign it to creator's name
// taskSchema.pre("save", function (next) {
// 	if (!this.assignee) {
// 		this.assignee = this.creator;
// 	}

// 	next();
// });

const Task = mongoose.model("Task", taskSchema);

export default Task;
