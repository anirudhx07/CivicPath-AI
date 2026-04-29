import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { envStatus, getFirebaseConfigValues } from "./env";

const firebaseConfigStatus = {
  isConfigured: envStatus.firebase.isConfigured,
  missingKeys: [...envStatus.firebase.missingKeys],
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
  const firebaseValues = getFirebaseConfigValues();

  try {
    app = getApps().length > 0
      ? getApp()
      : initializeApp({
          apiKey: firebaseValues?.VITE_FIREBASE_API_KEY,
          authDomain: firebaseValues?.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: firebaseValues?.VITE_FIREBASE_PROJECT_ID,
          storageBucket: firebaseValues?.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: firebaseValues?.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: firebaseValues?.VITE_FIREBASE_APP_ID,
        });
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
const missingFirebaseKeys = firebaseConfigStatus.missingKeys;

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
