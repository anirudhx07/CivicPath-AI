import { useState } from "react";
import { CheckCircle2, Clock3, Lock, PlayCircle, Route } from "lucide-react";
import type { UserProfile } from "../types";
import { TIMELINE_STEPS } from "../data/timeline";

interface TimelineScreenProps {
  user: UserProfile;
  onOpenStep: (id: string, shouldMarkComplete: boolean) => void;
}

const filters = ["Basic", "Detailed", "Student", "Teacher"];

export const TimelineScreen = ({ user, onOpenStep }: TimelineScreenProps) => {
  const [filter, setFilter] = useState("Basic");
  const completedCount = user.timelineStepsCompleted.length;
  const progress = Math.round((completedCount / TIMELINE_STEPS.length) * 100);

  return (
    <div className="screen-shell screen-shell-lg flex-1">
      <section className="mb-6 screen-card overflow-hidden bg-gradient-to-br from-white to-soft-blue p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="page-eyebrow">Election Journey</p>
            <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">
              Your interactive roadmap
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Follow each step from voter registration through government formation. Completed
              steps stay available for review.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`min-h-12 rounded-full px-4 py-2 text-sm font-bold transition ${
                  filter === item
                    ? "bg-accent text-white shadow-sm"
                    : "border border-border bg-white text-muted hover:text-accent"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-blue-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-4 text-sm font-bold">
            <span className="text-ink">
              {completedCount} of {TIMELINE_STEPS.length} steps completed
            </span>
            <span className="text-accent">{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-indigo"
              style={{ width: `${progress}%`, animation: "progress-grow 500ms ease-out" }}
            />
          </div>
        </div>
      </section>

      <section className="relative space-y-4">
        <div className="absolute bottom-10 left-6 top-8 hidden w-px bg-border sm:block" />
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = user.timelineStepsCompleted.includes(step.id);
          const isNext =
            !isCompleted &&
            (index === 0 || user.timelineStepsCompleted.includes(TIMELINE_STEPS[index - 1].id));
          const isLocked = !isCompleted && !isNext;
          const status = isCompleted ? "Completed" : isNext ? "Current" : "Locked";

          return (
            <article key={step.id} className="relative sm:pl-16">
              <div
                className={`absolute left-0 top-6 hidden h-12 w-12 items-center justify-center rounded-2xl border-4 border-paper sm:flex ${
                  isCompleted
                    ? "bg-green-100 text-success"
                    : isNext
                      ? "bg-blue-100 text-accent"
                      : "bg-slate-100 text-muted"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={22} />
                ) : isNext ? (
                  <PlayCircle size={22} />
                ) : (
                  <Lock size={20} />
                )}
              </div>

              <div
                className={`screen-card p-5 transition sm:p-6 ${
                  isLocked ? "opacity-70" : "tap-scale hover:border-accent"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black sm:hidden ${
                        isCompleted
                          ? "bg-green-100 text-success"
                          : isNext
                            ? "bg-blue-100 text-accent"
                            : "bg-slate-100 text-muted"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={21} /> : String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="status-chip bg-white text-muted">
                          Step {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            isCompleted
                              ? "bg-green-50 text-success"
                              : isNext
                                ? "bg-blue-50 text-accent"
                                : "bg-slate-100 text-muted"
                          }`}
                        >
                          {status}
                        </span>
                        <span className="status-chip bg-white text-muted">
                          <Clock3 size={13} />
                          5 min
                        </span>
                      </div>
                      <h2 className="text-xl font-black text-ink sm:text-2xl">{step.title}</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenStep(step.id, isNext)}
                    disabled={isLocked}
                    className={isLocked ? "secondary-button opacity-50" : "primary-button"}
                  >
                    {isCompleted ? "Review" : isNext ? "Start" : "Locked"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-6 rounded-3xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Route className="mt-1 shrink-0 text-accent" size={22} />
          <p className="text-sm leading-6 text-muted">
            This roadmap is educational. Dates, documents, and official deadlines vary by location,
            so always verify current requirements with your local election authority.
          </p>
        </div>
      </div>
    </div>
  );
};
