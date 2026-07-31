import { PaperSource, ConceptNode } from './paper';

export interface ResearchProject {
  id: string;
  title: string;
  category: string;
  currentWorkspace: string;
  currentPaper: string;
  todaysGoal: string;
  lastActivity: string;
  progress: number;
  readTime: string;
  workspaceId: string;
}

export interface Workspace {
  id: string;
  title: string;
  template: 'Literature Review' | 'Interview Prep' | 'Implementation Study' | string;
  currentPaper: string;
  todaysGoal: string;
  progress: number;
  readTime: string;
  lastActivity: string;
  activePaperIndex?: number;
  papers?: PaperSource[];
  concepts?: ConceptNode[];
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  sectionRef: string;
  createdAt: string;
}
