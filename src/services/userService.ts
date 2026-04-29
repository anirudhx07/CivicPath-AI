import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Firestore,
} from "firebase/firestore";
import type { AccessibilitySettings, Language, SavedItem, UserRole } from "../types";
import { db, firebaseSetupError } from "./firebase";

export interface FirestoreUserProfile {
  uid: string;
  name: string;
  email: string | null;
  photoURL: string | null;
  role: UserRole;
  language: Language;
  accessibilitySettings?: AccessibilitySettings;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface FirestoreUserProgress {
  readinessScore: number;
  lessonsCompleted: string[];
  timelineStepsCompleted: string[];
  quizzesCompleted: string[];
  quizScores: Record<string, number>;
  badges: string[];
  savedItemsCount: number;
}

export interface QuizResultInput {
  quizId: string;
  title?: string;
  sourceType?: string;
  sourceTitle?: string;
  score: number;
  totalQuestions: number;
  readinessScore: number;
  answers?: unknown[];
  completedAt?: string;
}

function requireDb(): Firestore {
  if (!db) {
    throw new Error(
      firebaseSetupError ??
        "Firestore is not configured. Add your Firebase Vite environment variables to enable cloud sync.",
    );
  }

  return db;
}

function sanitizeForFirestore<T>(value: T): T {
  if (value === undefined) {
    return null as T;
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

export async function createOrUpdateUserProfile(
  profile: FirestoreUserProfile,
): Promise<void> {
  const firestore = requireDb();
  const userRef = doc(firestore, "users", profile.uid);
  const existingUser = await getDoc(userRef);
  const timestampFields = existingUser.exists()
    ? { updatedAt: serverTimestamp() }
    : { createdAt: serverTimestamp(), updatedAt: serverTimestamp() };

  await setDoc(
    userRef,
    {
      uid: profile.uid,
      name: profile.name,
      email: profile.email,
      photoURL: profile.photoURL,
      role: profile.role,
      language: profile.language,
      accessibilitySettings: profile.accessibilitySettings,
      ...timestampFields,
    },
    { merge: true },
  );
}

export async function getUserProfile(uid: string): Promise<FirestoreUserProfile | null> {
  const firestore = requireDb();
  const snapshot = await getDoc(doc(firestore, "users", uid));

  return snapshot.exists() ? (snapshot.data() as FirestoreUserProfile) : null;
}

export async function saveUserProgress(
  uid: string,
  progress: FirestoreUserProgress,
): Promise<void> {
  const firestore = requireDb();
  const progressRef = doc(firestore, "users", uid, "progressEvents", "current");

  await setDoc(
    progressRef,
    {
      ...progress,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await addDoc(collection(firestore, "users", uid, "progressEvents"), {
    type: "progress_snapshot",
    ...progress,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProgress(uid: string): Promise<FirestoreUserProgress | null> {
  const firestore = requireDb();
  const snapshot = await getDoc(doc(firestore, "users", uid, "progressEvents", "current"));

  return snapshot.exists() ? (snapshot.data() as FirestoreUserProgress) : null;
}

export async function saveSavedItem(uid: string, item: SavedItem): Promise<void> {
  const firestore = requireDb();

  await setDoc(
    doc(firestore, "users", uid, "savedItems", item.id),
    {
      ...sanitizeForFirestore(item),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function deleteSavedItem(uid: string, itemId: string): Promise<void> {
  const firestore = requireDb();

  await deleteDoc(doc(firestore, "users", uid, "savedItems", itemId));
}

export async function saveQuizResult(
  uid: string,
  result: QuizResultInput,
): Promise<void> {
  const firestore = requireDb();

  await setDoc(
    doc(firestore, "users", uid, "quizHistory", result.quizId),
    {
      ...result,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function saveBadgeUnlock(uid: string, badgeId: string): Promise<void> {
  const firestore = requireDb();

  await setDoc(
    doc(firestore, "users", uid, "badges", badgeId),
    {
      badgeId,
      unlockedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
