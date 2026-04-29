import { useState } from "react";
import type { ActiveQuiz, QuizAnswerReview, UserProfile } from "../types";
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
    <div className="min-h-screen flex flex-col p-8 max-w-lg mx-auto w-full pt-20">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-ink font-bold mb-16 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1 w-fit"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span> Return
      </button>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-40 h-40 border-2 border-ink flex items-center justify-center mb-12 relative">
          <span className="material-symbols-outlined text-6xl">edit_note</span>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-ink text-white flex items-center justify-center font-serif italic text-xl">
            5
          </div>
        </div>
        <h1 className="text-4xl font-serif italic font-bold mb-6">Competency Assessment</h1>
        <p className="text-muted leading-relaxed mb-12">
          Use the standard readiness quiz or generate a neutral practice quiz from current
          learning material.
        </p>

        <div className="w-full border-t border-b border-border py-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Standard Quiz
            </span>
            <span className="font-serif italic font-bold">{QUIZ_QUESTIONS.length} Modules</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Generated Quizzes
            </span>
            <span className="font-serif italic font-bold">AI Assisted</span>
          </div>
        </div>

        <div className="w-full mt-8 space-y-4 text-left">
          <div className="border border-border p-4 bg-paper">
            <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-3">
              Generate From Lesson
            </label>
            <select
              value={lessonId}
              onChange={(event) => setLessonId(event.target.value)}
              className="w-full bg-white border border-border p-3 text-sm mb-4"
            >
              {LESSONS.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void generateFromLesson()}
              disabled={loadingSource !== null}
              className="w-full py-3 border border-ink text-ink font-bold uppercase text-[10px] tracking-widest disabled:opacity-50"
            >
              {loadingSource === "lesson" ? "Generating..." : "Generate Lesson Quiz"}
            </button>
          </div>

          <div className="border border-border p-4 bg-paper">
            <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-3">
              Generate From Timeline
            </label>
            <select
              value={timelineStepId}
              onChange={(event) => setTimelineStepId(event.target.value)}
              className="w-full bg-white border border-border p-3 text-sm mb-4"
            >
              {TIMELINE_STEPS.map((step) => (
                <option key={step.id} value={step.id}>
                  {step.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void generateFromTimeline()}
              disabled={loadingSource !== null}
              className="w-full py-3 border border-ink text-ink font-bold uppercase text-[10px] tracking-widest disabled:opacity-50"
            >
              {loadingSource === "timeline" ? "Generating..." : "Generate Timeline Quiz"}
            </button>
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-600 font-bold leading-relaxed">
              {error}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => onStart()}
        className="w-full py-6 bg-ink text-white font-bold uppercase text-xs tracking-[0.2em] hover:bg-black transition-colors mt-12"
      >
        Begin Standard Examination
      </button>
    </div>
  );
};

interface QuizQuestionScreenProps {
  activeQuiz: ActiveQuiz;
  onComplete: (score: number, answers: QuizAnswerReview[]) => void;
}

