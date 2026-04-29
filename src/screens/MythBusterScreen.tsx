import { useState } from "react";
import { AppScreen } from "../types";
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
      return "bg-green-700 text-white border-green-700";
    case "False":
      return "bg-red-600 text-white border-red-600";
    case "Misleading":
      return "bg-amber-500 text-ink border-amber-500";
    case "Needs official verification":
    default:
      return "bg-ink text-white border-ink";
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
          : "The Myth Processor could not analyze this claim right now.",
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
    <div className="min-h-screen pt-20 px-8 pb-32 max-w-2xl mx-auto w-full">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span> Return to Desk
      </button>
      <h1 className="text-4xl font-serif italic font-bold mb-4">Myth Processor</h1>
      <p className="text-muted mb-12">
        Submit election-process claims for neutral educational review. Always verify official
        requirements with your local election authority.
      </p>

      <div className="border border-border p-8 mb-12">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter a claim you've heard..."
          className="w-full bg-paper border-none min-h-[120px] focus:ring-0 text-xl font-serif italic mb-6 resize-none"
        />
        <button
          type="button"
          onClick={() => void analyze()}
          disabled={loading || !input.trim()}
          className="w-full py-4 bg-ink text-white font-bold uppercase text-xs tracking-widest hover:bg-black transition-colors disabled:opacity-50"
        >
          {loading ? "Analyzing Source..." : "Cross-Reference Source"}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-6 py-10">
          <div className="w-12 h-12 border-4 border-ink border-t-transparent animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            Reviewing claim with the neutral civic assistant...
          </p>
        </div>
      )}

      {error && !loading && (
        <div role="alert" className="border border-red-200 bg-[#FEF2F2] p-6 text-sm text-red-600 font-bold leading-relaxed mb-8">
          {error}
        </div>
      )}

      {result && !loading && (
        <div className="border border-border p-8 bg-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 border-b border-border pb-4">
            <span className="pill bg-paper text-ink border border-border">Verification Report</span>
            <span
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border ${getBadgeClasses(
                result.classification,
              )}`}
            >
              {result.classification}
            </span>
          </div>

          <h3 className="text-xl font-serif italic mb-8 leading-relaxed">"{result.claim}"</h3>

          <div className="space-y-6">
            {[
              ["Short Explanation", result.shortExplanation],
              ["Why People Believe This", result.whyPeopleBelieveThis],
              ["The Truth", result.truth],
              ["Citizen Action", result.citizenAction],
            ].map(([title, content]) => (
              <section key={title} className="bg-paper p-6 text-sm leading-relaxed border border-border">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-ink mb-3">
                  {title}
                </h4>
                <p className="text-muted">{content}</p>
              </section>
            ))}

            {result.relatedTopics.length > 0 && (
              <section className="bg-paper p-6 border border-border">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-ink mb-4">
                  Related Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.relatedTopics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-2 bg-white border border-border text-[10px] uppercase font-bold tracking-widest text-muted"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={saveMyth}
              className="text-[10px] uppercase font-bold tracking-widest text-accent border-b border-accent"
            >
              {isSaved ? "Saved Myth" : "Save Myth"}
            </button>
            <button
              type="button"
              onClick={() =>
                onAskFollowUp(
                  `Help me understand this election claim in more detail: "${result.claim}"`,
                )
              }
              className="text-[10px] uppercase font-bold tracking-widest text-ink border-b border-ink"
            >
              Ask AI Follow-Up
            </button>
            <button
              type="button"
              onClick={() => void shareFact()}
              className="text-[10px] uppercase font-bold tracking-widest text-muted"
            >
              Share Fact
            </button>
          </div>

          {shareStatus && (
            <p className="mt-4 text-[10px] uppercase font-bold tracking-widest text-muted">
              {shareStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
