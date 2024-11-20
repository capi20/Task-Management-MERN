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
import router from "./routes/routes.js";

dotenv.config();
const app = express();

if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
}

// const __dirname = dirname(fileURLToPath(import.meta.url));
// app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use("/api/tasks", router);

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

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
