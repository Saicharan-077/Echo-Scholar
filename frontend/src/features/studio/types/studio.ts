export type LearningModeId = 
  | 'story_mode'
  | 'debate_mode'
  | 'group_discussion'
  | 'interview_mode'
  | 'literature_review';

export interface LearningModeDefinition {
  id: LearningModeId;
  title: string;
  emoji: string;
  iconName: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  participants: string;
}

export interface LearningStudioConfig {
  language: string;
  duration: string;
  difficulty: string;
  focus: string;
}

export interface LearningSessionPayload {
  paper_id?: number;
  paper_title?: string;
  learning_mode: LearningModeId;
  language: string;
  duration: string;
  difficulty: string;
  focus: string;
}
