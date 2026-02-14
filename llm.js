import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({});

export async function getLLMResponse(userText) {
  if (!userText || !userText.trim()) {
    return "Please ask a question.";
  }

  try {
    console.log("Sending request to Gemini with text:", userText);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Answer this question with only a short, crisp response. No extra text, no explanations unless necessary. Only answer what is asked: ${userText}`,
            },
          ],
        },
      ],
    });

    console.log("Response received:", response);

    if (!response.text) {
      throw new Error("Empty Gemini response");
    }

    return response.text.trim();
  } catch (error) {
    console.error("REAL Gemini Error:", error);
    return "AI service is unavailable. Please try again.";
  }
}
