import faker from "faker";

export const generateTasks = (count) => {
	const statuses = ["Todo", "In Progress", "Done"];
	const priorities = ["Low", "Medium", "High"];

	const tasks = [];

	for (let i = 0; i < count; i++) {
		tasks.push({
			title: faker.lorem.words(3),
			description: faker.lorem.sentences(2),
			status: statuses[Math.floor(Math.random() * statuses.length)],
			priority: priorities[Math.floor(Math.random() * priorities.length)],
			assignee: faker.name.findName(),
			creator: faker.name.findName(),
			dueDate: faker.date.soon().toISOString().split("T")[0], // ISO Date (e.g., 2024-01-01)
			comments: [] // Empty array for now
		});
	}

	return tasks;
};

// Generate and log 100 tasks
const tasks = generateTasks(100);
console.log(tasks);
