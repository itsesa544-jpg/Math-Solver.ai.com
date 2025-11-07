import { GoogleGenAI, Modality } from "@google/genai";
import { OutputFormat } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';
const imageModelName = 'gemini-2.5-flash-image';

export const GRAPH_KEYWORD = 'GRAPH_NEEDED';

const getSystemInstruction = (format: OutputFormat): string => {
  const detailLevel = format === OutputFormat.Detailed
    ? 'Provide a step-by-step detailed solution.'
    : 'Provide a brief, direct answer.';
  
  return `You are an expert math tutor. Your responses must be in clear, easy-to-understand Bengali.
${detailLevel}
Use Markdown for formatting equations and steps where appropriate.
If the user's request specifically asks to draw a graph (using words like "গ্রাফ আঁক", "draw a graph", "plot"), you MUST append the special keyword "${GRAPH_KEYWORD}" at the very end of your response, on a new line.
Provide the textual explanation and solution as usual. For example, explain the slope and y-intercept for a line graph. Then, add the keyword.`;
};

export const solveMathProblem = async (
    promptParts: (string | { inlineData: { mimeType: string; data: string } })[],
    format: OutputFormat
): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: promptParts,
            config: {
                systemInstruction: getSystemInstruction(format),
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("AI solution generation failed.");
    }
};

export const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateGraphFromText = async (problemText: string): Promise<string> => {
    try {
        const prompt = `Please generate a clear, simple, and accurate graph for the following mathematical problem. The graph should be the primary focus. Do not add any extra text or labels outside of the graph's own axes and lines. Problem: "${problemText}"`;

        const response = await ai.models.generateContent({
            model: imageModelName,
            contents: prompt,
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && firstPart.inlineData) {
            const base64Data = firstPart.inlineData.data;
            const mimeType = firstPart.inlineData.mimeType;
            return `data:${mimeType};base64,${base64Data}`;
        } else {
            throw new Error("No image data received from the API.");
        }
    } catch (error) {
        console.error("Error calling Gemini Image API:", error);
        throw new Error("AI graph generation failed.");
    }
}