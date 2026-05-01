import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  ListChecks,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import type { AccessibilitySettings, ActiveQuiz, QuizAnswerReview, UserProfile } from "../types";
import { QUIZ_QUESTIONS } from "../data/quizQuestions";
import { LESSONS } from "../data/lessons";
import { TIMELINE_STEPS } from "../data/timeline";
import { generateQuizFromTopic } from "../services/aiService";
import { buildActiveQuizFromGenerated } from "../lib/quiz";

interface QuizStartScreenProps {
  onStart: (quiz?: ActiveQuiz) => void;
  onBack: () => void;
}

export const QuizStartScreen = ({ onStart, onBack }: QuizStartScreenProps) => {
  const [lessonId, setLessonId] = useState(LESSONS[0]?.id ?? "");
  const [timelineStepId, setTimelineStepId] = useState(TIMELINE_STEPS[0]?.id ?? "");
  const [loadingSource, setLoadingSource] = useState<"lesson" | "timeline" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateFromLesson = async () => {
    const lesson = LESSONS.find((item) => item.id === lessonId) ?? LESSONS[0];
    if (!lesson) return;

    setLoadingSource("lesson");
    setError(null);

    try {
      const generatedQuiz = await generateQuizFromTopic(
        `${lesson.title}\n${lesson.description}\n${lesson.sections
          .map((section) => `${section.title}: ${section.content}`)
          .join("\n")}`,
        {
          sourceType: "lesson",
          sourceTitle: lesson.title,
        },
      );

      onStart(
        buildActiveQuizFromGenerated({
          generatedQuiz,
          sourceType: "lesson",
          sourceTitle: lesson.title,
          fallbackId: `lesson-${lesson.id}`,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate a quiz from that lesson.");
    } finally {
      setLoadingSource(null);
    }
  };

  const generateFromTimeline = async () => {
    const step = TIMELINE_STEPS.find((item) => item.id === timelineStepId) ?? TIMELINE_STEPS[0];
    if (!step) return;

    setLoadingSource("timeline");
    setError(null);

    try {
      const generatedQuiz = await generateQuizFromTopic(
        `${step.title}\n${step.description}\n${step.fullExplanation}\nChecklist: ${step.checklist.join(", ")}`,
        {
          sourceType: "timeline",
          sourceTitle: step.title,
        },
      );

      onStart(
        buildActiveQuizFromGenerated({
          generatedQuiz,
          sourceType: "timeline",
          sourceTitle: step.title,
          fallbackId: `timeline-${step.id}`,
        }),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not generate a quiz from that timeline step.",
      );
    } finally {
      setLoadingSource(null);
    }
  };

  return (
    <div className="screen-shell screen-shell-lg min-h-screen">
      <button onClick={onBack} className="ghost-button mb-6">
        <ArrowLeft size={17} />
        Back
      </button>

      <section className="mb-6 screen-card overflow-hidden bg-gradient-to-br from-white to-soft-blue p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
          <div>
            <p className="page-eyebrow">Quiz Studio</p>
            <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">
              Test your civic readiness
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Choose the standard readiness quiz or generate a focused practice quiz from your
              current lesson or timeline step.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <Trophy className="text-warning" size={30} />
            <p className="mt-4 text-sm font-bold text-muted">Reward preview</p>
            <h2 className="text-xl font-black text-ink">Quiz Starter Badge</h2>
            <p className="mt-2 text-sm leading-5 text-muted">Complete any quiz to unlock progress.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="screen-card flex flex-col p-5 sm:p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-blue text-accent">
            <BadgeCheck size={24} />
          </div>
          <h2 className="text-2xl font-black text-ink">Standard Quiz</h2>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted">
            A stable readiness check covering registration, voting day, and official verification.
          </p>
          <div className="my-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-paper p-3">
              <p className="text-2xl font-black text-ink">{QUIZ_QUESTIONS.length}</p>
              <p className="text-xs font-bold text-muted">Questions</p>
            </div>
            <div className="rounded-2xl bg-paper p-3">
              <p className="text-2xl font-black text-ink">80%</p>
              <p className="text-xs font-bold text-muted">Goal score</p>
            </div>
          </div>
          <button onClick={() => onStart()} className="primary-button w-full">
            Begin Standard Quiz
          </button>
        </section>

        <section className="screen-card flex flex-col p-5 sm:p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-blue text-accent">
            <BookOpen size={24} />
          </div>
          <h2 className="text-2xl font-black text-ink">Lesson Quiz</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Generate practice questions from a specific lesson.
          </p>
          <label className="mt-5 block text-sm font-bold text-ink">
            Lesson
            <select
              value={lessonId}
              onChange={(event) => setLessonId(event.target.value)}
              className="modern-input mt-2"
            >
              {LESSONS.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void generateFromLesson()}
            disabled={loadingSource !== null}
            className="secondary-button mt-auto w-full"
          >
            {loadingSource === "lesson" ? "Generating..." : "Generate Lesson Quiz"}
          </button>
        </section>

        <section className="screen-card flex flex-col p-5 sm:p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-blue text-accent">
            <ListChecks size={24} />
          </div>
          <h2 className="text-2xl font-black text-ink">Timeline Quiz</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Practice from a journey step like candidate nomination or vote counting.
          </p>
          <label className="mt-5 block text-sm font-bold text-ink">
            Timeline step
            <select
              value={timelineStepId}
              onChange={(event) => setTimelineStepId(event.target.value)}
              className="modern-input mt-2"
            >
              {TIMELINE_STEPS.map((step) => (
                <option key={step.id} value={step.id}>
                  {step.title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void generateFromTimeline()}
            disabled={loadingSource !== null}
            className="secondary-button mt-auto w-full"
          >
            {loadingSource === "timeline" ? "Generating..." : "Generate Timeline Quiz"}
          </button>
        </section>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold leading-6 text-error"
        >
          {error}
        </p>
      )}
    </div>
  );
};

interface QuizQuestionScreenProps {
  activeQuiz: ActiveQuiz;
  accessibilitySettings: AccessibilitySettings;
  onComplete: (score: number, answers: QuizAnswerReview[]) => void;
}

export const QuizQuestionScreen = ({
  activeQuiz,
  accessibilitySettings,
  onComplete,
}: QuizQuestionScreenProps) => {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<QuizAnswerReview[]>([]);
  const [score, setScore] = useState(0);
  const q = activeQuiz.questions[idx] ?? QUIZ_QUESTIONS[0];
  const answered = selected !== null;
  const isCorrect = selected === q.correctIndex;
  const total = Math.max(activeQuiz.questions.length, 1);

  useEffect(() => {
    if (!answered || !accessibilitySettings.voiceExplanations || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(q.explanation);
    utterance.rate = accessibilitySettings.simpleLanguage ? 0.88 : 1;
    window.speechSynthesis.speak(utterance);
  }, [accessibilitySettings.simpleLanguage, accessibilitySettings.voiceExplanations, answered, q.explanation]);

  const next = () => {
    if (selected === null) return;

    const answer: QuizAnswerReview = {
      question: q,
      selectedIndex: selected,
      isCorrect,
    };
    const newAnswers = [...answers, answer];
    const newScore = isCorrect ? score + 1 : score;

    if (idx < activeQuiz.questions.length - 1) {
      setScore(newScore);
      setAnswers(newAnswers);
      setIdx(idx + 1);
      setSelected(null);
    } else {
      onComplete(newScore, newAnswers);
    }
  };

  return (
    <div className="screen-shell screen-shell-md min-h-screen">
      <section className="mb-6 screen-card p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="page-eyebrow">{activeQuiz.sourceTitle}</p>
            <h1 className="mt-1 text-xl font-black text-ink">Question {idx + 1}</h1>
          </div>
          <span className="status-chip w-fit">
            <Clock3 size={14} />
            {idx + 1} of {activeQuiz.questions.length}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-indigo transition-all"
            style={{ width: `${((idx + 1) / total) * 100}%` }}
          />
        </div>
      </section>

      <section className="screen-card p-5 sm:p-7">
        <h2 className="text-2xl font-black leading-tight text-ink sm:text-3xl">{q.text}</h2>
        <div className="mt-7 space-y-3">
          {q.options.map((opt, i) => {
            const showCorrect = answered && i === q.correctIndex;
            const showWrong = answered && selected === i && selected !== q.correctIndex;

            return (
              <button
                key={`${q.id}-${i}`}
                onClick={() => !answered && setSelected(i)}
                disabled={answered}
                className={`flex w-full items-center justify-between gap-4 rounded-3xl border p-4 text-left transition sm:p-5 ${
                  showCorrect
                    ? "border-green-200 bg-green-50 text-green-800"
                    : showWrong
                      ? "border-red-200 bg-red-50 text-red-700"
                      : selected === i
                        ? "border-accent bg-soft-blue text-accent"
                        : "border-border bg-white hover:border-accent"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-paper text-sm font-black">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-bold leading-6 sm:text-base">{opt}</span>
                </span>
                {showCorrect ? (
                  <CheckCircle2 className="shrink-0" size={22} />
                ) : showWrong ? (
                  <XCircle className="shrink-0" size={22} />
                ) : (
                  <Circle className="shrink-0 text-muted" size={18} />
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`mt-6 rounded-3xl border p-5 ${
              isCorrect ? "border-green-100 bg-green-50" : "border-amber-100 bg-amber-50"
            }`}
          >
            <h3 className="text-sm font-black text-ink">
              {isCorrect ? "Correct answer" : "Explanation"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">{q.explanation}</p>
          </div>
        )}
      </section>

      <button
        onClick={next}
        disabled={selected === null}
        className="primary-button mt-6 w-full"
      >
        {idx === activeQuiz.questions.length - 1 ? "Submit Quiz" : "Next Question"}
      </button>
    </div>
  );
};

interface QuizResultScreenProps {
  user: UserProfile;
  score: number;
  total: number;
  onRetry: () => void;
  onHome: () => void;
  onReview: () => void;
}

export const QuizResultScreen = ({
  user,
  score,
  total,
  onRetry,
  onHome,
  onReview,
}: QuizResultScreenProps) => {
  const percent = Math.round((score / Math.max(total, 1)) * 100);

  return (
    <div className="screen-shell screen-shell-sm min-h-screen">
      <section className="screen-card overflow-hidden p-6 text-center sm:p-8">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-amber-50 text-warning">
          <Trophy size={46} />
        </div>
        <p className="mt-6 page-eyebrow">Quiz complete</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Great work</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          Your assessment has been saved. Review your score and keep building readiness.
        </p>

        <div className="mx-auto mt-8 flex h-40 w-40 items-center justify-center rounded-full text-3xl font-black text-accent"
          style={{ background: `conic-gradient(#2563EB ${percent * 3.6}deg, #E2E8F0 0deg)` }}
        >
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
            <span>{percent}%</span>
            <span className="text-xs font-bold text-muted">
              {score}/{total}
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-paper p-4">
            <p className="text-2xl font-black text-ink">{user.readinessScore}%</p>
            <p className="text-xs font-bold text-muted">Readiness</p>
          </div>
          <div className="rounded-3xl bg-amber-50 p-4">
            <Sparkles className="mx-auto text-warning" size={24} />
            <p className="mt-2 text-xs font-bold text-muted">Badge progress updated</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button onClick={onHome} className="primary-button w-full">
            Continue Learning
          </button>
          <button onClick={onReview} className="secondary-button w-full">
            Review Answers
          </button>
          <button onClick={onRetry} className="ghost-button w-full">
            Try Another Quiz
          </button>
        </div>
      </section>
    </div>
  );
};

interface QuizReviewScreenProps {
  answers: QuizAnswerReview[];
  onBack: () => void;
  onHome: () => void;
}

export const QuizReviewScreen = ({ answers, onBack, onHome }: QuizReviewScreenProps) => (
  <div className="screen-shell screen-shell-md min-h-screen">
    <button onClick={onBack} className="ghost-button mb-6">
      <ArrowLeft size={17} />
      Back to Result
    </button>
    <section className="mb-6">
      <p className="page-eyebrow">Review</p>
      <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Answer review</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Review each answer and explanation. Keep checking official election rules with your local
        election authority.
      </p>
    </section>

    <div className="space-y-4">
      {answers.map((answer, index) => (
        <section key={`${answer.question.id}-${index}`} className="screen-card p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="text-xl font-black leading-tight text-ink">
              {index + 1}. {answer.question.text}
            </h2>
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                answer.isCorrect ? "bg-green-50 text-success" : "bg-red-50 text-error"
              }`}
            >
              {answer.isCorrect ? "Correct" : "Review"}
            </span>
          </div>
          <div className="space-y-2">
            {answer.question.options.map((option, optionIndex) => (
              <div
                key={option}
                className={`rounded-2xl border p-4 text-sm font-semibold leading-6 ${
                  optionIndex === answer.question.correctIndex
                    ? "border-green-200 bg-green-50 text-green-800"
                    : optionIndex === answer.selectedIndex
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-border bg-paper text-muted"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-muted">{answer.question.explanation}</p>
        </section>
      ))}
    </div>

    <button onClick={onHome} className="primary-button mt-6 w-full">
      Return to Dashboard
    </button>
  </div>
);