export const QuizQuestionScreen = ({ activeQuiz, onComplete }: QuizQuestionScreenProps) => {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<QuizAnswerReview[]>([]);
  const [score, setScore] = useState(0);
  const q = activeQuiz.questions[idx] ?? QUIZ_QUESTIONS[0];
  const answered = selected !== null;
  const isCorrect = selected === q.correctIndex;

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
    <div className="min-h-screen flex flex-col p-8 max-w-2xl mx-auto w-full pt-20">
      <div className="flex justify-between items-center mb-16 border-b border-ink pb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
          Module {idx + 1} of {activeQuiz.questions.length}
        </span>
        <div className="h-1 flex-1 bg-border mx-8">
          <div
            className="h-full bg-ink transition-all"
            style={{ width: `${((idx + 1) / activeQuiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1">
        <span className="pill mb-6">{activeQuiz.sourceTitle}</span>
        <h2 className="text-3xl font-serif italic font-bold mb-12 leading-relaxed">{q.text}</h2>
        <div className="space-y-4">
          {q.options.map((opt, i) => {
            const showCorrect = answered && i === q.correctIndex;
            const showWrong = answered && selected === i && selected !== q.correctIndex;

            return (
              <button
                key={opt}
                onClick={() => !answered && setSelected(i)}
                disabled={answered}
                className={`w-full p-6 text-left border flex justify-between items-center transition-all ${
                  showCorrect
                    ? "border-green-700 bg-green-50 text-green-800"
                    : showWrong
                      ? "border-red-600 bg-red-50 text-red-700"
                      : selected === i
                        ? "border-ink bg-ink text-white"
                        : "border-border bg-white hover:border-ink"
                }`}
              >
                <span className="font-medium text-sm">{opt}</span>
                <div className="text-[10px] uppercase font-black tracking-widest">
                  {showCorrect ? "Correct" : showWrong ? "Wrong" : selected === i ? "Selected" : ""}
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-8 border border-border bg-paper p-6">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-ink mb-3">
              Explanation
            </h3>
            <p className="text-sm text-muted leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>

      <button
        onClick={next}
        disabled={selected === null}
        className="w-full py-6 bg-ink text-white font-bold uppercase text-xs tracking-widest mt-12 disabled:opacity-20"
      >
        {idx === activeQuiz.questions.length - 1 ? "Submit Evaluation" : "Next Module"}
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
}: QuizResultScreenProps) => (
  <div className="min-h-screen flex flex-col p-8 items-center justify-center text-center max-w-lg mx-auto">
    <div className="w-48 h-48 border-2 border-ink flex items-center justify-center mb-12">
      <span className="material-symbols-outlined text-7xl text-ink">workspace_premium</span>
    </div>
    <div className="space-y-4 mb-16">
      <h1 className="text-4xl font-serif italic font-bold">Certification Recorded</h1>
      <p className="text-muted leading-relaxed">
        Your latest assessment has been saved. Review your score below and keep building election
        readiness.
      </p>
    </div>
    <div className="grid grid-cols-2 gap-8 w-full mb-16 border-t border-b border-border py-8">
      <div className="text-center">
        <div className="text-3xl font-serif italic font-bold text-ink">
          {score} / {total}
        </div>
        <div className="text-[10px] text-muted uppercase font-bold tracking-widest mt-1">
          Modules Cleared
        </div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-serif italic font-bold text-ink">
          {user.readinessScore}%
        </div>
        <div className="text-[10px] text-muted uppercase font-bold tracking-widest mt-1">
          Current Readiness
        </div>
      </div>
    </div>
    <div className="w-full space-y-4">
      <button
        onClick={onHome}
        className="w-full py-6 bg-ink text-white font-bold uppercase text-[10px] tracking-[0.2em]"
      >
        Return to Desk
      </button>
      <button
        onClick={onReview}
        className="w-full py-6 border border-ink text-ink font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-paper"
      >
        Review Answers
      </button>
      <button
        onClick={onRetry}
        className="w-full py-6 border border-border text-muted font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-paper"
      >
        Re-Examine
      </button>
    </div>
  </div>
);

interface QuizReviewScreenProps {
  answers: QuizAnswerReview[];
  onBack: () => void;
  onHome: () => void;
}

export const QuizReviewScreen = ({ answers, onBack, onHome }: QuizReviewScreenProps) => (
  <div className="min-h-screen p-8 max-w-3xl mx-auto w-full pt-20 pb-32">
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1"
    >
      <span className="material-symbols-outlined text-sm">arrow_back</span> Return to Result
    </button>
    <h1 className="text-4xl font-serif italic font-bold mb-4">Answer Review</h1>
    <p className="text-muted mb-12">
      Review each answer and explanation. Keep checking official election rules with your local
      election authority.
    </p>

    <div className="space-y-6">
      {answers.map((answer, index) => (
        <section key={`${answer.question.id}-${index}`} className="border border-border bg-white p-8">
          <div className="flex justify-between gap-4 border-b border-border pb-4 mb-6">
            <h2 className="font-serif italic font-bold text-xl">
              {index + 1}. {answer.question.text}
            </h2>
            <span
              className={`shrink-0 text-[10px] uppercase font-black tracking-widest ${
                answer.isCorrect ? "text-green-700" : "text-red-600"
              }`}
            >
              {answer.isCorrect ? "Correct" : "Review"}
            </span>
          </div>
          <div className="space-y-3">
            {answer.question.options.map((option, optionIndex) => (
              <div
                key={option}
                className={`p-4 border text-sm ${
                  optionIndex === answer.question.correctIndex
                    ? "border-green-700 bg-green-50 text-green-800"
                    : optionIndex === answer.selectedIndex
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-border bg-paper text-muted"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted leading-relaxed">{answer.question.explanation}</p>
        </section>
      ))}
    </div>

    <button
      onClick={onHome}
      className="w-full py-6 bg-ink text-white font-bold uppercase text-[10px] tracking-[0.2em] mt-12"
    >
      Return to Desk
    </button>
  </div>
);
