import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Clock3, Search, Sparkles } from "lucide-react";
import type { UserProfile } from "../types";
import { LESSONS } from "../data/lessons";

interface LearnHubProps {
  user: UserProfile;
  onOpenLesson: (id: string) => void;
}

export const LearnHub = ({ user, onOpenLesson }: LearnHubProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(LESSONS.map((lesson) => lesson.category)))];
  const filteredLessons = useMemo(
    () =>
      LESSONS.filter((lesson) => {
        const matchesCategory = category === "All" || lesson.category === category;
        const searchText = `${lesson.title} ${lesson.description} ${lesson.category}`.toLowerCase();
        return matchesCategory && searchText.includes(query.toLowerCase());
      }),
    [category, query],
  );
  const completed = user.lessonsCompleted.length;
  const total = LESSONS.length;
  const pathProgress = Math.round((completed / Math.max(total, 1)) * 100);

  return (
    <div className="screen-shell screen-shell-lg flex-1">
      <section className="mb-6 screen-card overflow-hidden p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
          <div className="min-w-0">
            <p className="page-eyebrow">Knowledge Hub</p>
            <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">
              Learn the election process
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Short lessons with clear concepts, progress tracking, and AI support when you need a
              simpler explanation.
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-accent to-indigo p-5 text-white shadow-lg">
            <Sparkles size={24} />
            <p className="mt-4 text-sm font-bold text-white/75">Featured path</p>
            <h2 className="text-xl font-black">Election Ready Citizen</h2>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white" style={{ width: `${pathProgress}%` }} />
            </div>
            <p className="mt-3 text-sm font-bold">{pathProgress}% complete</p>
          </div>
        </div>
      </section>

      <section className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="modern-input pl-12"
            placeholder="Search lessons..."
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`min-h-12 shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                category === item
                  ? "bg-accent text-white shadow-sm"
                  : "border border-border bg-white text-muted hover:text-accent"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {filteredLessons.length === 0 ? (
        <div className="screen-card p-10 text-center">
          <BookOpen className="mx-auto text-muted" size={38} />
          <h2 className="mt-4 text-xl font-black text-ink">No lessons found</h2>
          <p className="mt-2 text-sm text-muted">Try a broader search or another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredLessons.map((lesson) => {
            const isCompleted = user.lessonsCompleted.includes(lesson.id);
            const progress = isCompleted ? 100 : 35;

            return (
              <button
                key={lesson.id}
                onClick={() => onOpenLesson(lesson.id)}
                className="screen-card tap-scale flex min-h-[19rem] flex-col p-5 text-left transition hover:border-accent sm:p-6"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      isCompleted ? "bg-green-100 text-success" : "bg-soft-blue text-accent"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={23} /> : <BookOpen size={23} />}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isCompleted ? "bg-green-50 text-success" : "bg-blue-50 text-accent"
                    }`}
                  >
                    {isCompleted ? "Completed" : lesson.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-black leading-tight text-ink">{lesson.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">{lesson.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3 text-xs font-bold text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={14} />
                    {lesson.timeEstimate}
                  </span>
                  <span>{lesson.category}</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
                </div>
                <span className="primary-button mt-5 w-full">
                  {isCompleted ? "Review Lesson" : "Start Lesson"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
