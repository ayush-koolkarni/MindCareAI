//geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from '@env';

// Make sure GEMINI_API_KEY is not undefined
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in your environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};