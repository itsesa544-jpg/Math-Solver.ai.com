
export enum InputTab {
  Text = 'text',
  Image = 'image',
}

export enum OutputFormat {
  Detailed = 'detailed',
  Brief = 'brief',
  Direct = 'direct',
}

export interface GraphSolution {
  isGraph: true;
  explanation: string;
  graphImage: string; // base64 data URL
}

export type Solution = string | GraphSolution;

// Fix: Add missing HistoryItem type
export interface HistoryItem {
  id: string;
  problemInput: string;
  imagePreview: string | null;
  solution: Solution;
}
