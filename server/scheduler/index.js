import { statusList } from "../constants.js";
import Task from "../models/Task.js";
import cron from "node-cron";

let connectedClients = []; // To track connected SSE clients

// SSE Endpoint
export const sendReminders = (req, res) => {
	// Set headers for SSE
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");

	// Add client to the connected list with user info
	const clientInfo = {
		res,
		userEmail: req.user.userEmail // adding user email
	};
	connectedClients.push(clientInfo);

	// Remove client on disconnect
	req.on("close", () => {
		connectedClients = connectedClients.filter(
			(client) => client.res !== res
		);
		res.end();
	});
};

export const startScheduler = () => {
	cron.schedule("*/1 * * * *", async () => {
		console.log("Checking for task reminders...");
		const today = new Date().toISOString().split("T")[0]; // Get today's date

		try {
			// Find tasks due today
			const dueTasks = await Task.find({
				dueDate: today,
				status: { $in: [statusList[0], statusList[1]] }
			});

			if (dueTasks.length > 0) {
				console.log(`Found ${dueTasks.length} tasks due today.`);

				// Group tasks by assignee
				const remindersByAssignee = dueTasks.reduce((acc, task) => {
					acc[task.assignee] = acc[task.assignee] || [];
					acc[task.assignee].push(task);
					return acc;
				}, {});

				// Send reminders to connected clients based on their userEmail
				connectedClients.forEach((client) => {
					const userEmail = client.userEmail;

					// Check if there are reminders for this user
					if (remindersByAssignee[userEmail]) {
						client.res.write(
							`data: ${JSON.stringify(
								remindersByAssignee[userEmail]
							)}\n\n`
						);
					}
				});
			} else {
				console.log("No tasks due today.");
			}
		} catch (error) {
			console.error("Error fetching tasks:", error);
		}
	});
};
