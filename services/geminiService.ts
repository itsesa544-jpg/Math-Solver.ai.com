
import { GoogleGenAI, Modality } from "@google/genai";
import { InputTab, OutputFormat, Solution, GraphSolution } from '../types';

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

const GRAPH_KEYWORD = 'GRAPH_NEEDED';

export const solveMathProblem = async ({ text, image, inputMethod, outputFormat }: SolveParams): Promise<Solution> => {
  const model = 'gemini-2.5-flash';
  
  try {
    if (inputMethod === InputTab.Text) {
      const systemInstructionForText = `You are an expert math tutor. Your responses must be in clear, easy-to-understand Bengali.
        ${getOutputFormatInstruction(outputFormat)}
        Use Markdown for formatting equations and steps where appropriate.
        If the user's request specifically asks to draw a graph (using words like "গ্রাফ আঁক", "draw a graph", "plot"), you MUST append the special keyword "${GRAPH_KEYWORD}" at the very end of your response, on a new line.
        Provide the textual explanation and solution as usual. For example, explain the slope and y-intercept for a line graph. Then, add the keyword.`;
      
      const textResponse = await ai.models.generateContent({
          model,
          contents: text,
          config: {
            systemInstruction: systemInstructionForText,
          },
      });

      let explanation = textResponse.text;

      if (explanation.trim().endsWith(GRAPH_KEYWORD)) {
          explanation = explanation.replace(GRAPH_KEYWORD, '').trim();

          const imageModel = 'gemini-2.5-flash-image';
          const imagePrompt = `Generate a high-quality, clear, and visually appealing graph for the following mathematical problem. The graph should be properly labeled with axes and a title. Problem: "${text}"`;
          
          const imageGenResponse = await ai.models.generateContent({
            model: imageModel,
            contents: {
              parts: [{ text: imagePrompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
          });
          
          const part = imageGenResponse.candidates?.[0]?.content?.parts?.[0];
          if (part && part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            
            const graphSolution: GraphSolution = {
              isGraph: true,
              explanation: explanation,
              graphImage: imageUrl,
            };
            return graphSolution;
          }
      }
      
      return explanation;
    } else if (image) {
      const systemInstruction = `You are an expert math tutor. Your responses must be in clear, easy-to-understand Bengali.
      ${getOutputFormatInstruction(outputFormat)}
      Use Markdown for formatting equations and steps where appropriate.`;
      
      const base64Image = await fileToBase64(image);
      const contents = {
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
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
        },
      });
      return response.text;
    } else {
      throw new Error("No input provided for the problem.");
    }
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get a solution from the AI model.");
  }
};