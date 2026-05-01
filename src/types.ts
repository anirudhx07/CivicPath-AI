export const AppScreen = {
  SPLASH: "SPLASH",
  LANGUAGE: "LANGUAGE",
  ONBOARDING: "ONBOARDING",
  ROLE_SELECTION: "ROLE_SELECTION",
  SIGN_IN: "SIGN_IN",
  HOME: "HOME",
  AI_GUIDE: "AI_GUIDE",
  TIMELINE: "TIMELINE",
  TIMELINE_DETAIL: "TIMELINE_DETAIL",
  LEARN: "LEARN",
  LESSON_DETAIL: "LESSON_DETAIL",
  QUIZ_START: "QUIZ_START",
  QUIZ_QUESTION: "QUIZ_QUESTION",
  QUIZ_RESULT: "QUIZ_RESULT",
  QUIZ_REVIEW: "QUIZ_REVIEW",
  MYTH_BUSTER: "MYTH_BUSTER",
  SAVED: "SAVED",
  PROFILE: "PROFILE",
  ACCESSIBILITY: "ACCESSIBILITY",
  TEACHER_TOOLKIT: "TEACHER_TOOLKIT",
  STUDENT_MODE: "STUDENT_MODE",
  SEARCH: "SEARCH",
  NOTIFICATIONS: "NOTIFICATIONS",
  PRIVACY_SAFETY: "PRIVACY_SAFETY",
  REPORT_ISSUE: "REPORT_ISSUE",
  BADGES: "BADGES",
} as const;

export type AppScreen = typeof AppScreen[keyof typeof AppScreen];

export type UserRole = "first-time-voter" | "student" | "teacher" | "citizen" | "volunteer" | "researcher";
export type Language = "en" | "hi" | "bn" | "ta" | "te" | "mr" | "gu" | "kn" | "ml" | "pa";

export interface UserProfile {
  id?: string;
  uid: string;
  name: string;
  email?: string | null;
  photoURL: string | null;
  avatar?: string | null;
  avatarUrl: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  role: UserRole;
  language: Language;
  readinessScore: number;
  lessonsCompleted: string[];
  timelineStepsCompleted: string[];
  quizzesCompleted: string[];
  quizScores: Record<string, number>;
  quizHistory: QuizResultRecord[];
  badges: string[];
  savedItems: SavedItem[];
  accessibilitySettings: AccessibilitySettings;
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  voiceExplanations: boolean;
  readAnswersAloud: boolean;
  reduceAnimations: boolean;
  simpleLanguage: boolean;
  dyslexiaFriendlyFont: boolean;
}

export interface ActiveQuiz {
  id: string;
  title: string;
  sourceType: "mock" | "lesson" | "ai" | "timeline";
  sourceTitle: string;
  questions: QuizQuestion[];
}

export interface QuizAnswerReview {
  question: QuizQuestion;
  selectedIndex: number | null;
  isCorrect: boolean;
}

export interface QuizResultRecord {
  quizId: string;
  title: string;
  sourceType: ActiveQuiz["sourceType"];
  sourceTitle: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  answers: QuizAnswerReview[];
}

export interface SavedItem {
  id: string;
  type: "ai" | "lesson" | "myth" | "quiz";
  title: string;
  date: string;
  category: string;
  data: any;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeEstimate: string;
  category: string;
  sections: { title: string; content: string; id: string }[];
}

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  fullExplanation: string;
  checklist: string[];
  commonQuestions: { q: string; a: string }[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "lesson" | "quiz" | "badge" | "myth" | "system";
  date: string;
  read: boolean;
  link?: AppScreen;
}
