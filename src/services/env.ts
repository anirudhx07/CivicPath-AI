const requiredFirebaseKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

const requiredGeminiKeys = ["VITE_GEMINI_API_KEY"] as const;

export type FirebaseEnvKey = (typeof requiredFirebaseKeys)[number];
export type GeminiEnvKey = (typeof requiredGeminiKeys)[number];
export type AppEnvKey = FirebaseEnvKey | GeminiEnvKey;

function readEnvValue(key: AppEnvKey): string {
  const env = import.meta.env as Record<string, string | undefined>;
  return env[key]?.trim() ?? "";
}

function isMissingValue(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    !value ||
    normalized.startsWith("your_") ||
    normalized.startsWith("your-") ||
    normalized.startsWith("my_") ||
    normalized.startsWith("my-") ||
    normalized.includes("replace_me") ||
    normalized.includes("replace-me")
  );
}

function getMissingKeys<T extends AppEnvKey>(keys: readonly T[]): T[] {
  return keys.filter((key) => isMissingValue(readEnvValue(key)));
}

export function validateEnv() {
  const missingFirebaseKeys = getMissingKeys(requiredFirebaseKeys);
  const missingGeminiKeys = getMissingKeys(requiredGeminiKeys);

  return {
    isDevelopment: import.meta.env.DEV,
    firebase: {
      requiredKeys: [...requiredFirebaseKeys],
      isConfigured: missingFirebaseKeys.length === 0,
      missingKeys: missingFirebaseKeys,
    },
    gemini: {
      requiredKeys: [...requiredGeminiKeys],
      isConfigured: missingGeminiKeys.length === 0,
      missingKeys: missingGeminiKeys,
    },
    hasMissingConfig: missingFirebaseKeys.length > 0 || missingGeminiKeys.length > 0,
  };
}

export function getFirebaseConfigValues(): Record<FirebaseEnvKey, string> | null {
  const envStatus = validateEnv();

  if (!envStatus.firebase.isConfigured) {
    return null;
  }

  return {
    VITE_FIREBASE_API_KEY: readEnvValue("VITE_FIREBASE_API_KEY"),
    VITE_FIREBASE_AUTH_DOMAIN: readEnvValue("VITE_FIREBASE_AUTH_DOMAIN"),
    VITE_FIREBASE_PROJECT_ID: readEnvValue("VITE_FIREBASE_PROJECT_ID"),
    VITE_FIREBASE_STORAGE_BUCKET: readEnvValue("VITE_FIREBASE_STORAGE_BUCKET"),
    VITE_FIREBASE_MESSAGING_SENDER_ID: readEnvValue("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    VITE_FIREBASE_APP_ID: readEnvValue("VITE_FIREBASE_APP_ID"),
  };
}

export function getGeminiApiKey(): string | null {
  const envStatus = validateEnv();

  if (!envStatus.gemini.isConfigured) {
    return null;
  }

  return readEnvValue("VITE_GEMINI_API_KEY");
}

export const envStatus = validateEnv();
