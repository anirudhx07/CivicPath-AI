import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const requiredFirebaseKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

type FirebaseEnvKey = (typeof requiredFirebaseKeys)[number];

function readEnvValue(key: FirebaseEnvKey): string {
  return import.meta.env[key]?.trim() ?? "";
}

function isMissingValue(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    !value ||
    normalized.startsWith("your_") ||
    normalized.startsWith("your-") ||
    normalized.startsWith("my_") ||
    normalized.includes("replace_me")
  );
}

const missingFirebaseKeys = requiredFirebaseKeys.filter((key) =>
  isMissingValue(readEnvValue(key)),
);

const firebaseConfigStatus = {
  isConfigured: missingFirebaseKeys.length === 0,
  missingKeys: [...missingFirebaseKeys],
};

const firebaseSetupError = firebaseConfigStatus.isConfigured
  ? null
  : `Firebase is not configured. Add your VITE_FIREBASE_* values in .env. Missing: ${firebaseConfigStatus.missingKeys.join(
      ", ",
    )}. Create a .env file in the project root, copy values from .env.example, then restart npm run dev.`;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (firebaseConfigStatus.isConfigured) {
  const firebaseConfig = {
    apiKey: readEnvValue("VITE_FIREBASE_API_KEY"),
    authDomain: readEnvValue("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnvValue("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: readEnvValue("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnvValue("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnvValue("VITE_FIREBASE_APP_ID"),
  };

  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    app = null;
    auth = null;
    db = null;
    console.error("[CivicPath] Firebase initialization failed:", error);
  }
} else {
  console.info(`[CivicPath] ${firebaseSetupError}`);
}

const isFirebaseConfigured = auth !== null && db !== null;

export {
  app,
  auth,
  db,
  firebaseConfigStatus,
  firebaseSetupError,
  isFirebaseConfigured,
  missingFirebaseKeys,
  app as firebaseApp,
  auth as firebaseAuth,
  db as firebaseDb,
};
