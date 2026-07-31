import { LearningModeDefinition } from '../types/studio';

export const LEARNING_MODES: LearningModeDefinition[] = [
  {
    id: 'story_mode',
    title: 'Story Mode',
    emoji: '📖',
    iconName: 'BookOpen',
    badge: 'Narrative & Analogies',
    shortDesc: 'Engaging story breakdown',
    fullDesc: 'Explain the research paper as an engaging story using analogies, real-world scenarios, and intuitive narrative arcs.',
    participants: 'Solo Storyteller (Prof. Vox)'
  },
  {
    id: 'debate_mode',
    title: 'Debate Mode',
    emoji: '🗣️',
    iconName: 'MessageSquare',
    badge: 'Dual Researcher Debate',
    shortDesc: 'Skeptic vs Advocate debate',
    fullDesc: 'Two AI researchers discuss the paper, debate core assumptions, methodological strengths, dataset weaknesses, and practical implications.',
    participants: 'Dr. Alex (Advocate) vs Dr. Morgan (Skeptic)'
  },
  {
    id: 'group_discussion',
    title: 'Group Discussion',
    emoji: '👥',
    iconName: 'Users',
    badge: 'Symposium Panel',
    shortDesc: 'Multi-perspective panel',
    fullDesc: 'A panel of AI researchers collaboratively discusses the paper from theoretical, mathematical, and systems engineering perspectives.',
    participants: 'Moderator, Theoretical AI & Systems Expert'
  },
  {
    id: 'interview_mode',
    title: 'Interview Mode',
    emoji: '🎙️',
    iconName: 'Mic',
    badge: 'Podcast Interview',
    shortDesc: 'Author behind-the-scenes',
    fullDesc: 'A podcast host interviews the paper\'s lead author, exploring research motivations, trial-and-error moments, methodology, and future vision.',
    participants: 'Host Jordan & Lead Paper Author'
  },
  {
    id: 'literature_review',
    title: 'Literature Review',
    emoji: '📚',
    iconName: 'Layers',
    badge: 'Academic Synthesis',
    shortDesc: 'Structured baseline comparison',
    fullDesc: 'Present the paper as a formal academic literature review by comparing it with previous work, identifying research gaps, limitations, and trade-offs.',
    participants: 'Senior Academic Analyst'
  }
];

export const LANGUAGE_OPTIONS = [
  'English',
  'Teluglish',
  'Hinglish',
  'Spanish',
  'French',
  'German'
];

export const DURATION_OPTIONS = [
  '5-Min Executive Summary',
  '15-Min Deep Dive',
  '30-Min Masterclass'
];

export const DIFFICULTY_OPTIONS = [
  'Beginner / Undergraduate',
  'Practitioner / Engineer',
  'Researcher / PhD'
];

export const FOCUS_OPTIONS = [
  'General Understanding',
  'Mathematical Formulas',
  'Code & Architecture',
  'Critical Assessment'
];
