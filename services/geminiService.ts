
import { GoogleGenAI } from "@google/genai";
import { InputTab, OutputFormat } from '../types';

// Per coding guidelines, the API key must be read from the `process.env.API_KEY` environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

  // FIX: Refactored content generation to align with Gemini API best practices.
  let contents;

  if (inputMethod === InputTab.Text) {
    contents = text;
  } else if (image) {
    const base64Image = await fileToBase64(image);
    contents = {
      parts: [
        { text: "Solve the math problem shown in the image." },
        {
          inlineData: {
            mimeType: image.type,
            data: base64Image,
          },
        },
      ],
    };
  } else {
    throw new Error("No input provided for the problem.");
  }
  
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
