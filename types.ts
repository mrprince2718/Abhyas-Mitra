

export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export interface Message {
  role: Role;
  content: string;
  attachment?: {
    data: string; // Object URL for client-side rendering
    type: string; // MIME type
    name: string;
  };
  sources?: { title: string; uri:string }[];
}

export enum AppMode {
  TEXT = 'text',
  VOICE = 'voice',
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export type Language = 'English' | 'Gujarati';

export interface UserProfile {
  username: string;
  className: string;
  language: Language;
  subject: string;
}

export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizState {
  status: 'configuring' | 'active' | 'finished';
  topic: string;
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: string[];
  score: number;
  startTime: number;
  endTime: number;
}

export interface TodoItem {
  task: string;
  isDone: boolean;
}

export interface TodoListState {
  status: 'input' | 'loading' | 'active';
  rawInput: string;
  items: TodoItem[];
  suggestion: string;
}

export interface StudyStreak {
    streak: number;
    lastCompletedDate: string; // YYYY-MM-DD
}