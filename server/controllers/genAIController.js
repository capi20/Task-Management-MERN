import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL;

if (!GEMINI_API_KEY || !GEMINI_MODEL) {
	throw new Error("Gemini Pro API configuration is missing.");
}

// POST /generate-description
const generateDescription = async (req, res) => {
	const { prompt } = req.body;

	if (!prompt) {
		return res.status(400).json({ error: "Prompt is required." });
	}

	const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({
		model: GEMINI_MODEL
	});

	try {
		const result = await model.generateContent(
			`Generate a plain text task description without any html markup for ${prompt}`
		);
		const description = result.response.text();
		if (!description) {
			throw new Error("Failed to generate description.");
		}

		res.status(200).json({ description });
	} catch (error) {
		res.status(500).json({ error: "Failed to generate description." });
	}
};

export default generateDescription;
