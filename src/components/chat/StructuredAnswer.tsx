import { AlertCircle, CheckCircle2, Lightbulb, ListChecks, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { CivicAnswerResult } from "../../services/aiService";
import { ReadableText } from "./ReadableText";

interface StructuredAnswerProps {
  answer?: CivicAnswerResult;
  content: string;
  messageId: string;
  isSpeaking?: boolean;
  speakingMessageId?: string | null;
  highlightedCharIndex?: number | null;
  highlightedCharLength?: number | null;
  onFollowUp?: (question: string) => void;
  followUpDisabled?: boolean;
}

function parseMaybeStructured(content: string): CivicAnswerResult | null {
  const trimmed = content.trim();

  if (!trimmed.startsWith("{")) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed) as Partial<CivicAnswerResult>;
    if (typeof parsed.answer !== "string") {
      return null;
    }

    return {
      answer: parsed.answer,
      summary: parsed.summary ?? parsed.answer,
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      example: parsed.example,
      safetyNote: parsed.safetyNote ?? "Verify current rules with your local election authority.",
      followUps: Array.isArray(parsed.followUps) ? parsed.followUps : [],
      relatedTopics: Array.isArray(parsed.relatedTopics) ? parsed.relatedTopics : [],
      confidence:
        parsed.confidence === "high" || parsed.confidence === "medium" || parsed.confidence === "low"
          ? parsed.confidence
          : "medium",
      needsOfficialVerification: parsed.needsOfficialVerification ?? true,
      usedFallback: parsed.usedFallback,
      fallbackReason: parsed.fallbackReason,
    };
  } catch {
    return null;
  }
}

function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-paper/70 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
          {icon}
        </span>
        <h3 className="text-sm font-black text-ink">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function StructuredAnswer({
  answer,
  content,
  messageId,
  isSpeaking = false,
  speakingMessageId = null,
  highlightedCharIndex = null,
  highlightedCharLength = null,
  onFollowUp,
  followUpDisabled = false,
}: StructuredAnswerProps) {
  const structured = answer ?? parseMaybeStructured(content);

  if (!structured) {
    return (
      <ReadableText
        text={content}
        messageId={messageId}
        isSpeaking={isSpeaking}
        speakingMessageId={speakingMessageId}
        highlightedCharIndex={highlightedCharIndex}
        highlightedCharLength={highlightedCharLength}
      />
    );
  }

  const keyPoints = structured.keyPoints.filter(Boolean);
  const steps = structured.steps?.filter(Boolean) ?? [];
  const relatedTopics = structured.relatedTopics.filter(Boolean);
  const followUps = structured.followUps.filter(Boolean);

  return (
    <div className="space-y-4">
      {structured.fallbackReason && (
        <div className="flex items-start gap-2 rounded-2xl border border-blue-100 bg-soft-blue p-3 text-xs font-bold leading-5 text-accent">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{structured.fallbackReason}</span>
        </div>
      )}

      <ReadableText
        text={structured.answer}
        messageId={messageId}
        isSpeaking={isSpeaking}
        speakingMessageId={speakingMessageId}
        highlightedCharIndex={highlightedCharIndex}
        highlightedCharLength={highlightedCharLength}
      />

      {keyPoints.length > 0 && (
        <Section icon={<CheckCircle2 size={16} />} title="Key Points">
          <ul className="space-y-2">
            {keyPoints.map((point) => (
              <li key={point} className="flex gap-2 text-sm leading-6 text-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {steps.length > 0 && (
        <Section icon={<ListChecks size={16} />} title="Steps">
          <ol className="space-y-2">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-muted">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-accent">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {structured.example && (
        <Section icon={<Lightbulb size={16} />} title="Example">
          <p className="text-sm leading-6 text-muted">{structured.example}</p>
        </Section>
      )}

      {structured.safetyNote && (
        <Section icon={<ShieldCheck size={16} />} title="Official Check">
          <p className="text-sm leading-6 text-muted">{structured.safetyNote}</p>
        </Section>
      )}

      {relatedTopics.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-muted">
            <Sparkles size={14} className="text-accent" />
            Related Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-blue-100 bg-soft-blue px-3 py-1.5 text-xs font-bold text-accent"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {followUps.length > 0 && onFollowUp && (
        <div>
          <p className="mb-2 text-xs font-black uppercase text-muted">Ask Next</p>
          <div className="flex flex-wrap gap-2">
            {followUps.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onFollowUp(question)}
                disabled={followUpDisabled}
                className="min-h-10 rounded-full border border-blue-100 bg-white px-3 py-2 text-left text-xs font-bold leading-5 text-accent shadow-sm transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
