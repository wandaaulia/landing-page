
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateContentHelp(type: string, title: string, existingContent: string = "") {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are a luxury copywriter for Daikin Proshop, an elite HVAC service provider.
        Task: Write or refine a ${type} for "${title}".
        Tone: Professional, Exclusive, Elite, Technical yet accessible.
        Context: Daikin is the world's leading air conditioning manufacturer.
        Current content: ${existingContent}
        Output should be in HTML format (paragraphs, lists).
      `,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate content. Please try again later.";
  }
}
