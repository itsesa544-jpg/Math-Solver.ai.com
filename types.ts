
export enum InputTab {
  Text = 'text',
  Image = 'image',
}

export enum OutputFormat {
  Detailed = 'detailed',
  Brief = 'brief',
  Direct = 'direct',
}

export interface HistoryItem {
  id: number;
  inputTab: InputTab;
  problemInput: string;
  imagePreview: string | null;
  solution: string;
}
