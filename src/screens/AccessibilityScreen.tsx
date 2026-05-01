import { ArrowLeft, Eye, Mic2, Type, Volume2, VolumeX } from "lucide-react";
import type { AccessibilitySettings } from "../types";
import { useSpeech } from "../hooks/useSpeech";

interface AccessibilityScreenProps {
  settings: AccessibilitySettings;
  onChange: (settings: Partial<AccessibilitySettings>) => void;
  onBack: () => void;
}

const settingGroups: Array<{
  title: string;
  icon: typeof Eye;
  items: Array<{
    key: keyof AccessibilitySettings;
    label: string;
    desc: string;
  }>;
}> = [
  {
    title: "Visual",
    icon: Eye,
    items: [
      {
        key: "largeText",
        label: "Large Text",
        desc: "Increase font size for better readability.",
      },
      {
        key: "highContrast",
        label: "High Contrast",
        desc: "Use stronger contrast across the interface.",
      },
      {
        key: "dyslexiaFriendlyFont",
        label: "Dyslexia-Friendly Font",
        desc: "Use a readable sans-serif fallback font stack.",
      },
      {
        key: "reduceAnimations",
        label: "Reduce Animations",
        desc: "Minimize transitions and motion effects.",
      },
    ],
  },
  {
    title: "Voice",
    icon: Mic2,
    items: [
      {
        key: "voiceExplanations",
        label: "Voice Explanations",
        desc: "Use speech for generated explanations when supported.",
      },
      {
        key: "readAnswersAloud",
        label: "Read Answers Aloud",
        desc: "Read AI Guide responses aloud after they appear.",
      },
    ],
  },
  {
    title: "Learning Preferences",
    icon: Type,
    items: [
      {
        key: "simpleLanguage",
        label: "Simple Language",
        desc: "Ask AI features for clearer beginner-friendly wording.",
      },
    ],
  },
];

export const AccessibilityScreen = ({
  settings,
  onChange,
  onBack,
}: AccessibilityScreenProps) => {
  const { canSpeak, isSpeaking, speechError, speak, stopSpeaking } = useSpeech();
  const previewText =
    "Voting Day Reminder. Bring the documents required in your area, follow polling place instructions, and verify local rules with your election authority before voting day.";

  return (
    <div className="screen-shell screen-shell-lg min-h-screen">
      <button onClick={onBack} className="ghost-button mb-6">
        <ArrowLeft size={17} />
        Back
      </button>

      <section className="mb-6">
        <p className="page-eyebrow">Accessibility</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Personalize your learning</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Adjust visual, voice, and AI wording preferences. Existing app logic applies these
          settings across supported screens.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <main className="space-y-5">
          {settingGroups.map((group) => {
            const GroupIcon = group.icon;

            return (
              <section key={group.title} className="screen-card p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-soft-blue text-accent">
                    <GroupIcon size={21} />
                  </span>
                  <h2 className="text-xl font-black text-ink">{group.title}</h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {group.items.map((item) => {
                    const enabled = settings[item.key];

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => onChange({ [item.key]: !enabled })}
                        className={`rounded-3xl border p-4 text-left transition ${
                          enabled
                            ? "border-blue-200 bg-soft-blue"
                            : "border-border bg-white hover:border-accent"
                        }`}
                        aria-pressed={enabled}
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h3 className="font-black text-ink">{item.label}</h3>
                          <span
                            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                              enabled ? "bg-accent" : "bg-slate-200"
                            }`}
                          >
                            <span
                              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                                enabled ? "left-6" : "left-1"
                              }`}
                            />
                          </span>
                        </div>
                        <p className="text-sm leading-6 text-muted">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </main>

        <aside className="screen-card p-5 sm:p-6 lg:sticky lg:top-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-soft-blue text-accent">
              <Eye size={21} />
            </span>
            <div>
              <p className="page-eyebrow">Live preview</p>
              <h2 className="text-xl font-black text-ink">Voting Day Reminder</h2>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-paper p-5">
            <h3 className="font-black text-ink">Bring the right documents</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              Bring the documents required in your area, follow polling place instructions, and
              verify local rules with your election authority before voting day.
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => speak(previewText, { rate: settings.simpleLanguage ? 0.88 : 1 })}
              disabled={!canSpeak}
              className="secondary-button min-h-12 rounded-full px-3 py-2 text-xs"
            >
              <Volume2 size={14} />
              Read
            </button>
            <button
              type="button"
              onClick={stopSpeaking}
              disabled={!isSpeaking}
              className="secondary-button min-h-12 rounded-full px-3 py-2 text-xs"
            >
              <VolumeX size={14} />
              Stop
            </button>
          </div>
          {!canSpeak && (
            <p className="mt-4 text-sm font-semibold text-muted">
              Read-aloud is not supported in this browser.
            </p>
          )}
          {speechError && (
            <p role="alert" className="mt-4 text-sm font-bold text-error">
              {speechError}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
};
