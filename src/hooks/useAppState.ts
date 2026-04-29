import { useEffect, useRef, useState, useCallback, type Dispatch, type SetStateAction } from "react";
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
import type { AuthUser } from "../services/authService";
import { loadState, saveState } from "../services/storageService";
import {
  createOrUpdateUserProfile,
  deleteSavedItem as deleteSavedItemFromFirestore,
  getUserProfile,
  getUserProgress,
  saveBadgeUnlock,
  saveQuizResult,
  saveSavedItem,
  saveUserProgress,
} from "../services/userService";

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

function getPersistenceErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Progress sync failed. Local progress is still available.";
}

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
    uid: "guest",
    name: "Guest",
    email: null,
    photoURL: null,
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

function buildInitialUser(): UserProfile {
  const defaultUser = buildDefaultUser();
  const storedUser = loadState<Partial<UserProfile>>();

  if (!storedUser || storedUser.uid !== "guest") {
    return defaultUser;
  }

  return {
    ...defaultUser,
    ...storedUser,
    uid: "guest",
    email: null,
    photoURL: null,
    avatarUrl: null,
    isAuthenticated: false,
    isGuest: true,
    lessonsCompleted: storedUser.lessonsCompleted ?? defaultUser.lessonsCompleted,
    timelineStepsCompleted:
      storedUser.timelineStepsCompleted ?? defaultUser.timelineStepsCompleted,
    quizzesCompleted: storedUser.quizzesCompleted ?? defaultUser.quizzesCompleted,
    quizScores: storedUser.quizScores ?? defaultUser.quizScores,
    quizHistory: storedUser.quizHistory ?? defaultUser.quizHistory,
    badges: storedUser.badges ?? defaultUser.badges,
    savedItems: storedUser.savedItems ?? defaultUser.savedItems,
    accessibilitySettings: {
      ...defaultAccessibilitySettings,
      ...storedUser.accessibilitySettings,
    },
  };
}

export interface UseAppStateReturn {
  // State
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

  // Navigation
  navigateTo: (screen: AppScreen) => void;
  goBack: () => void;

  // User mutations
  setUser: Dispatch<SetStateAction<UserProfile>>;
  setAuthenticatedUser: (authUser: AuthUser) => void;
  setGuestUser: () => void;
  setLanguage: (lang: Language) => void;
  setRole: (role: UserRole) => void;
  updateProgress: (
    lessons: string[],
    timeline: string[],
    quizzes: string[],
    quizScores?: Record<string, number>,
  ) => void;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;

  // Screen-specific actions
  openLesson: (lessonId: string) => void;
  openTimelineStep: (stepId: string, shouldMarkComplete: boolean) => void;
  startQuiz: (quiz?: ActiveQuiz) => void;
  completeQuiz: (score: number, answers: QuizAnswerReview[]) => void;
  saveItem: (item: SavedItem) => void;
  deleteItem: (itemId: string) => void;
}

