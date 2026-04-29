import { envStatus } from "../services/env";

export function DevSetupBanner() {
  if (!envStatus.isDevelopment || !envStatus.hasMissingConfig) {
    return null;
  }

  const firebaseMissing = envStatus.firebase.missingKeys.length > 0;
  const geminiMissing = envStatus.gemini.missingKeys.length > 0;

  return (
    <aside className="fixed left-4 right-4 bottom-[calc(var(--mobile-bottom-nav-height)+1rem)] lg:left-auto lg:bottom-4 z-[100] max-w-sm border border-ink bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)] p-4 pointer-events-none">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-ink text-lg">settings_alert</span>
        <div>
          <p className="text-[10px] uppercase font-black tracking-widest text-ink">
            Development Setup
          </p>
          <p className="text-xs leading-relaxed text-muted mt-2">
            {firebaseMissing && "Firebase config is missing. Google login and Firestore sync need setup. "}
            {geminiMissing && "Gemini API key is missing. AI features will use local fallback responses. "}
            Create `.env` from `.env.example`, fill the values, then restart `npm run dev`.
          </p>
        </div>
      </div>
    </aside>
  );
}
