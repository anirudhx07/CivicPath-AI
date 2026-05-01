import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, ClipboardList, Search, SearchCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppScreen } from "../types";
import { LESSONS } from "../data/lessons";
import { TIMELINE_STEPS } from "../data/timeline";

interface SearchScreenProps {
  onBack: () => void;
  onNavigate: (s: AppScreen) => void;
  onOpenLesson: (id: string) => void;
  onOpenTimelineStep: (id: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  meta: string;
  icon: LucideIcon;
  onOpen: () => void;
}

const matchesQuery = (query: string, values: string[]) =>
  values.join(" ").toLowerCase().includes(query);

export const SearchScreen = ({
  onBack,
  onNavigate,
  onOpenLesson,
  onOpenTimelineStep,
}: SearchScreenProps) => {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo<SearchResult[]>(() => {
    if (!normalizedQuery) {
      return [];
    }

    const lessonResults = LESSONS.filter((lesson) =>
      matchesQuery(normalizedQuery, [
        lesson.title,
        lesson.description,
        lesson.category,
        ...lesson.sections.flatMap((section) => [section.title, section.content]),
      ]),
    ).map((lesson): SearchResult => ({
      id: `lesson-${lesson.id}`,
      title: lesson.title,
      description: lesson.description,
      meta: `${lesson.category} lesson`,
      icon: BookOpen,
      onOpen: () => onOpenLesson(lesson.id),
    }));

    const timelineResults = TIMELINE_STEPS.filter((step) =>
      matchesQuery(normalizedQuery, [
        step.title,
        step.description,
        step.fullExplanation,
        ...step.checklist,
        ...step.commonQuestions.flatMap((question) => [question.q, question.a]),
      ]),
    ).map((step, index): SearchResult => ({
      id: `timeline-${step.id}`,
      title: step.title,
      description: step.description,
      meta: `Timeline step ${index + 1}`,
      icon: ClipboardList,
      onOpen: () => onOpenTimelineStep(step.id),
    }));

    const toolResults: SearchResult[] = matchesQuery(normalizedQuery, [
      "myth buster fact check verification claim misinformation false misleading official",
    ])
      ? [
          {
            id: "tool-myth-buster",
            title: "Myth Buster",
            description: "Classify an election claim with a neutral explanation and official-verification reminder.",
            meta: "AI verification tool",
            icon: SearchCheck,
            onOpen: () => onNavigate(AppScreen.MYTH_BUSTER),
          },
        ]
      : [];

    return [...lessonResults, ...timelineResults, ...toolResults];
  }, [normalizedQuery, onNavigate, onOpenLesson, onOpenTimelineStep]);

  return (
    <div className="min-h-screen bg-paper">
      <div className="screen-shell screen-shell-md">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lessons, myths, or timeline steps..."
              className="modern-input pl-12 text-base"
            />
          </label>
          <button onClick={onBack} className="ghost-button w-fit">
            <ArrowLeft size={17} />
            Back
          </button>
        </div>

        {normalizedQuery ? (
          <div className="space-y-4">
            <p className="page-eyebrow">{results.length} result{results.length === 1 ? "" : "s"}</p>
            {results.length > 0 ? (
              results.map((result) => {
                const Icon = result.icon;

                return (
                  <button
                    key={result.id}
                    type="button"
                    onClick={result.onOpen}
                    className="screen-card tap-scale flex items-start gap-4 p-5 text-left transition hover:border-accent sm:p-6"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-soft-blue text-accent">
                      <Icon size={22} />
                    </span>
                    <span className="min-w-0">
                      <span className="status-chip mb-3 w-fit bg-white text-muted">
                        {result.meta}
                      </span>
                      <span className="block text-xl font-black text-ink">{result.title}</span>
                      <span className="mt-2 block text-sm leading-6 text-muted">
                        {result.description}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="screen-card p-10 text-center sm:p-14">
                <Search className="mx-auto text-muted" size={42} />
                <h1 className="mt-4 text-2xl font-black text-ink">No results found</h1>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
                  Try searching for registration, voting day, counting, documents, or myths.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="screen-card p-10 text-center sm:p-14">
            <Search className="mx-auto text-muted" size={44} />
            <h1 className="mt-4 text-2xl font-black text-ink">Search CivicPath</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              Find lessons, saved civic concepts, and timeline topics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
