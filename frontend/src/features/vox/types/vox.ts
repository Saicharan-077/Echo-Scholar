export interface VoxMessageItem {
  role: 'user' | 'assistant';
  text: string;
  citation?: string;
}

export interface VoxGoal {
  title: string;
  estTime: string;
}
