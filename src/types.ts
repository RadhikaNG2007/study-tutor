export type Subject =
  | 'General'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Computer Science'
  | 'English'
  | 'History'
  | 'Economics';

export type VideoStyle =
  | 'whiteboard'
  | 'animated_teacher'
  | '3d_animation'
  | 'storytelling'
  | 'presentation'
  | 'short_revision';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: Subject;
  mode?: string;
  codeSnippets?: { language: string; code: string }[];
  practiceQuestion?: string;
  hasAudio?: boolean;
}

export interface VideoScene {
  sceneNumber: number;
  title: string;
  durationSec: number;
  narration: string;
  visualStyle: string;
  boardTitle: string;
  keyBullets: string[];
  formulaOrCode?: string;
  visualAction?: string;
  diagramType?: string;
  teacherMood?: 'welcoming' | 'explaining' | 'enthusiastic' | 'focus' | 'celebrating';
}

export interface VideoScript {
  title: string;
  overview: string;
  style: VideoStyle;
  totalDurationSec: number;
  scenes: VideoScene[];
  summaryKeyPoints: string[];
  quizChallenge?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface SavedVideo {
  id: string;
  title: string;
  topic: string;
  subject: Subject;
  style: VideoStyle;
  durationSec: number;
  createdAt: string;
  script: VideoScript;
  thumbnailUrl?: string;
  sourceImage?: string;
  viewsCount?: number;
}

export interface ImageAnalysisResult {
  isAcademic: boolean;
  clarityWarning?: string | null;
  subject: string;
  topic: string;
  extractedText: string;
  explanation: string;
  keyFormulasOrConcepts: string[];
  diagramDescription: string;
  practiceQuestions: string[];
  suggestedVideoTitle: string;
  suggestedVideoHook: string;
  imageBase64?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
  userAnswer?: number;
  isAnswered?: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: Subject;
  mastered: boolean;
  tag?: string;
}

export interface CodeAnalysisResult {
  summary: string;
  lineByLine: {
    line: string;
    lineNumber: number;
    explanation: string;
  }[];
  errorsFound: {
    line: number;
    issue: string;
    fix: string;
  }[];
  correctedCode: string;
  timeComplexity: string;
  spaceComplexity: string;
  practiceChallenge: string;
}

export interface UserStats {
  streakDays: number;
  studyMinutes: number;
  questionsAsked: number;
  videosGenerated: number;
  quizzesCompleted: number;
  quizAccuracy: number;
  flashcardsMastered: number;
}
