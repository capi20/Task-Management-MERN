// models/task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Please provide title"],
		trim: true
	},
	description: {
		type: String,
		required: [true, "Please provide description"],
		trim: true
	},
	status: {
		type: String,
		default: "ToDo",
		enum: ["Todo", "In Progress", "Done"]
	},
	priority: {
		type: String,
		default: "Low",
		enum: ["Low", "Medium", "High"]
	},
	assignee: {
		type: String
	},
	creator: {
		type: String,
		required: [true, "Creator is required"] // Ensure that creator is required
	},
	dueDate: {
		type: String,
		required: [true, "Due date is required"] // Uncomment if you want dueDate to be required
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

// if no assignee then assign it to creator's name
taskSchema.pre("save", function (next) {
	if (!this.assignee) {
		this.assignee = this.creator;
	}

	next();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
