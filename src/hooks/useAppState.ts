import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { AppScreen } from "../types";
import type {
  AccessibilitySettings,
  ActiveQuiz,
  Language,
  Lesson,
  QuizAnswerReview,
  QuizQuestion,
  QuizResultRecord,
  SavedItem,
  TimelineStep,
  UserProfile,
  UserRole,
} from "../types";
import { LESSONS } from "../data/lessons";
import { TIMELINE_STEPS } from "../data/timeline";
import { QUIZ_QUESTIONS, CURRENT_QUIZ_ID } from "../data/quizQuestions";
import { BADGES } from "../data/badges";
import { normalizeQuizOptions } from "../lib/quiz";
import type { AuthResult, LocalAuthUser } from "../services/localAuthService";
import { getCurrentUser, updateCurrentUser } from "../services/localAuthService";
import {
  loadLegacyGuestState,
  loadUserProgress,
  saveUserProgress,
  type StoredUserProgress,
} from "../services/storageService";

const calculateReadinessScore = (
  lessonsCompleted: string[],
  timelineStepsCompleted: string[],
  quizzesCompleted: string[],
  quizScores: Record<string, number>,
) => {
  const lessonWeight = (lessonsCompleted.length / LESSONS.length) * 40;
  const timelineWeight = (timelineStepsCompleted.length / TIMELINE_STEPS.length) * 35;
  const bestQuizScore =
    quizzesCompleted.length > 0
      ? Math.max(...quizzesCompleted.map((quizId) => quizScores[quizId] ?? 0), 0)
      : 0;
  const quizWeight =
    QUIZ_QUESTIONS.length > 0 ? (bestQuizScore / QUIZ_QUESTIONS.length) * 25 : 0;

  return Math.min(Math.round(lessonWeight + timelineWeight + quizWeight), 100);
};

function buildMockQuiz(): ActiveQuiz {
  return {
    id: CURRENT_QUIZ_ID,
    title: "Competency Assessment",
    sourceType: "mock",
    sourceTitle: "Election Readiness",
    questions: QUIZ_QUESTIONS,
  };
}

const defaultAccessibilitySettings: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  voiceExplanations: false,
  readAnswersAloud: false,
  reduceAnimations: false,
  simpleLanguage: false,
  dyslexiaFriendlyFont: false,
};

const getUnlockedBadges = ({
  lessonsCompleted,
  quizzesCompleted,
  quizScores,
  readinessScore,
}: {
  lessonsCompleted: string[];
  quizzesCompleted: string[];
  quizScores: Record<string, number>;
  readinessScore: number;
}) => {
  const unlockedBadges = new Set<string>();

  if (lessonsCompleted.length > 0) unlockedBadges.add("b1");
  if (lessonsCompleted.includes("l2")) unlockedBadges.add("b2");
  if (quizzesCompleted.length > 0) unlockedBadges.add("b3");
  if (lessonsCompleted.includes("l3")) unlockedBadges.add("b4");
  if (
    quizzesCompleted.some(
      (quizId) => (quizScores[quizId] ?? 0) / QUIZ_QUESTIONS.length >= 0.9,
    )
  ) {
    unlockedBadges.add("b6");
  }
  if (readinessScore >= 100) unlockedBadges.add("b7");

  return BADGES.filter((badge) => unlockedBadges.has(badge.id)).map((badge) => badge.id);
};

function buildDefaultUser(): UserProfile {
  const lessonsCompleted = ["l1"];
  const timelineStepsCompleted = ["ts1"];
  const quizScores: Record<string, number> = {};
  const quizzesCompleted: string[] = [];
  const readinessScore = calculateReadinessScore(
    lessonsCompleted,
    timelineStepsCompleted,
    quizzesCompleted,
    quizScores,
  );

  return {
    id: "guest",
    uid: "guest",
    name: "Guest Learner",
    email: null,
    photoURL: null,
    avatar: null,
    avatarUrl: null,
    isAuthenticated: false,
    isGuest: true,
    role: "first-time-voter",
    language: "en",
    readinessScore,
    lessonsCompleted,
    timelineStepsCompleted,
    quizzesCompleted,
    quizScores,
    quizHistory: [],
    badges: getUnlockedBadges({
      lessonsCompleted,
      quizzesCompleted,
      quizScores,
      readinessScore,
    }),
    savedItems: [],
    accessibilitySettings: defaultAccessibilitySettings,
  };
}

