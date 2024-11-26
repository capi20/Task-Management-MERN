import mongoose from "mongoose";
import { priorityList, statusList } from "../constants.js";

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
			enum: statusList
		},
		priority: {
			type: String,
			enum: priorityList,
			required: [true, "Priority is required"]
		},
		assignee: {
			type: String,
			required: [true, "Assignee email is required"],
			trim: true
		},
		assigneeName: {
			type: String,
			required: [true, "Assignee name is required"],
			trim: true
		},
		creator: {
			type: String,
			required: [true, "Creator email is required"],
			trim: true
		},
		creatorName: {
			type: String,
			required: [true, "Creator name is required"],
			trim: true
		},
		dueDate: {
			type: String,
			required: [true, "Due date is required"],
			trim: true
		},
		labels: {
			type: [String], // Array of strings for labels/tags
			default: []
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
