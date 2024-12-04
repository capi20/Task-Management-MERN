import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import morgan from "morgan";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
import connectDB from "./db/connect.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

//security
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import rateLimiter from "express-rate-limit";
//routers
import taskRouter from "./routes/taskRoutes.js";
import authRouter from "./routes/authRoutes.js";
import authenticateUser from "./middleware/auth.js";
import { startScheduler } from "./scheduler/index.js";
import generateDescription from "./controllers/genAIController.js";

dotenv.config();
const app = express();

// if (process.env.NODE_ENV !== "production") {
// 	app.use(morgan("dev"));
// }

// current dir path
const __dirname = dirname(fileURLToPath(import.meta.url));

// Create a write stream for the log file
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
	flags: "a" // Append to the file, do not overwrite
});

// Use morgan to log requests in 'combined' format to the file
app.use(morgan("combined", { stream: logStream }));

// API limiter 100 requests per minute
const apiLimiter = rateLimiter({
	windowMs: 1 * 60 * 1000,
	max: 100,
	message: {
		status: 429,
		message: "Too many requests, please try again later."
	}
});

// Allow other domains
app.use(
	cors({
		origin: "http://localhost:5173", // Frontend URL
		credentials: true // Allow cookies
	})
);

app.use(apiLimiter);

app.use(express.static(path.resolve(__dirname, "../client/dist")));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", authenticateUser, taskRouter);
app.post("/api/generate-description", authenticateUser, generateDescription);

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

// start task reminder scheduler
startScheduler();

// Connect to DB and start server
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (err) {
		console.log(err);
	}
};

start();

export default app;
