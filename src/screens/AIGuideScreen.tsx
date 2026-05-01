import { useEffect, useState } from "react";
import {
  BookmarkPlus,
  Bot,
  Mic,
  Send,
  Sparkles,
  Square,
  Volume2,
  Wand2,
} from "lucide-react";
import { AppScreen } from "../types";
import type { AccessibilitySettings, ActiveQuiz, SavedItem, UserProfile } from "../types";
import {
  generateCivicAnswer,
  generateQuizFromAnswer,
  simplifyAnswer,
  type AnswerMode,
} from "../services/aiService";
import { buildActiveQuizFromGenerated } from "../lib/quiz";
import { useSpeech } from "../hooks/useSpeech";

interface AIGuideScreenProps {
  user: UserProfile;
  onNavigate: (s: AppScreen) => void;
  onSaveAnswer: (item: SavedItem) => void;
  onStartQuiz: (quiz: ActiveQuiz) => void;
  accessibilitySettings: AccessibilitySettings;
}

interface GuideMessage {
  role: "ai" | "user";
  text: string;
  id: string;
  suggestedFollowUps?: string[];
}

const modes: AnswerMode[] = ["Simple", "Detailed", "Student", "Teacher"];
const starterPrompts = [
  "How do I register to vote?",
  "What happens on voting day?",
  "How are votes counted?",
  "What is candidate nomination?",
];

