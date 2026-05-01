import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { AccessibilitySettings, Lesson } from "../types";
import { LESSONS } from "../data/lessons";
import { useSpeech } from "../hooks/useSpeech";

interface LessonDetailScreenProps {
  lesson: Lesson;
  accessibilitySettings: AccessibilitySettings;
  onBack: () => void;
  onComplete: (id: string) => void;
  onAskAI: (question: string) => void;
  onTakeQuiz: () => void;
}

export const LessonDetailScreen = ({
  lesson,
  accessibilitySettings,
  onBack,
  onComplete,
  onAskAI,
  onTakeQuiz,
}: LessonDetailScreenProps) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const { canSpeak, isSpeaking, speechError, speak, stopSpeaking } = useSpeech();
  const lessonNumber = LESSONS.findIndex((item) => item.id === lesson.id) + 1;
  const lessonText = [
    lesson.title,
    lesson.description,
    ...lesson.sections.flatMap((section) => [section.title, section.content]),
  ].join(". ");
  const speechRate = accessibilitySettings.simpleLanguage ? 0.88 : 1;
  const progress = Math.round((completedSections.length / Math.max(lesson.sections.length, 1)) * 100);

  const markSectionComplete = (sectionId: string) => {
    setCompletedSections((prev) => Array.from(new Set([...prev, sectionId])));
  };

  return (
    <div className="min-h-screen bg-paper pt-[var(--mobile-header-height)] md:pt-0">
      <header className="sticky top-[var(--mobile-header-height)] z-30 border-b border-border bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-8 md:top-0">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-white text-ink transition hover:border-accent hover:text-accent"
            aria-label="Back"
          >
            <ArrowLeft size={19} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-ink">{lesson.title}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className="hidden rounded-full bg-soft-blue px-3 py-1 text-xs font-bold text-accent sm:inline-flex">
            {progress}% read
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 pb-[calc(var(--mobile-bottom-nav-height)+8rem)] sm:px-8 md:pb-36">
        <section className="screen-card overflow-hidden p-5 sm:p-7">
          <span className="status-chip">Lesson {String(lessonNumber).padStart(2, "0")}</span>
          <h1 className="mt-5 text-3xl font-black leading-tight text-ink sm:text-5xl">
            {lesson.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{lesson.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => speak(lessonText, { rate: speechRate })}
              disabled={!canSpeak}
              className="secondary-button"
            >
              <Volume2 size={17} />
              Read Lesson
            </button>
            <button
              type="button"
              onClick={stopSpeaking}
              disabled={!isSpeaking}
              className="secondary-button"
            >
              <VolumeX size={17} />
              Stop Speaking
            </button>
            <button
              type="button"
              onClick={() => onAskAI(`Explain this lesson in simpler terms: ${lesson.title}`)}
              className="secondary-button"
            >
              <Bot size={17} />
              Ask AI
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
        </section>

        <section className="space-y-4">
          {lesson.sections.map((section, index) => {
            const isSectionComplete = completedSections.includes(section.id);

            return (
              <article key={section.id} className="screen-card p-5 sm:p-7">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                        isSectionComplete ? "bg-green-100 text-success" : "bg-soft-blue text-accent"
                      }`}
                    >
                      {isSectionComplete ? <CheckCircle2 size={20} /> : `0${index + 1}`}
                    </span>
                    <div className="min-w-0">
                      <p className="page-eyebrow">Section</p>
                      <h2 className="mt-1 text-2xl font-black text-ink">{section.title}</h2>
                    </div>
                  </div>
                </div>
                <p className="text-base leading-8 text-slate-700">{section.content}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onAskAI(`Help me understand this lesson section: ${section.title}. ${section.content}`)}
                    className="secondary-button"
                  >
                    <HelpCircle size={17} />
                    Ask AI about this section
                  </button>
                  <button
                    type="button"
                    onClick={() => markSectionComplete(section.id)}
                    className={isSectionComplete ? "secondary-button text-success" : "primary-button"}
                  >
                    <ClipboardCheck size={17} />
                    {isSectionComplete ? "Section complete" : "Mark section complete"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <section className="screen-card bg-gradient-to-br from-white to-soft-blue p-5 sm:p-7">
          <h2 className="text-2xl font-black text-ink">Ready to test this lesson?</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use a short quiz to reinforce the concepts, then return to the dashboard with your
            progress saved locally.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onTakeQuiz} className="primary-button">
              Take Quiz
            </button>
            <button
              type="button"
              onClick={() => {
                onComplete(lesson.id);
                onBack();
              }}
              className="secondary-button"
            >
              Mark Lesson Complete
            </button>
          </div>
        </section>
      </main>

      <div className="fixed bottom-[var(--mobile-bottom-nav-height)] left-0 right-0 z-40 border-t border-border bg-white/95 p-4 shadow-[0_-16px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl md:bottom-0 md:left-[88px] lg:left-[260px]">
        <div className="mx-auto flex max-w-4xl gap-3">
          <button
            onClick={() => {
              onComplete(lesson.id);
              onBack();
            }}
            className="primary-button flex-1"
          >
            Mark Lesson Complete
          </button>
          <button onClick={onTakeQuiz} className="secondary-button hidden sm:inline-flex">
            Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
