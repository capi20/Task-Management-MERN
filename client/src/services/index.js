import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateDescription = async (prompt) => {
	if (!prompt) {
		return "Prompt is required.";
	}

	const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({
		model: import.meta.env.VITE_GEMINI_MODEL
	});

	try {
		const result = await model.generateContent(
			`Generate a plain text task description without any html markup for ${prompt}`
		);
		const description = result.response.text();
		if (!description) {
			throw new Error("Failed to generate description.");
		}
		return description;
	} catch (error) {
		throw new Error("Failed to generate description.");
	}
};