export const AIGuideScreen = ({
  user,
  onSaveAnswer,
  onStartQuiz,
  accessibilitySettings,
}: AIGuideScreenProps) => {
  const [messages, setMessages] = useState<GuideMessage[]>([
    {
      role: "ai",
      text: `Welcome, ${user.name}. I can explain elections in a neutral, beginner-friendly way. What would you like to understand today?`,
      id: "1",
      suggestedFollowUps: starterPrompts,
    },
  ]);
  const [input, setInput] = useState(() => {
    try {
      const draft = sessionStorage.getItem("civicpath-ai-guide-draft") ?? "";
      sessionStorage.removeItem("civicpath-ai-guide-draft");
      return draft;
    } catch {
      return "";
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AnswerMode>("Simple");
  const {
    canSpeak,
    canListen,
    isSpeaking,
    isListening,
    speechError,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  } = useSpeech();

  useEffect(() => {
    if (!accessibilitySettings.simpleLanguage) {
      return;
    }

    setMode("Simple");
  }, [accessibilitySettings.simpleLanguage]);

  const readText = (text: string) => {
    speak(text, { rate: accessibilitySettings.simpleLanguage ? 0.88 : 1 });
  };

  const autoReadAnswer = (text: string) => {
    if (!accessibilitySettings.readAnswersAloud && !accessibilitySettings.voiceExplanations) {
      return;
    }

    readText(text);
  };

  const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const submitQuestion = async (question: string) => {
    if (!question.trim() || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text: question, id: createId() }]);
    setInput("");
    setError(null);
    setIsTyping(true);

    try {
      const response = await generateCivicAnswer(question, {
        mode: accessibilitySettings.simpleLanguage ? "Simple" : mode,
        userRole: user.role,
        language: user.language,
      });
      autoReadAnswer(response.text);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: response.text,
          suggestedFollowUps: response.suggestedFollowUps,
          id: createId(),
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The AI Guide could not respond right now. Please try again.",
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleSimplify = async (answer: string) => {
    if (isTyping) return;
    setError(null);
    setIsTyping(true);

    try {
      const response = await simplifyAnswer(answer);
      autoReadAnswer(response.text);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: response.text,
          suggestedFollowUps: response.suggestedFollowUps,
          id: createId(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The AI Guide could not simplify that answer.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateQuiz = async (answer: string) => {
    if (isTyping) return;
    setError(null);
    setIsTyping(true);

    try {
      const quiz = await generateQuizFromAnswer(answer);
      const activeQuiz = buildActiveQuizFromGenerated({
        generatedQuiz: quiz,
        sourceType: "ai",
        sourceTitle: "AI Guide Answer",
        fallbackId: "ai-answer",
      });

      if (activeQuiz.questions.length === 0) {
        throw new Error("The AI Guide could not create usable quiz questions from that answer.");
      }

      onStartQuiz(activeQuiz);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The AI Guide could not generate a quiz from that answer.",
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening((transcript) => {
      setInput((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
    });
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper pt-[var(--mobile-header-height)] md:pt-0">
      <header className="border-b border-border bg-white/95 px-4 py-4 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-indigo text-white shadow-lg shadow-blue-500/20">
              <Bot size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black text-ink">Civic AI Guide</h1>
              <p className="flex items-center gap-2 text-xs font-bold text-muted">
                <Sparkles size={14} className="text-accent" />
                Neutral election education
              </p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {modes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                disabled={accessibilitySettings.simpleLanguage && item !== "Simple"}
                className={`min-h-12 shrink-0 rounded-full px-4 text-sm font-bold transition ${
                  mode === item
                    ? "bg-accent text-white shadow-sm"
                    : "border border-border bg-white text-muted hover:text-accent"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
          <section className="screen-card bg-gradient-to-br from-white to-soft-blue p-5 shadow-sm sm:p-6">
            <p className="page-eyebrow">Suggested prompts</p>
            <h2 className="mt-1 text-xl font-black text-ink">
              What would you like to understand today?
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void submitQuestion(prompt)}
                  disabled={isTyping}
                  className="min-h-12 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-accent shadow-sm transition hover:border-accent disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </section>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[92%] rounded-[1.5rem] px-5 py-4 shadow-sm sm:max-w-[80%] sm:px-6 sm:py-5 ${
                  message.role === "user"
                    ? "rounded-br-md bg-accent text-white"
                    : "rounded-bl-md border border-border bg-white text-ink"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-7 sm:text-base">{message.text}</p>

                {message.role === "ai" && (
                  <div className="mt-5 border-t border-border pt-4">
                    {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {message.suggestedFollowUps.map((question) => (
                          <button
                            key={question}
                            type="button"
                            onClick={() => void submitQuestion(question)}
                            disabled={isTyping}
                            className="min-h-12 rounded-full bg-soft-blue px-3 py-2 text-xs font-bold text-accent transition hover:bg-blue-100 disabled:opacity-50"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => readText(message.text)}
                        disabled={!canSpeak}
                        className="secondary-button min-h-12 rounded-full px-3 py-2 text-xs"
                      >
                        <Volume2 size={14} />
                        Read aloud
                      </button>
                      <button
                        type="button"
                        onClick={stopSpeaking}
                        disabled={!isSpeaking}
                        className="secondary-button min-h-12 rounded-full px-3 py-2 text-xs"
                      >
                        <Square size={13} />
                        Stop
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onSaveAnswer({
                            id: `ai-${message.id}`,
                            type: "ai",
                            title:
                              message.text.slice(0, 48) + (message.text.length > 48 ? "..." : ""),
                            date: new Date().toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }),
                            category: "AI Guide",
                            data: message.text,
                          })
                        }
                        className="secondary-button min-h-12 rounded-full px-3 py-2 text-xs"
                      >
                        <BookmarkPlus size={14} />
                        {user.savedItems.some((item) => item.id === `ai-${message.id}`)
                          ? "Saved"
                          : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleSimplify(message.text)}
                        disabled={isTyping}
                        className="secondary-button min-h-12 rounded-full px-3 py-2 text-xs"
                      >
                        <Wand2 size={14} />
                        Explain simpler
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleGenerateQuiz(message.text)}
                        disabled={isTyping}
                        className="secondary-button min-h-12 rounded-full px-3 py-2 text-xs"
                      >
                        Generate quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="mt-2 px-2 text-[11px] font-bold text-muted">
                {message.role === "ai" ? "Civic AI" : "You"}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex flex-col items-start">
              <div className="rounded-[1.5rem] rounded-bl-md border border-border bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
                  <span className="ml-2 text-sm font-bold text-muted">Drafting a neutral answer</span>
                </div>
              </div>
            </div>
          )}

          {(error || speechError) && (
            <div
              role="alert"
              className="rounded-3xl border border-red-100 bg-red-50 p-4 text-sm font-bold leading-6 text-error"
            >
              {error ?? speechError}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-border bg-white/95 px-4 pb-[calc(var(--mobile-bottom-nav-height)+1rem)] pt-4 shadow-[0_-16px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-6 md:pb-5 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex items-center gap-2 rounded-[1.5rem] border border-border bg-paper p-2 shadow-sm">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void submitQuestion(input);
                }
              }}
              placeholder="Ask about elections..."
              className="min-h-12 min-w-0 flex-1 border-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isTyping || !canListen}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
                isListening ? "bg-red-50 text-error" : "bg-white text-muted hover:text-accent"
              } disabled:opacity-50`}
              aria-label={isListening ? "Stop microphone input" : "Start microphone input"}
              title={canListen ? "Use microphone input" : "Speech recognition is not supported"}
            >
              {isListening ? <Square size={18} /> : <Mic size={18} />}
            </button>
            <button
              type="button"
              onClick={() => void submitQuestion(input)}
              disabled={isTyping || !input.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-white shadow-sm transition hover:bg-indigo disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-5"
              aria-label="Send question"
            >
              <Send size={18} />
              <span className="ml-2 hidden text-sm font-bold sm:inline">
                {isTyping ? "Working" : "Send"}
              </span>
            </button>
          </div>
          <p className="mt-3 text-xs font-semibold leading-5 text-muted">
            Civic AI gives neutral education, not voting advice. Verify current rules with your
            local election authority.
          </p>
          {!canListen && (
            <p className="mt-2 text-xs font-semibold text-muted">
              Microphone input is not supported in this browser.
            </p>
          )}
        </div>
      </footer>
    </div>
  );
};
