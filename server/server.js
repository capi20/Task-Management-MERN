import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import morgan from "morgan";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
import connectDB from "./db/connect.js";

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

//routers
import taskRouter from "./routes/taskRoutes.js";
import authRouter from "./routes/authRoutes.js";
import authenticateUser from "./middleware/auth.js";
// import Task from "./models/Task.js";
// import { generateTasks } from "./dummyData.js";

dotenv.config();
const app = express();

if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.use(
	cors({
		origin: "http://localhost:5173", // Frontend URL
		credentials: true // Allow cookies
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use("/api/auth", authRouter);
app.use("/api/tasks", authenticateUser, taskRouter);

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

// const seedDatabase = async () => {
// 	const tasks = generateTasks(100);
// 	await Task.insertMany(tasks);
// 	console.log("Database seeded with 100 tasks");
// };

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		// seedDatabase();
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (err) {
		console.log(err);
	}
};

start();
