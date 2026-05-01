import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  BookmarkPlus,
  CheckCircle2,
  HelpCircle,
  ScanSearch,
  Share2,
  ShieldAlert,
} from "lucide-react";
import type { SavedItem } from "../types";
import {
  classifyElectionClaim,
  type ElectionClaimClassification,
} from "../services/aiService";

interface MythBusterScreenProps {
  onBack: () => void;
  onAskFollowUp: (question: string) => void;
  onSaveMyth: (item: SavedItem) => void;
  savedItems: SavedItem[];
}

function getBadgeClasses(classification: ElectionClaimClassification["classification"]) {
  switch (classification) {
    case "True":
      return "bg-green-50 text-success border-green-200";
    case "False":
      return "bg-red-50 text-error border-red-200";
    case "Misleading":
      return "bg-amber-50 text-warning border-amber-200";
    case "Needs official verification":
    default:
      return "bg-blue-50 text-accent border-blue-200";
  }
}

function buildShareText(result: ElectionClaimClassification) {
  return `CivicPath Myth Buster\nClaim: ${result.claim}\nClassification: ${result.classification}\nFact: ${result.shortExplanation}\nAction: ${result.citizenAction}`;
}

export const MythBusterScreen = ({
  onBack,
  onAskFollowUp,
  onSaveMyth,
  savedItems,
}: MythBusterScreenProps) => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ElectionClaimClassification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const analyze = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    setShareStatus(null);

    try {
      const report = await classifyElectionClaim(input.trim());
      setResult(report);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The Myth Buster could not analyze this claim right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  const saveMyth = () => {
    if (!result) return;

    onSaveMyth({
      id: `myth-${result.claim.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
      type: "myth",
      title: `${result.classification}: ${result.claim.slice(0, 48)}${
        result.claim.length > 48 ? "..." : ""
      }`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category: "Myth Buster",
      data: result,
    });
  };

  const shareFact = async () => {
    if (!result) return;

    const text = buildShareText(result);
    const nav = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
      clipboard?: Clipboard;
    };

    try {
      if (nav.share) {
        await nav.share({
          title: "CivicPath Myth Buster",
          text,
        });
        setShareStatus("Share sheet opened.");
      } else if (nav.clipboard) {
        await nav.clipboard.writeText(text);
        setShareStatus("Fact copied to clipboard.");
      } else {
        setShareStatus("Sharing is not available in this browser.");
      }
    } catch {
      setShareStatus("Sharing was cancelled or unavailable.");
    }
  };

  const savedId = result
    ? `myth-${result.claim.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`
    : "";
  const isSaved = savedItems.some((item) => item.id === savedId);

  return (
    <div className="screen-shell screen-shell-lg min-h-screen">
      <button onClick={onBack} className="ghost-button mb-6">
        <ArrowLeft size={17} />
        Back
      </button>

      <section className="mb-6 screen-card overflow-hidden p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
          <div className="min-w-0">
            <p className="page-eyebrow">AI Verification</p>
            <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Myth Buster</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Type an election claim and CivicPath will classify it with a neutral explanation,
              related topics, and a reminder to verify current official rules.
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-ink to-indigo p-5 text-white shadow-lg">
            <ScanSearch size={30} />
            <h2 className="mt-5 text-xl font-black">Claim scanner</h2>
            <p className="mt-2 text-sm leading-5 text-white/72">True, false, misleading, or needs verification.</p>
          </div>
        </div>
      </section>

      <section className="screen-card p-5 sm:p-7">
        <label className="block">
          <span className="mb-3 block text-lg font-black text-ink">Type an election claim...</span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Example: Election results are decided by exit polls."
            className="modern-input min-h-[150px] resize-none text-base leading-7"
          />
        </label>
        <button
          type="button"
          onClick={() => void analyze()}
          disabled={loading || !input.trim()}
          className="primary-button mt-4 w-full"
        >
          <ScanSearch size={18} />
          {loading ? "Analyzing claim..." : "Analyze Claim"}
        </button>
      </section>

      {loading && (
        <div className="mt-6 screen-card flex flex-col items-center gap-5 p-8 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-soft-blue">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-accent animate-spin" />
            <Bot className="text-accent" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-ink">AI scanning claim</h2>
            <p className="mt-2 text-sm font-semibold text-muted">
              Checking for civic-process accuracy and official verification needs.
            </p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div
          role="alert"
          className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-bold leading-6 text-error"
        >
          {error}
        </div>
      )}

      {result && !loading && (
        <section className="mt-6 screen-card overflow-hidden p-5 sm:p-7">
          <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="page-eyebrow">Result</p>
              <h2 className="mt-1 text-2xl font-black text-ink">Verification report</h2>
            </div>
            <span
              className={`w-fit rounded-full border px-4 py-2 text-sm font-black ${getBadgeClasses(
                result.classification,
              )}`}
            >
              {result.classification === "Needs official verification"
                ? "Needs Verification"
                : result.classification}
            </span>
          </div>

          <div className="rounded-3xl bg-paper p-5">
            <p className="text-sm font-bold text-muted">Claim</p>
            <p className="mt-2 text-xl font-black leading-8 text-ink">&quot;{result.claim}&quot;</p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {[
              ["Short Explanation", result.shortExplanation, CheckCircle2],
              ["Why People Believe This", result.whyPeopleBelieveThis, HelpCircle],
              ["The Truth", result.truth, ShieldAlert],
              ["Citizen Action", result.citizenAction, ScanSearch],
            ].map(([title, content, Icon]) => {
              const SectionIcon = Icon as typeof CheckCircle2;

              return (
                <section key={title as string} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-soft-blue text-accent">
                      <SectionIcon size={18} />
                    </span>
                    <h3 className="font-black text-ink">{title as string}</h3>
                  </div>
                  <p className="text-sm leading-6 text-muted">{content as string}</p>
                </section>
              );
            })}
          </div>

          {result.relatedTopics.length > 0 && (
            <section className="mt-5 rounded-3xl border border-border bg-soft-blue p-5">
              <h3 className="font-black text-ink">Related lessons</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.relatedTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-bold text-accent"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={saveMyth} className="secondary-button">
              <BookmarkPlus size={17} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() =>
                onAskFollowUp(
                  `Help me understand this election claim in more detail: "${result.claim}"`,
                )
              }
              className="secondary-button"
            >
              <Bot size={17} />
              Ask AI Follow-Up
            </button>
            <button type="button" onClick={() => void shareFact()} className="secondary-button">
              <Share2 size={17} />
              Share
            </button>
          </div>

          {shareStatus && (
            <p className="mt-4 rounded-2xl bg-paper p-3 text-sm font-semibold text-muted">
              {shareStatus}
            </p>
          )}
        </section>
      )}
    </div>
  );
};
