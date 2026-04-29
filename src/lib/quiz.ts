import type { ActiveQuiz, QuizQuestion } from "../types";
import type { GeneratedQuiz } from "../services/aiService";

export function buildActiveQuizFromGenerated({
  generatedQuiz,
  sourceType,
  sourceTitle,
  fallbackId,
}: {
  generatedQuiz: GeneratedQuiz;
  sourceType: ActiveQuiz["sourceType"];
  sourceTitle: string;
  fallbackId: string;
}): ActiveQuiz {
  const questions: QuizQuestion[] = generatedQuiz.questions
    .filter((question) => question.question.trim() && question.options.length >= 2)
    .slice(0, 5)
    .map((question, index) => ({
      id: `${fallbackId}-q${index + 1}`,
      text: question.question,
      options: question.options.slice(0, 4),
      correctIndex:
        question.correctIndex >= 0 && question.correctIndex < question.options.length
          ? question.correctIndex
          : 0,
      explanation: question.explanation,
    }));

  return {
    id: `${fallbackId}-${Date.now()}`,
    title: generatedQuiz.title || `${sourceTitle} Quiz`,
    sourceType,
    sourceTitle,
    questions,
  };
}
