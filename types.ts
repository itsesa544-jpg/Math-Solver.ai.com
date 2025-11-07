
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

export interface HistoryItem {
  id: number;
  inputTab: InputTab;
  problemInput: string;
  imagePreview: string | null;
  solution: Solution;
}