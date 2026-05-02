import { useMemo, useState } from "react";
import { ArrowLeft, Bookmark, Bot, BookOpen, Trash2, Trophy, Volume2, VolumeX } from "lucide-react";
import type { SavedItem, UserProfile } from "../types";
import { useSpeech } from "../hooks/useSpeech";

interface SavedItemsScreenProps {
  user: UserProfile;
  onBack: () => void;
  onDelete: (id: string) => void;
}

const tabs: Array<{ id: "all" | SavedItem["type"]; label: string }> = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI Answers" },
  { id: "lesson", label: "Lessons" },
  { id: "myth", label: "Myths" },
  { id: "quiz", label: "Quizzes" },
];

function getSavedItemSpeechText(item: UserProfile["savedItems"][number]) {
  if (typeof item.data === "string") {
    return item.data;
  }

  if (item.type === "ai" && item.data && typeof item.data === "object") {
    if (typeof item.data.answer === "string") {
      return item.data.answer;
    }

    if (typeof item.data.summary === "string") {
      return item.data.summary;
    }
  }

  return item.title;
}

function getSavedItemPreview(item: UserProfile["savedItems"][number]) {
  const text = getSavedItemSpeechText(item);
  return text.length > 150 ? `${text.slice(0, 150)}...` : text;
}

function getIcon(type: SavedItem["type"]) {
  switch (type) {
    case "ai":
      return Bot;
    case "lesson":
      return BookOpen;
    case "quiz":
      return Trophy;
    case "myth":
    default:
      return Bookmark;
  }
}

export const SavedItemsScreen = ({ user, onBack, onDelete }: SavedItemsScreenProps) => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("all");
  const { canSpeak, isSpeaking, speechError, speak, stopSpeaking } = useSpeech();
  const visibleItems = useMemo(
    () =>
      activeTab === "all"
        ? user.savedItems
        : user.savedItems.filter((item) => item.type === activeTab),
    [activeTab, user.savedItems],
  );

  return (
    <div className="screen-shell screen-shell-lg min-h-screen">
      <button onClick={onBack} className="ghost-button mb-6">
        <ArrowLeft size={17} />
        Back
      </button>

      <section className="mb-6">
        <p className="page-eyebrow">Saved Items</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Your learning library</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          AI answers, lessons, myth checks, and quiz records saved during your CivicPath session.
        </p>
      </section>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-12 shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              activeTab === tab.id
                ? "bg-accent text-white shadow-sm"
                : "border border-border bg-white text-muted hover:text-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {speechError && (
        <p role="alert" className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-error">
          {speechError}
        </p>
      )}

      {visibleItems.length === 0 ? (
        <div className="screen-card p-10 text-center sm:p-14">
          <Bookmark className="mx-auto text-muted" size={42} />
          <h2 className="mt-4 text-2xl font-black text-ink">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            Save useful AI answers or myth checks and they will appear here with category and date.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleItems.map((item) => {
            const Icon = getIcon(item.type);

            return (
              <article key={item.id} className="screen-card p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-soft-blue text-accent">
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-soft-blue px-3 py-1 text-xs font-bold text-accent">
                        {item.category}
                      </span>
                      <span className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-muted">
                        {item.date}
                      </span>
                    </div>
                    <h2 className="text-lg font-black leading-tight text-ink">{item.title}</h2>
                    {item.type === "ai" && (
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {getSavedItemPreview(item)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.type === "ai" && (
                    <>
                      <button
                        type="button"
                        onClick={() => speak(getSavedItemSpeechText(item))}
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
                    </>
                  )}
                  <button
                    onClick={() => onDelete(item.id)}
                    className="ml-auto inline-flex min-h-12 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold text-muted transition hover:bg-red-50 hover:text-error"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