function mergeProgress(
  baseUser: UserProfile,
  progress: Partial<StoredUserProgress> | Partial<UserProfile> | null,
): UserProfile {
  if (!progress) {
    return baseUser;
  }

  const lessonsCompleted = progress.lessonsCompleted ?? baseUser.lessonsCompleted;
  const timelineStepsCompleted =
    progress.timelineStepsCompleted ?? baseUser.timelineStepsCompleted;
  const quizzesCompleted = progress.quizzesCompleted ?? baseUser.quizzesCompleted;
  const quizScores = progress.quizScores ?? baseUser.quizScores;
  const readinessScore =
    progress.readinessScore ??
    calculateReadinessScore(
      lessonsCompleted,
      timelineStepsCompleted,
      quizzesCompleted,
      quizScores,
    );

  return {
    ...baseUser,
    role: progress.role ?? baseUser.role,
    language: progress.language ?? baseUser.language,
    readinessScore,
    lessonsCompleted,
    timelineStepsCompleted,
    quizzesCompleted,
    quizScores,
    quizHistory: progress.quizHistory ?? baseUser.quizHistory,
    badges:
      progress.badges ??
      getUnlockedBadges({
        lessonsCompleted,
        quizzesCompleted,
        quizScores,
        readinessScore,
      }),
    savedItems: progress.savedItems ?? baseUser.savedItems,
    accessibilitySettings: {
      ...defaultAccessibilitySettings,
      ...baseUser.accessibilitySettings,
      ...progress.accessibilitySettings,
    },
  };
}

function buildUserFromLocalAuth(
  authUser: LocalAuthUser,
  overrides: Partial<Pick<LocalAuthUser, "role" | "language" | "name">> = {},
): UserProfile {
  const defaultUser = buildDefaultUser();
  const baseUser: UserProfile = {
    ...defaultUser,
    id: authUser.id,
    uid: authUser.id,
    name: overrides.name ?? authUser.name,
    email: authUser.email || null,
    isAuthenticated: !authUser.isGuest,
    isGuest: authUser.isGuest,
    role: overrides.role ?? authUser.role,
    language: overrides.language ?? authUser.language,
  };

  const storedProgress =
    loadUserProgress(authUser.id, authUser.isGuest) ??
    (authUser.isGuest ? loadLegacyGuestState() : null);

  return mergeProgress(baseUser, storedProgress);
}

function buildInitialUser(authUser: LocalAuthUser | null): UserProfile {
  return authUser ? buildUserFromLocalAuth(authUser) : buildDefaultUser();
}

export interface UseAppStateReturn {
  currentScreen: AppScreen;
  user: UserProfile;
  selectedLesson: Lesson;
  selectedTimelineStep: TimelineStep;
  activeQuiz: ActiveQuiz;
  latestQuizScore: number;
  latestQuizTotal: number;
  latestQuizReview: QuizAnswerReview[];
  history: AppScreen[];
  persistenceLoading: boolean;
  persistenceError: string | null;

  navigateTo: (screen: AppScreen) => void;
  goBack: () => void;

  setUser: Dispatch<SetStateAction<UserProfile>>;
  setAuthenticatedUser: (
    authUser: LocalAuthUser,
    overrides?: Partial<Pick<LocalAuthUser, "role" | "language" | "name">>,
  ) => void;
  setGuestUser: (
    authUser: LocalAuthUser,
    overrides?: Partial<Pick<LocalAuthUser, "role" | "language" | "name">>,
  ) => void;
  resetSession: () => void;
  setLanguage: (lang: Language) => void;
  setRole: (role: UserRole) => void;
  updateProgress: (
    lessons: string[],
    timeline: string[],
    quizzes: string[],
    quizScores?: Record<string, number>,
  ) => void;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;

  openLesson: (lessonId: string) => void;
  openTimelineStep: (stepId: string, shouldMarkComplete: boolean) => void;
  startQuiz: (quiz?: ActiveQuiz) => void;
  completeQuiz: (score: number, answers: QuizAnswerReview[]) => void;
  saveItem: (item: SavedItem) => void;
  deleteItem: (itemId: string) => void;
}

