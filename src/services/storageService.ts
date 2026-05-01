import type { UserProfile } from "../types";

const LEGACY_STORAGE_KEY = "civicpath-user-state";

export interface StoredUserProgress {
  role: UserProfile["role"];
  language: UserProfile["language"];
  readinessScore: number;
  lessonsCompleted: string[];
  timelineStepsCompleted: string[];
  quizzesCompleted: string[];
  quizScores: UserProfile["quizScores"];
  quizHistory: UserProfile["quizHistory"];
  badges: string[];
  savedItems: UserProfile["savedItems"];
  accessibilitySettings: UserProfile["accessibilitySettings"];
}

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getProgressStorageKey(userId: string, isGuest = false): string {
  return isGuest || userId === "guest"
    ? "civicpath_progress_guest"
    : `civicpath_progress_${userId}`;
}

export function saveUserProgress(user: UserProfile): { ok: true } | { ok: false; error: string } {
  if (!hasStorage()) {
    return { ok: false, error: "Browser storage is unavailable." };
  }

  const progress: StoredUserProgress = {
    role: user.role,
    language: user.language,
    readinessScore: user.readinessScore,
    lessonsCompleted: user.lessonsCompleted,
    timelineStepsCompleted: user.timelineStepsCompleted,
    quizzesCompleted: user.quizzesCompleted,
    quizScores: user.quizScores,
    quizHistory: user.quizHistory,
    badges: user.badges,
    savedItems: user.savedItems,
    accessibilitySettings: user.accessibilitySettings,
  };

  try {
    localStorage.setItem(
      getProgressStorageKey(user.id ?? user.uid, user.isGuest),
      JSON.stringify(progress),
    );
    return { ok: true };
  } catch {
    return { ok: false, error: "Unable to save progress on this device." };
  }
}

export function loadUserProgress(
  userId: string,
  isGuest = false,
): Partial<StoredUserProgress> | null {
  if (!hasStorage()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(getProgressStorageKey(userId, isGuest));
    return raw ? (JSON.parse(raw) as Partial<StoredUserProgress>) : null;
  } catch {
    return null;
  }
}

export function loadLegacyGuestState(): Partial<UserProfile> | null {
  if (!hasStorage()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<UserProfile>) : null;
  } catch {
    return null;
  }
}
