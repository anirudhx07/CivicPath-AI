import type { AccessibilitySettings } from "../types";
import { useSpeech } from "../hooks/useSpeech";

interface AccessibilityScreenProps {
  settings: AccessibilitySettings;
  onChange: (settings: Partial<AccessibilitySettings>) => void;
  onBack: () => void;
}

const settingRows: Array<{
  key: keyof AccessibilitySettings;
  label: string;
  desc: string;
  icon: string;
}> = [
  {
    key: "largeText",
    label: "Large Text",
    desc: "Increase font size for better readability",
    icon: "format_size",
  },
  {
    key: "highContrast",
    label: "High Contrast",
    desc: "Use stronger contrast across the interface",
    icon: "contrast",
  },
  {
    key: "voiceExplanations",
    label: "Voice Explanations",
    desc: "Use speech for generated explanations when supported",
    icon: "record_voice_over",
  },
  {
    key: "readAnswersAloud",
    label: "Read Answers Aloud",
    desc: "Read AI Guide responses aloud after they appear",
    icon: "volume_up",
  },
  {
    key: "reduceAnimations",
    label: "Reduce Animations",
    desc: "Minimize screen transitions and motion effects",
    icon: "motion_photos_off",
  },
  {
    key: "simpleLanguage",
    label: "Simple Language",
    desc: "Ask AI features for clearer beginner-friendly wording",
    icon: "psychology_alt",
  },
  {
    key: "dyslexiaFriendlyFont",
    label: "Dyslexia-Friendly Font",
    desc: "Use a readable sans-serif fallback font stack",
    icon: "font_download",
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
    <div className="screen-shell screen-shell-sm min-h-screen">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span> Settings
      </button>
      <h2 className="text-4xl font-serif italic font-bold mb-8">Accessibility</h2>

      <div className="border border-border divide-y divide-border mb-12">
        {settingRows.map((item) => {
          const enabled = settings[item.key];

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange({ [item.key]: !enabled })}
              className="w-full p-5 sm:p-8 bg-white flex items-center justify-between gap-4 hover:bg-paper transition-colors text-left"
              aria-pressed={enabled}
            >
              <div className="flex gap-4 sm:gap-6 min-w-0">
                <span className="material-symbols-outlined text-muted">{item.icon}</span>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm tracking-tight">{item.label}</h4>
                  <p className="text-[11px] text-muted uppercase font-bold tracking-widest mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
              <span
                className={`w-12 h-6 relative border border-ink shrink-0 ${
                  enabled ? "bg-ink" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 transition-all ${
                    enabled ? "left-7 bg-white" : "left-1 bg-ink"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>

      <section className="screen-card border-2 border-ink bg-white p-5 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="material-symbols-outlined text-ink">visibility</span>
          <h3 className="text-xl font-serif italic font-bold">Preview</h3>
        </div>
        <p className="text-muted leading-relaxed mb-6">
          This sample text shows how CivicPath explanations will feel with your current settings.
        </p>
        <div className="border border-border bg-paper p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h4 className="font-bold">Voting Day Reminder</h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => speak(previewText, { rate: settings.simpleLanguage ? 0.88 : 1 })}
                disabled={!canSpeak}
                className="w-11 h-11 border border-border bg-white text-ink flex items-center justify-center disabled:opacity-40"
                aria-label="Read preview aloud"
                title={canSpeak ? "Read preview aloud" : "Read-aloud is not supported"}
              >
                <span className="material-symbols-outlined text-base">volume_up</span>
              </button>
              <button
                type="button"
                onClick={stopSpeaking}
                disabled={!isSpeaking}
                className="w-11 h-11 border border-border bg-white text-ink flex items-center justify-center disabled:opacity-40"
                aria-label="Stop speaking"
                title="Stop speaking"
              >
                <span className="material-symbols-outlined text-base">volume_off</span>
              </button>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Bring the documents required in your area, follow polling place instructions, and verify
            local rules with your election authority before voting day.
          </p>
        </div>
        {!canSpeak && (
          <p className="mt-4 text-[10px] uppercase font-bold tracking-widest text-muted">
            Read-aloud is not supported in this browser.
          </p>
        )}
        {speechError && (
          <p role="alert" className="mt-4 text-sm font-bold text-red-600">
            {speechError}
          </p>
        )}
      </section>
    </div>
  );
};
