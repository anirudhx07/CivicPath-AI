import type { ActiveQuiz, QuizQuestion } from "../types";
import type { GeneratedQuiz } from "../services/aiService";

export function normalizeQuizOptions(
  options: string[],
  correctIndex: number,
  maxOptions = 4,
): Pick<QuizQuestion, "options" | "correctIndex"> {
  const cleanedOptions = options
    .map((option, originalIndex) => ({ option: option.trim(), originalIndex }))
    .filter(({ option }) => option.length > 0);

  const firstOptions = cleanedOptions.slice(0, maxOptions);
  const correctOption = cleanedOptions.find(
    ({ originalIndex }) => originalIndex === correctIndex,
  );
  const includesCorrectOption =
    correctOption &&
    firstOptions.some(({ originalIndex }) => originalIndex === correctOption.originalIndex);
  const selectedOptions =
    correctOption && !includesCorrectOption && firstOptions.length >= maxOptions
      ? [...firstOptions.slice(0, Math.max(maxOptions - 1, 0)), correctOption]
      : firstOptions;
  const normalizedCorrectIndex = selectedOptions.findIndex(
    ({ originalIndex }) => originalIndex === correctIndex,
  );

  return {
    options: selectedOptions.map(({ option }) => option),
    correctIndex: normalizedCorrectIndex >= 0 ? normalizedCorrectIndex : 0,
  };
}

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
    .map((question) => ({
      ...question,
      question: question.question.trim(),
      normalized: normalizeQuizOptions(question.options, question.correctIndex),
    }))
    .filter((question) => question.question && question.normalized.options.length >= 2)
    .slice(0, 5)
    .map((question, index) => ({
      id: `${fallbackId}-q${index + 1}`,
      text: question.question,
      options: question.normalized.options,
      correctIndex: question.normalized.correctIndex,
      explanation: question.explanation.trim(),
    }));

  return {
    id: `${fallbackId}-${Date.now()}`,
    title: generatedQuiz.title || `${sourceTitle} Quiz`,
    sourceType,
    sourceTitle,
    questions,
  };
}
