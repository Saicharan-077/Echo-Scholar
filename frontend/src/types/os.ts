export interface PaperSource {
  id: string | number;
  title: string;
  filename: string;
  category: string;
  chunks: number;
  size: string;
  is_processed: boolean;
  created_at: string;
  summary: string;
  authors?: string;
  reading_progress?: number;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  progress: number;
  paperCount: number;
  conceptCount: number;
  noteCount: number;
  updatedAt: string;
  category: string;
}

export interface Workspace {
  id: string;
  title: string;
  template: 'Paper Study' | 'Interview Prep' | 'Literature Review' | 'Exam Revision' | 'Implementation';
  projectId?: string;
  papers: PaperSource[];
  activePaperId: string | number;
  progress: number;
  lastSection: string;
  estimatedReadTimeMinutes: number;
  updatedAt: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  category: 'mastered' | 'learning' | 'gap';
  prerequisites: string[];
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  paperTitle: string;
  section: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface TimelineItem {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  icon: string;
}
