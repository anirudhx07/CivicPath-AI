import { ArrowLeft, CheckCircle2, HelpCircle, MapPinned, ShieldCheck } from "lucide-react";
import type { TimelineStep } from "../types";
import { TIMELINE_STEPS } from "../data/timeline";

interface TimelineDetailScreenProps {
  step: TimelineStep;
  onBack: () => void;
}

export const TimelineDetailScreen = ({ step, onBack }: TimelineDetailScreenProps) => {
  const stepNumber = TIMELINE_STEPS.findIndex((item) => item.id === step.id) + 1;

  return (
    <div className="min-h-screen bg-paper pt-[var(--mobile-header-height)] md:pt-0">
      <header className="sticky top-[var(--mobile-header-height)] z-30 border-b border-border bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-8 md:top-0">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-white text-ink transition hover:border-accent hover:text-accent"
            aria-label="Back"
          >
            <ArrowLeft size={19} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-ink">{step.title}</p>
            <p className="truncate text-xs font-semibold text-muted">
              Step {String(stepNumber).padStart(2, "0")} of {TIMELINE_STEPS.length}
            </p>
          </div>
          <span className="hidden rounded-full bg-soft-blue px-3 py-1 text-xs font-bold text-accent sm:inline-flex">
            Timeline
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 pb-[calc(var(--mobile-bottom-nav-height)+2rem)] sm:px-8 md:pb-20">
        <section className="screen-card overflow-hidden bg-gradient-to-br from-ink to-indigo p-6 text-white sm:p-8">
          <span className="inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-bold text-white/82 ring-1 ring-white/20">
            Reference Step {String(stepNumber).padStart(2, "0")}
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
            {step.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
            {step.description}
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-6">
            <section className="screen-card p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-blue text-accent">
                  <MapPinned size={22} />
                </span>
                <h2 className="text-2xl font-black text-ink">What this step means</h2>
              </div>
              <p className="text-base leading-8 text-muted">{step.fullExplanation}</p>
            </section>

            <section className="screen-card p-5 sm:p-6">
              <h2 className="text-2xl font-black text-ink">Checklist</h2>
              <div className="mt-5 space-y-3">
                {step.checklist.map((item, index) => (
                  <div key={item} className="flex gap-4 rounded-3xl border border-border bg-paper p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-accent">
                      <CheckCircle2 size={19} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-muted">Item {index + 1}</p>
                      <p className="mt-1 text-sm font-bold leading-6 text-ink">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {step.commonQuestions.length > 0 && (
              <section className="screen-card p-5 sm:p-6">
                <h2 className="text-2xl font-black text-ink">Common questions</h2>
                <div className="mt-5 space-y-3">
                  {step.commonQuestions.map((question) => (
                    <div key={question.q} className="rounded-3xl border border-border bg-white p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <HelpCircle className="text-accent" size={19} />
                        <h3 className="font-black text-ink">{question.q}</h3>
                      </div>
                      <p className="text-sm leading-6 text-muted">{question.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <section className="screen-card p-5">
              <h2 className="font-black text-ink">Status summary</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
            </section>
            <section className="screen-card bg-soft-blue p-5">
              <ShieldCheck className="text-accent" size={24} />
              <h2 className="mt-4 font-black text-ink">Verify locally</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Election dates, deadlines, and required documents vary by location. Always confirm
                the latest rules with your local election authority.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};
