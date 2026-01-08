
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client lazily or handle missing key
let ai: any = null;

try {
  const apiKey = process.env.API_KEY; // Defined in vite.config.ts
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
  }
} catch (error) {
  console.error("Error initializing Gemini client:", error);
}

export async function generateContentHelp(type: string, title: string, existingContent: string = "") {
  if (!ai) {
    console.warn("AI Service not initialized due to missing API Key.");
    return "AI Service Unavailable (Missing Configuration)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // Updated to a more stable model name if 'preview' was causing issues, or stick to what worked.
      contents: {
        role: 'user',
        parts: [{
          text: `
            You are a luxury copywriter for Daikin Proshop, an elite HVAC service provider.
            Task: Write or refine a ${type} for "${title}".
            Tone: Professional, Exclusive, Elite, Technical yet accessible.
            Context: Daikin is the world's leading air conditioning manufacturer.
            Current content: ${existingContent}
            Output should be in HTML format (paragraphs, lists).
            Do not include markdown backticks.
          `
        }]
      }
    });

    // Adjust based on the actual response structure of @google/genai v1.34
    // If using the new SDK, response.text() might be a function or propery depending on the version.
    // Based on previous code 'response.text', attempting to keep it compatible but wrapped.
    return response.text ? (typeof response.text === 'function' ? response.text() : response.text) : "No content generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate content. Please try again later.";
  }
}
