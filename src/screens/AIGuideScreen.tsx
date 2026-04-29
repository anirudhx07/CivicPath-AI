import { useEffect, useState } from "react";
import { AppScreen } from "../types";
import type { AccessibilitySettings, ActiveQuiz, UserProfile, SavedItem } from "../types";
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

export const AIGuideScreen = ({
  user,
  onNavigate,
  onSaveAnswer,
  onStartQuiz,
  accessibilitySettings,
}: AIGuideScreenProps) => {
  const [messages, setMessages] = useState<GuideMessage[]>([
    {
      role: "ai",
      text: `Welcome, ${user.name}. I am your dedicated Civic Assistant. How can I clarify today's election proceedings for you?`,
      id: "1",
      suggestedFollowUps: [
        "How do I check voter registration steps?",
        "What happens on voting day?",
        "How are election results verified?",
      ],
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
    <div className="h-[100dvh] flex flex-col bg-white pt-[var(--mobile-header-height)] lg:pt-0 overflow-hidden">
      <header className="p-4 sm:p-6 lg:p-8 border-b border-ink flex items-center justify-between sticky top-[var(--mobile-header-height)] lg:top-0 z-30 bg-white">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <div className="w-12 h-12 bg-ink text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">bot</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-serif italic font-bold text-xl truncate">Civic Assistant</h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted">
              Official Education Channel
            </span>
          </div>
        </div>
        <div className="hidden sm:flex border border-border bg-paper">
          {modes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              disabled={accessibilitySettings.simpleLanguage && item !== "Simple"}
              className={`px-4 py-3 text-[10px] uppercase font-black tracking-widest border-r border-border last:border-r-0 ${
                mode === item ? "bg-ink text-white" : "text-muted hover:text-ink"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 sm:space-y-12 pb-[calc(var(--mobile-bottom-nav-height)+14rem)] lg:pb-56 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`w-full sm:max-w-[80%] p-5 sm:p-8 border ${
                message.role === "user"
                  ? "bg-ink text-white border-ink rounded-none"
                  : "bg-paper text-ink border-border rounded-none"
              }`}
            >
              <p
                className={`text-lg leading-relaxed whitespace-pre-wrap ${
                  message.role === "ai" ? "font-serif italic" : "font-sans font-medium"
                }`}
              >
                {message.text}
              </p>

              {message.role === "ai" && (
                <div className="mt-8 pt-6 border-t border-border space-y-6">
                  {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {message.suggestedFollowUps.map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() => void submitQuestion(question)}
                          disabled={isTyping}
                          className="px-3 py-2 border border-border bg-white text-[10px] uppercase font-bold tracking-widest text-muted hover:text-ink disabled:opacity-50"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => readText(message.text)}
                      disabled={!canSpeak}
                      className="text-[10px] uppercase font-bold tracking-widest text-muted disabled:opacity-50"
                    >
                      Read Aloud
                    </button>
                    <button
                      type="button"
                      onClick={stopSpeaking}
                      disabled={!isSpeaking}
                      className="text-[10px] uppercase font-bold tracking-widest text-muted disabled:opacity-50"
                    >
                      Stop Speaking
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
                      className="text-[10px] uppercase font-bold tracking-widest text-accent border-b border-accent"
                    >
                      {user.savedItems.some((item) => item.id === `ai-${message.id}`)
                        ? "Saved to Records"
                        : "Save to Records"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSimplify(message.text)}
                      disabled={isTyping}
                      className="text-[10px] uppercase font-bold tracking-widest text-muted disabled:opacity-50"
                    >
                      Explain Simpler
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleGenerateQuiz(message.text)}
                      disabled={isTyping}
                      className="text-[10px] uppercase font-bold tracking-widest text-muted disabled:opacity-50"
                    >
                      Generate Quiz From This
                    </button>
                  </div>
                </div>
              )}
            </div>
            <span className="mt-2 text-[9px] uppercase font-black text-muted tracking-widest">
              {message.role === "ai" ? "Civic AI - Verified" : "Citizen Request"}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="w-full sm:max-w-[80%] p-5 sm:p-8 border bg-paper text-ink border-border">
              <p className="text-lg leading-relaxed font-serif italic">
                Drafting a neutral civic answer...
              </p>
            </div>
            <span className="mt-2 text-[9px] uppercase font-black text-muted tracking-widest">
              Civic AI typing
            </span>
          </div>
        )}

        {(error || speechError) && (
          <div
            role="alert"
            className="border border-red-200 bg-[#FEF2F2] p-6 text-sm text-red-600 font-bold leading-relaxed"
          >
            {error ?? speechError}
          </div>
        )}
      </div>

      <div className="fixed bottom-[var(--mobile-bottom-nav-height)] lg:bottom-0 left-0 right-0 lg:left-64 z-40 p-4 sm:p-6 lg:p-8 bg-white border-t border-ink">
        <div className="max-w-4xl mx-auto w-full">
        <div className="sm:hidden grid grid-cols-4 border border-border bg-paper mb-4">
          {modes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              disabled={accessibilitySettings.simpleLanguage && item !== "Simple"}
              className={`py-3 px-1 text-[9px] uppercase font-black tracking-tighter border-r border-border last:border-r-0 ${
                mode === item ? "bg-ink text-white" : "text-muted"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 bg-paper border border-border p-2 min-w-0">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void submitQuestion(input);
              }
            }}
            placeholder="Inquiry for the Assistant..."
            className="bg-transparent border-none flex-1 min-w-0 px-3 sm:px-4 py-3 outline-none text-sm italic"
          />
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={isTyping}
            className="w-11 h-11 border border-border bg-white text-ink flex items-center justify-center disabled:opacity-50"
            aria-label={isListening ? "Stop microphone input" : "Start microphone input"}
            title={canListen ? "Use microphone input" : "Speech recognition is not supported"}
          >
            <span className="material-symbols-outlined text-lg">
              {isListening ? "stop" : "mic"}
            </span>
          </button>
          <button
            type="button"
            onClick={stopSpeaking}
            disabled={!isSpeaking}
            className="w-11 h-11 border border-border bg-white text-ink flex items-center justify-center disabled:opacity-40"
            aria-label="Stop speaking"
            title="Stop speaking"
          >
            <span className="material-symbols-outlined text-lg">volume_off</span>
          </button>
          <button
            type="button"
            onClick={() => void submitQuestion(input)}
            disabled={isTyping || !input.trim()}
            className="px-4 sm:px-8 py-3 bg-ink text-white font-bold uppercase text-xs tracking-tight sm:tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isTyping ? "Working" : "Submit"}
          </button>
        </div>
        {!canListen && (
          <p className="mt-3 text-[10px] uppercase font-bold tracking-widest text-muted">
            Microphone input is not supported in this browser.
          </p>
        )}
        </div>
      </div>
    </div>
  );
};
