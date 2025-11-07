import { Modality } from "@google/genai";
import { OutputFormat } from "../types";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';
const imageModelName = 'gemini-2.5-flash-image';

export const GRAPH_KEYWORD = 'GRAPH_NEEDED';

// This function is no longer used for API calls but kept for potential future use.
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

// --- DEMO MOCK FUNCTIONS ---

const mockDetailedSolution = `
  <strong>সমস্যা:</strong> x² - 5x + 6 = 0
  <br/><br/>
  <strong>সমাধান:</strong>
  <p>এটি একটি দ্বিঘাত সমীকরণ। আমরা এটি মধ্যপদ বিশ্লেষণের মাধ্যমে সমাধান করতে পারি:</p>
  <ol class='list-decimal list-inside ml-4'>
    <li>প্রথমে এমন দুটি সংখ্যা বের করতে হবে যাদের গুণফল 6 এবং যোগফল -5। সংখ্যা দুটি হলো -2 এবং -3।</li>
    <li>এখন সমীকরণটি লিখি: x² - 2x - 3x + 6 = 0</li>
    <li>সাধারণ উৎপাদক নেই: x(x - 2) - 3(x - 2) = 0</li>
    <li>পুনরায় সাধারণ উৎপাদক নেই: (x - 2)(x - 3) = 0</li>
    <li>সুতরাং, হয় (x - 2) = 0 অথবা (x - 3) = 0।</li>
  </ol>
  <p><strong>ফলাফল: x = 2, 3</strong></p>
`;

const mockBriefSolution = `
  <strong>সমস্যা:</strong> x² - 5x + 6 = 0
  <br/>
  <strong>ফলাফল: x = 2, 3</strong>
`;

const mockGraphExplanation = `
  <strong>সমস্যা:</strong> y = 2x + 1 এর গ্রাফ আঁক।
  <br/><br/>
  <strong>ব্যাখ্যা:</strong>
  <p>এটি একটি সরলরেখার সমীকরণ।</p>
  <ul class='list-disc list-inside ml-4'>
    <li>এখানে, রেখাটির ঢাল (slope) হলো 2।</li>
    <li>y-অক্ষের ছেদক (y-intercept) হলো 1, অর্থাৎ রেখাটি (0, 1) বিন্দু দিয়ে যায়।</li>
  </ul>
  <p>গ্রাফটি নিচে দেখানো হলো।</p>
`;


export const solveMathProblem = async (
    promptParts: (string | { inlineData: { mimeType: string; data: string } })[],
    format: OutputFormat
): Promise<string> => {
    console.log("DEMO MODE: Simulating API call for solution.");
    
    // Check if the prompt contains graph keywords
    const inputText = promptParts.find(p => typeof p === 'string') as string | undefined;
    const isGraphRequest = inputText && (inputText.includes('গ্রাফ') || inputText.includes('graph') || inputText.includes('plot'));

    return new Promise(resolve => {
        setTimeout(() => {
            if (isGraphRequest) {
                resolve(mockGraphExplanation + `\n\n${GRAPH_KEYWORD}`);
            } else {
                resolve(format === OutputFormat.Detailed ? mockDetailedSolution : mockBriefSolution);
            }
        }, 1500); // Simulate network delay
    });
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
    console.log("DEMO MODE: Simulating API call for graph generation.");

    // Return a static, pre-rendered base64 image of a graph for y=2x+1
    const mockGraphImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGACAMAAAD+3CIkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAABgYGAkJCQICAhISEvP25fsAAAAFdFJOUwAAB2qf6e/b7gAABHNJREFUeF7t2E1yozAQBEB5AIL//+jZgQUCbdhNVU+1tT5uR9MwT4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4-XJmZAAAAAElFTkSuQmCC";

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockGraphImage);
        }, 1000); // Simulate network delay
    });
}