export function useAppState(): UseAppStateReturn {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [user, setUser] = useState<UserProfile>(buildInitialUser);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS[0]?.id ?? "");
  const [selectedTimelineStepId, setSelectedTimelineStepId] = useState<string>(
    TIMELINE_STEPS[0]?.id ?? "",
  );
  const [latestQuizScore, setLatestQuizScore] = useState(0);
  const [latestQuizTotal, setLatestQuizTotal] = useState(QUIZ_QUESTIONS.length);
  const [latestQuizReview, setLatestQuizReview] = useState<QuizAnswerReview[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz>(buildMockQuiz);
  const [history, setHistory] = useState<AppScreen[]>([]);
  const [persistenceLoading, setPersistenceLoading] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const loadedFirestoreUidRef = useRef<string | null>(null);
  const lastProgressSignatureRef = useRef<string>("");

  const selectedLesson =
    LESSONS.find((lesson) => lesson.id === selectedLessonId) ?? LESSONS[0];
  const selectedTimelineStep =
    TIMELINE_STEPS.find((step) => step.id === selectedTimelineStepId) ?? TIMELINE_STEPS[0];

  // --- Navigation ---

  const navigateTo = useCallback(
    (screen: AppScreen) => {
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
      setCurrentScreen(AppScreen.HOME);
    }
  }, [history]);

  // Splash auto-advance
  useEffect(() => {
    if (currentScreen === AppScreen.SPLASH) {
      const timer = setTimeout(() => setCurrentScreen(AppScreen.LANGUAGE), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (!user.isAuthenticated || user.uid === "guest") {
      loadedFirestoreUidRef.current = null;
      lastProgressSignatureRef.current = "";
      saveState(user);
    }
  }, [user]);

  useEffect(() => {
    if (!user.isAuthenticated || user.uid === "guest") {
      return;
    }

    if (loadedFirestoreUidRef.current === user.uid) {
      return;
    }

    let cancelled = false;

    async function loadFirestoreUser() {
      setPersistenceLoading(true);
      setPersistenceError(null);

      try {
        await createOrUpdateUserProfile({
          uid: user.uid,
          name: user.name,
          email: user.email,
          photoURL: user.avatarUrl,
          role: user.role,
          language: user.language,
          accessibilitySettings: user.accessibilitySettings,
        });

        const [profile, progress] = await Promise.all([
          getUserProfile(user.uid),
          getUserProgress(user.uid),
        ]);

        if (cancelled) {
          return;
        }

        setUser((prev) => {
          if (prev.uid !== user.uid) {
            return prev;
          }

          return {
            ...prev,
            role: profile?.role ?? prev.role,
            language: profile?.language ?? prev.language,
            readinessScore: progress?.readinessScore ?? prev.readinessScore,
            lessonsCompleted: progress?.lessonsCompleted ?? prev.lessonsCompleted,
            timelineStepsCompleted:
              progress?.timelineStepsCompleted ?? prev.timelineStepsCompleted,
            quizzesCompleted: progress?.quizzesCompleted ?? prev.quizzesCompleted,
            quizScores: progress?.quizScores ?? prev.quizScores,
            badges: progress?.badges ?? prev.badges,
            accessibilitySettings: {
              ...defaultAccessibilitySettings,
              ...prev.accessibilitySettings,
              ...profile?.accessibilitySettings,
            },
          };
        });
      } catch (error) {
        if (!cancelled) {
          const message = getPersistenceErrorMessage(error);
          setPersistenceError(message);
          console.info("[CivicPath] Firestore sync unavailable:", error);
        }
      } finally {
        if (!cancelled) {
          loadedFirestoreUidRef.current = user.uid;
          setPersistenceLoading(false);
        }
      }
    }

    void loadFirestoreUser();

    return () => {
      cancelled = true;
    };
  }, [
    user.avatarUrl,
    user.email,
    user.isAuthenticated,
    user.language,
    user.name,
    user.role,
    user.accessibilitySettings,
    user.uid,
  ]);

  useEffect(() => {
    if (!user.isAuthenticated || user.uid === "guest") {
      return;
    }

    if (loadedFirestoreUidRef.current !== user.uid) {
      return;
    }

    const progress = {
      readinessScore: user.readinessScore,
      lessonsCompleted: user.lessonsCompleted,
      timelineStepsCompleted: user.timelineStepsCompleted,
      quizzesCompleted: user.quizzesCompleted,
      quizScores: user.quizScores,
      badges: user.badges,
      savedItemsCount: user.savedItems.length,
    };
    const signature = JSON.stringify({
      uid: user.uid,
      name: user.name,
      email: user.email,
      photoURL: user.avatarUrl,
      role: user.role,
      language: user.language,
      accessibilitySettings: user.accessibilitySettings,
      progress,
    });

    if (lastProgressSignatureRef.current === signature) {
      return;
    }

    lastProgressSignatureRef.current = signature;
    setPersistenceLoading(true);
    setPersistenceError(null);

    Promise.all([
      createOrUpdateUserProfile({
        uid: user.uid,
        name: user.name,
        email: user.email,
        photoURL: user.avatarUrl,
        role: user.role,
        language: user.language,
        accessibilitySettings: user.accessibilitySettings,
      }),
      saveUserProgress(user.uid, progress),
    ])
      .catch((error) => {
        const message = getPersistenceErrorMessage(error);
        setPersistenceError(message);
        console.info("[CivicPath] Firestore progress save failed:", error);
      })
      .finally(() => setPersistenceLoading(false));
  }, [
    user.avatarUrl,
    user.badges,
    user.email,
    user.isAuthenticated,
    user.language,
    user.accessibilitySettings,
    user.lessonsCompleted,
    user.name,
    user.quizScores,
    user.quizzesCompleted,
    user.readinessScore,
    user.role,
    user.savedItems.length,
    user.timelineStepsCompleted,
    user.uid,
  ]);

  // --- User mutations ---

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
      const newlyUnlockedBadges = badges.filter((badgeId) => !user.badges.includes(badgeId));

      if (user.isAuthenticated && user.uid !== "guest") {
        newlyUnlockedBadges.forEach((badgeId) => {
          void saveBadgeUnlock(user.uid, badgeId).catch((error) => {
            const message = getPersistenceErrorMessage(error);
            setPersistenceError(message);
            console.info("[CivicPath] Badge sync failed:", error);
          });
        });
      }

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
    [user.badges, user.isAuthenticated, user.quizScores, user.uid],
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

  const setAuthenticatedUser = useCallback((authUser: AuthUser) => {
    setUser((prev) => ({
      ...prev,
      uid: authUser.uid,
      name: authUser.name,
      email: authUser.email,
      photoURL: authUser.photoURL,
      avatarUrl: authUser.photoURL,
      isAuthenticated: authUser.isAuthenticated,
      isGuest: false,
    }));
  }, []);

  const setGuestUser = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      uid: "guest",
      name: "Guest",
      email: null,
      photoURL: null,
      avatarUrl: null,
      isAuthenticated: false,
      isGuest: true,
    }));
  }, []);

  // --- Screen-specific actions ---

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
          .filter((question) => question.options.length >= 2)
          .map((question, index): QuizQuestion => ({
            ...question,
            id: question.id || `${quiz.id}-q${index + 1}`,
            options: question.options.slice(0, 4),
            correctIndex:
              question.correctIndex >= 0 && question.correctIndex < question.options.length
                ? question.correctIndex
                : 0,
          })),
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
    [navigateTo, updateProgress, user.lessonsCompleted, user.timelineStepsCompleted, user.quizzesCompleted],
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
      if (user.isAuthenticated && user.uid !== "guest") {
        void saveQuizResult(user.uid, {
          quizId: activeQuiz.id,
          title: activeQuiz.title,
          sourceType: activeQuiz.sourceType,
          sourceTitle: activeQuiz.sourceTitle,
          score,
          totalQuestions,
          readinessScore: calculateReadinessScore(
            user.lessonsCompleted,
            user.timelineStepsCompleted,
            Array.from(new Set([...user.quizzesCompleted, activeQuiz.id])),
            quizScores,
          ),
          answers,
          completedAt,
        }).catch((error) => {
          const message = getPersistenceErrorMessage(error);
          setPersistenceError(message);
          console.info("[CivicPath] Quiz result sync failed:", error);
        });
      }
      navigateTo(AppScreen.QUIZ_RESULT);
    },
    [activeQuiz, navigateTo, updateProgress, user.isAuthenticated, user.quizScores, user.lessonsCompleted, user.timelineStepsCompleted, user.quizzesCompleted, user.uid],
  );

  const saveItem = useCallback((item: SavedItem) => {
    setUser((prev) =>
      prev.savedItems.some((s) => s.id === item.id)
        ? prev
        : { ...prev, savedItems: [...prev.savedItems, item] },
    );
    if (user.isAuthenticated && user.uid !== "guest") {
      void saveSavedItem(user.uid, item).catch((error) => {
        const message = getPersistenceErrorMessage(error);
        setPersistenceError(message);
        console.info("[CivicPath] Saved item sync failed:", error);
      });
    }
  }, [user.isAuthenticated, user.uid]);

  const deleteItem = useCallback((itemId: string) => {
    setUser((prev) => ({
      ...prev,
      savedItems: prev.savedItems.filter((item) => item.id !== itemId),
    }));
    if (user.isAuthenticated && user.uid !== "guest") {
      void deleteSavedItemFromFirestore(user.uid, itemId).catch((error) => {
        const message = getPersistenceErrorMessage(error);
        setPersistenceError(message);
        console.info("[CivicPath] Saved item delete sync failed:", error);
      });
    }
  }, [user.isAuthenticated, user.uid]);

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
