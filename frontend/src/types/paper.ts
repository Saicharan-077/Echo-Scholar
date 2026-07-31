export interface PaperSource {
  id: number | string;
  title: string;
  filename?: string;
  authors?: string[];
  category?: string;
  chunks?: number;
  size?: string;
  is_processed?: boolean;
  summary?: string;
  created_at?: string;
  raw_text?: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  masteryLevel: number; // 0 - 100
  prerequisites: string[];
}