export function useAppState(): UseAppStateReturn {
  const [initialAuthUser] = useState<LocalAuthUser | null>(() => getCurrentUser());
  const [hasActiveSession, setHasActiveSession] = useState(() => initialAuthUser !== null);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() =>
    initialAuthUser ? AppScreen.SPLASH : AppScreen.SIGN_IN,
  );
  const [user, setUser] = useState<UserProfile>(() => buildInitialUser(initialAuthUser));
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS[0]?.id ?? "");
  const [selectedTimelineStepId, setSelectedTimelineStepId] = useState<string>(
    TIMELINE_STEPS[0]?.id ?? "",
  );
  const [latestQuizScore, setLatestQuizScore] = useState(0);
  const [latestQuizTotal, setLatestQuizTotal] = useState(QUIZ_QUESTIONS.length);
  const [latestQuizReview, setLatestQuizReview] = useState<QuizAnswerReview[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz>(buildMockQuiz);
  const [history, setHistory] = useState<AppScreen[]>([]);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const persistenceLoading = false;

  const selectedLesson =
    LESSONS.find((lesson) => lesson.id === selectedLessonId) ?? LESSONS[0];
  const selectedTimelineStep =
    TIMELINE_STEPS.find((step) => step.id === selectedTimelineStepId) ?? TIMELINE_STEPS[0];

  const navigateTo = useCallback(
    (screen: AppScreen) => {
      if (screen === currentScreen) {
        return;
      }

      setHistory((prev) => [...prev, currentScreen]);
      setCurrentScreen(screen);
    },
    [currentScreen],
  );

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((p) => p.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen(hasActiveSession ? AppScreen.HOME : AppScreen.ROLE_SELECTION);
    }
  }, [hasActiveSession, history]);

  useEffect(() => {
    if (currentScreen === AppScreen.SPLASH) {
      const timer = setTimeout(
        () => setCurrentScreen(hasActiveSession ? AppScreen.HOME : AppScreen.SIGN_IN),
        2500,
      );
      return () => clearTimeout(timer);
    }
  }, [currentScreen, hasActiveSession]);

  useEffect(() => {
    if (!hasActiveSession) {
      return;
    }

    const saveResult = saveUserProgress(user);
    const sessionResult = updateCurrentUser({
      name: user.name,
      email: user.email ?? "",
      role: user.role,
      language: user.language,
    });

    if (saveResult.ok === false) {
      setPersistenceError(saveResult.error);
      return;
    }

    if (sessionResult.ok === false) {
      setPersistenceError(sessionResult.error);
      return;
    }

    setPersistenceError(null);
  }, [hasActiveSession, user]);

  const updateProgress = useCallback(
    (
      lessons: string[],
      timeline: string[],
      quizzes: string[],
      quizScores = user.quizScores,
    ) => {
      const newScore = calculateReadinessScore(lessons, timeline, quizzes, quizScores);
      const badges = getUnlockedBadges({
        lessonsCompleted: lessons,
        quizzesCompleted: quizzes,
        quizScores,
        readinessScore: newScore,
      });

      setUser((prev) => ({
        ...prev,
        lessonsCompleted: lessons,
        timelineStepsCompleted: timeline,
        quizzesCompleted: quizzes,
        quizScores,
        badges,
        readinessScore: newScore,
      }));
    },
    [user.quizScores],
  );

  const setLanguage = useCallback((lang: Language) => {
    setUser((prev) => ({ ...prev, language: lang }));
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
  }, []);

  const updateAccessibilitySettings = useCallback((settings: Partial<AccessibilitySettings>) => {
    setUser((prev) => ({
      ...prev,
      accessibilitySettings: {
        ...prev.accessibilitySettings,
        ...settings,
      },
    }));
  }, []);

  const setAuthenticatedUser = useCallback(
    (
      authUser: LocalAuthUser,
      overrides: Partial<Pick<LocalAuthUser, "role" | "language" | "name">> = {},
    ) => {
      const sessionResult: AuthResult =
        Object.keys(overrides).length > 0
          ? updateCurrentUser(overrides)
          : { ok: true, user: authUser };
      const nextAuthUser =
        sessionResult.ok === false ? { ...authUser, ...overrides } : sessionResult.user;

      setUser(buildUserFromLocalAuth(nextAuthUser, overrides));
      setHasActiveSession(true);
      setHistory([]);
      setCurrentScreen(AppScreen.HOME);
      setPersistenceError(sessionResult.ok === false ? sessionResult.error : null);
    },
    [],
  );

  const setGuestUser = useCallback(
    (
      authUser: LocalAuthUser,
      overrides: Partial<Pick<LocalAuthUser, "role" | "language" | "name">> = {},
    ) => {
      setAuthenticatedUser(authUser, overrides);
    },
    [setAuthenticatedUser],
  );

  const resetSession = useCallback(() => {
    setHasActiveSession(false);
    setUser(buildDefaultUser());
    setHistory([]);
    setPersistenceError(null);
    setCurrentScreen(AppScreen.SIGN_IN);
  }, []);

  const openLesson = useCallback(
    (lessonId: string) => {
      setSelectedLessonId(lessonId);
      navigateTo(AppScreen.LESSON_DETAIL);
    },
    [navigateTo],
  );

  const startQuiz = useCallback(
    (quiz: ActiveQuiz = buildMockQuiz()) => {
      const normalizedQuiz: ActiveQuiz = {
        ...quiz,
        questions: quiz.questions
          .map((question, index): QuizQuestion => {
            const normalized = normalizeQuizOptions(question.options, question.correctIndex);

            return {
              ...question,
              id: question.id || `${quiz.id}-q${index + 1}`,
              text: question.text.trim(),
              options: normalized.options,
              correctIndex: normalized.correctIndex,
              explanation: question.explanation.trim(),
            };
          })
          .filter((question) => question.text && question.options.length >= 2),
      };

      setActiveQuiz(normalizedQuiz.questions.length > 0 ? normalizedQuiz : buildMockQuiz());
      setLatestQuizReview([]);
      setLatestQuizScore(0);
      setLatestQuizTotal(normalizedQuiz.questions.length || QUIZ_QUESTIONS.length);
      navigateTo(AppScreen.QUIZ_QUESTION);
    },
    [navigateTo],
  );

  const openTimelineStep = useCallback(
    (stepId: string, shouldMarkComplete: boolean) => {
      setSelectedTimelineStepId(stepId);
      if (shouldMarkComplete) {
        updateProgress(
          user.lessonsCompleted,
          Array.from(new Set([...user.timelineStepsCompleted, stepId])),
          user.quizzesCompleted,
        );
      }
      navigateTo(AppScreen.TIMELINE_DETAIL);
    },
    [
      navigateTo,
      updateProgress,
      user.lessonsCompleted,
      user.timelineStepsCompleted,
      user.quizzesCompleted,
    ],
  );

  const completeQuiz = useCallback(
    (score: number, answers: QuizAnswerReview[]) => {
      const totalQuestions = activeQuiz.questions.length || QUIZ_QUESTIONS.length;
      const normalizedScore = Math.round((score / Math.max(totalQuestions, 1)) * QUIZ_QUESTIONS.length);
      const quizScores = { ...user.quizScores, [activeQuiz.id]: normalizedScore };
      const completedAt = new Date().toISOString();
      const record: QuizResultRecord = {
        quizId: activeQuiz.id,
        title: activeQuiz.title,
        sourceType: activeQuiz.sourceType,
        sourceTitle: activeQuiz.sourceTitle,
        score,
        totalQuestions,
        completedAt,
        answers,
      };

      setLatestQuizScore(score);
      setLatestQuizTotal(totalQuestions);
      setLatestQuizReview(answers);
      updateProgress(
        user.lessonsCompleted,
        user.timelineStepsCompleted,
        Array.from(new Set([...user.quizzesCompleted, activeQuiz.id])),
        quizScores,
      );
      setUser((prev) => ({
        ...prev,
        quizHistory: [
          record,
          ...(prev.quizHistory ?? []).filter((item) => item.quizId !== activeQuiz.id),
        ].slice(0, 20),
      }));
      navigateTo(AppScreen.QUIZ_RESULT);
    },
    [
      activeQuiz,
      navigateTo,
      updateProgress,
      user.quizScores,
      user.lessonsCompleted,
      user.timelineStepsCompleted,
      user.quizzesCompleted,
    ],
  );

  const saveItem = useCallback((item: SavedItem) => {
    setUser((prev) =>
      prev.savedItems.some((savedItem) => savedItem.id === item.id)
        ? prev
        : { ...prev, savedItems: [...prev.savedItems, item] },
    );
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    setUser((prev) => ({
      ...prev,
      savedItems: prev.savedItems.filter((item) => item.id !== itemId),
    }));
  }, []);

  return {
    currentScreen,
    user,
    selectedLesson,
    selectedTimelineStep,
    activeQuiz,
    latestQuizScore,
    latestQuizTotal,
    latestQuizReview,
    history,
    persistenceLoading,
    persistenceError,
    navigateTo,
    goBack,
    setUser,
    setAuthenticatedUser,
    setGuestUser,
    resetSession,
    setLanguage,
    setRole,
    updateProgress,
    updateAccessibilitySettings,
    startQuiz,
    openLesson,
    openTimelineStep,
    completeQuiz,
    saveItem,
    deleteItem,
  };
}
