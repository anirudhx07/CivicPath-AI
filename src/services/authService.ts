import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

export interface AuthUser {
  uid: string;
  name: string;
  email: string | null;
  photoURL: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
}

const GUEST_USER: AuthUser = {
  uid: "guest",
  name: "Guest",
  email: null,
  photoURL: null,
  isAuthenticated: false,
  isGuest: true,
};

function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    name: user.displayName?.trim() || user.email?.split("@")[0] || "Civic Learner",
    email: user.email,
    photoURL: user.photoURL,
    isAuthenticated: true,
    isGuest: false,
  };
}

function getAuthErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }

  return undefined;
}

export function getAuthErrorMessage(error: unknown): string {
  const code = getAuthErrorCode(error);

  switch (code) {
    case "auth/popup-blocked":
      return "Popup was blocked. Please allow popups and try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Google sign-in was cancelled.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Authentication settings.";
    case "auth/configuration-not-found":
    case "auth/invalid-api-key":
    case "auth/app-not-authorized":
      return "Firebase Authentication is not configured correctly. Check your Firebase web app settings and .env values.";
    default:
      if (error instanceof Error && error.message) {
        return error.message;
      }

      return "Google sign-in failed. Please try again.";
  }
}

export async function signInWithGoogle(): Promise<AuthUser> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not configured. Add your VITE_FIREBASE_* values in .env.");
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(auth, provider);

    return mapFirebaseUser(result.user);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function signOutUser(): Promise<void> {
  if (!auth) {
    return;
  }

  await firebaseSignOut(auth);
}

export function listenToAuthChanges(
  onChange: (user: AuthUser | null) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  if (!auth) {
    onChange(null);
    return () => undefined;
  }

  return onAuthStateChanged(
    auth,
    (user) => onChange(user ? mapFirebaseUser(user) : null),
    (error) => onError?.(getAuthErrorMessage(error)),
  );
}

export function getGuestUser(): AuthUser {
  return GUEST_USER;
}
