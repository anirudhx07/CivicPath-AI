const requiredGeminiKeys = ["VITE_GEMINI_API_KEY"] as const;

export type GeminiEnvKey = (typeof requiredGeminiKeys)[number];
export type AppEnvKey = GeminiEnvKey;

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
  const missingGeminiKeys = getMissingKeys(requiredGeminiKeys);

  return {
    isDevelopment: import.meta.env.DEV,
    gemini: {
      requiredKeys: [...requiredGeminiKeys],
      isConfigured: missingGeminiKeys.length === 0,
      missingKeys: missingGeminiKeys,
    },
    hasMissingConfig: missingGeminiKeys.length > 0,
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
