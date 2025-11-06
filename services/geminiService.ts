
import { GoogleGenAI } from "@google/genai";
import { InputTab, OutputFormat } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please provide a valid API key for the app to function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

interface SolveParams {
  text: string;
  image: File | null;
  inputMethod: InputTab;
  outputFormat: OutputFormat;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const getOutputFormatInstruction = (format: OutputFormat) => {
    switch (format) {
        case OutputFormat.Detailed:
            return "Provide a step-by-step detailed solution.";
        case OutputFormat.Brief:
            return "Provide a brief and concise solution.";
        case OutputFormat.Direct:
            return "Provide only the final answer without any explanation.";
        default:
            return "Provide a step-by-step detailed solution.";
    }
}


export const solveMathProblem = async ({ text, image, inputMethod, outputFormat }: SolveParams): Promise<string> => {
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `You are an expert math tutor. Your responses must be in clear, easy-to-understand Bengali.
${getOutputFormatInstruction(outputFormat)}
Use Markdown for formatting equations and steps where appropriate.`;

  const promptParts: (string | { inlineData: { mimeType: string; data: string } })[] = [];

  if (inputMethod === InputTab.Text) {
    promptParts.push(text);
  } else if (image) {
    promptParts.push("Solve the math problem shown in the image.");
    const base64Image = await fileToBase64(image);
    promptParts.push({
      inlineData: {
        mimeType: image.type,
        data: base64Image,
      },
    });
  } else {
    throw new Error("No input provided for the problem.");
  }
  
  const contents = { parts: promptParts.map(p => typeof p === 'string' ? {text: p} : p) };

  try {
    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
        },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get a solution from the AI model.");
  }
};
