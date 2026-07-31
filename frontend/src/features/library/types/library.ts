export type DocumentLifecycleStatus = 
  | 'UPLOADING'
  | 'PROCESSING'
  | 'VECTORIZED'
  | 'READY_TO_LEARN'
  | 'LEARNING_GENERATED'
  | 'ARCHIVED';

export type LearningMode = 
  | 'story_mode'
  | 'debate_mode'
  | 'group_discussion'
  | 'interview_mode'
  | 'literature_review';

export interface ResearchDocument {
  id: string | number;
  title: string;
  filename: string;
  category: string;
  status: DocumentLifecycleStatus;
  chunks: number;
  size: string;
  indexedAt: string;
  summary: string;
  sessionsCount?: number;
}

export interface LearningSession {
  id: string;
  documentId: string | number;
  paperTitle: string;
  mode: LearningMode;
  modeTitle: string;
  emoji: string;
  language: string;
  difficulty: string;
  progress: number;
  status: 'In Progress' | 'Completed';
  createdAt: string;
  lastStudiedSection?: string;
}
