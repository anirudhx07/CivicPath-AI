import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  BookmarkCheck,
  BookmarkPlus,
  Bot,
  Check,
  Clipboard,
  Mic,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Volume2,
  Wand2,
} from "lucide-react";
import { StructuredAnswer } from "../components/chat/StructuredAnswer";
import { AppScreen } from "../types";
import type { AccessibilitySettings, ActiveQuiz, SavedItem, UserProfile } from "../types";
import {
  generateCivicAnswer,
  generateQuizFromAnswer,
  simplifyCivicAnswer,
  type ChatMessage,
  type ChatMode,
  type CivicAnswerResult,
} from "../services/aiService";
import { buildActiveQuizFromGenerated } from "../lib/quiz";
import { useSpeech } from "../hooks/useSpeech";
import { useSpeechReader } from "../hooks/useSpeechReader";

interface AIGuideScreenProps {
  user: UserProfile;
  onNavigate: (s: AppScreen) => void;
  onSaveAnswer: (item: SavedItem) => void;
  onStartQuiz: (quiz: ActiveQuiz) => void;
  accessibilitySettings: AccessibilitySettings;
}

interface GuideMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  mode: ChatMode;
  relatedTopics: string[];
  followUps: string[];
  isSaved: boolean;
  isLoading?: boolean;
  error?: string;
  answer?: CivicAnswerResult;
}

type PromptGroup = {
  title: string;
  prompts: string[];
};

const modes: Array<{ label: string; value: ChatMode }> = [
  { label: "Simple", value: "simple" },
  { label: "Detailed", value: "detailed" },
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
];

const welcomePromptGroups: PromptGroup[] = [
  {
    title: "First-time voters",
    prompts: [
      "What should a first-time voter know?",
      "How do I check if I am registered?",
      "What documents might I need to register?",
      "What should I do before voting day?",
    ],
  },
  {
    title: "Election process",
    prompts: [
      "Explain the full election process step by step.",
      "What happens after voting ends?",
      "How are votes counted?",
      "How are results declared?",
    ],
  },
  {
    title: "Myths",
    prompts: [
      "Is it true that one vote does not matter?",
      "Are exit polls official results?",
      "Can the AI tell me who to vote for?",
    ],
  },
  {
    title: "Students",
    prompts: [
      "Explain elections like I am 12.",
      "Give me election flashcards.",
      "Quiz me on voter registration.",
      "Explain democracy and elections simply.",
    ],
  },
  {
    title: "Teachers",
    prompts: [
      "Create a 20-minute lesson plan on voting day.",
      "Give me classroom discussion questions.",
      "Create a quiz for students on election basics.",
      "How do I teach elections without political bias?",
    ],
  },
];

const promptGroupsByMode: Record<ChatMode, PromptGroup[]> = {
  simple: [
    {
      title: "First-time voters",
      prompts: [
        "What should a first-time voter know?",
        "How do I check if I am registered?",
        "What documents might I need to register?",
        "What should I do before voting day?",
      ],
    },
    {
      title: "Election process",
      prompts: [
        "Explain the full election process step by step.",
        "What happens after voting ends?",
        "How are votes counted?",
        "How are results declared?",
      ],
    },
    {
      title: "Myths",
      prompts: [
        "Is it true that one vote does not matter?",
        "Are exit polls official results?",
        "Can the AI tell me who to vote for?",
      ],
    },
  ],
  detailed: [
    {
      title: "Election process",
      prompts: [
        "Explain the full election process step by step.",
        "What is candidate nomination?",
        "How do campaign rules work?",
        "What happens after voting ends?",
      ],
    },
    {
      title: "Verification",
      prompts: [
        "How do I verify election deadlines?",
        "What documents might I need to register?",
        "How do I check official results?",
        "How can I spot election misinformation?",
      ],
    },
  ],
  student: [
    {
      title: "Students",
      prompts: [
        "Explain elections like I am 12.",
        "Give me election flashcards.",
        "Quiz me on voter registration.",
        "Explain democracy and elections simply.",
      ],
    },
    {
      title: "Practice",
      prompts: [
        "Quiz me on voting day.",
        "Explain vote counting with an analogy.",
        "What are the key election terms?",
      ],
    },
  ],
  teacher: [
    {
      title: "Teachers",
      prompts: [
        "Create a 20-minute lesson plan on voting day.",
        "Give me classroom discussion questions.",
        "Create a quiz for students on election basics.",
        "Design an activity about vote counting.",
      ],
    },
    {
      title: "Neutral classroom",
      prompts: [
        "How do I teach elections without political bias?",
        "Create a source-checking activity for students.",
        "Give me an exit ticket on voter rights.",
      ],
    },
  ],
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readStoredMessages(key: string): GuideMessage[] {
  if (typeof sessionStorage === "undefined") {
    return [];
  }

  try {
    const raw = sessionStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as GuideMessage[]) : [];

    return Array.isArray(parsed)
      ? parsed.filter(
          (message) =>
            message &&
            (message.role === "user" || message.role === "assistant") &&
            typeof message.content === "string",
        )
      : [];
  } catch {
    return [];
  }
}

function toChatHistory(messages: GuideMessage[]): ChatMessage[] {
  return messages.slice(-10).map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    timestamp: message.timestamp,
    mode: message.mode,
    relatedTopics: message.relatedTopics,
    followUps: message.followUps,
    isSaved: message.isSaved,
    error: message.error,
  }));
}

function getDraftQuestion() {
  if (typeof sessionStorage === "undefined") {
    return "";
  }

  try {
    const draft = sessionStorage.getItem("civicpath-ai-guide-draft") ?? "";
    sessionStorage.removeItem("civicpath-ai-guide-draft");
    return draft;
  } catch {
    return "";
  }
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildSavedTitle(message: GuideMessage) {
  const summary = message.answer?.summary || message.content;
  return summary.slice(0, 64) + (summary.length > 64 ? "..." : "");
}

function getGreetingName(user: UserProfile) {
  if (user.isGuest) {
    return "Guest Learner";
  }

  return user.name?.trim() || "there";
}

function buildGreetingText(user: UserProfile) {
  return `Hello, ${getGreetingName(user)}. I'm CivicPath AI. I can help you understand elections in a simple, neutral, and beginner-friendly way. You can ask me about voter registration, voting day, vote counting, results, myths, or classroom learning.`;
}

function isNearBottom(container: HTMLElement, threshold = 160) {
  return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
}

export const AIGuideScreen = ({
  user,
  onSaveAnswer,
  onStartQuiz,
  accessibilitySettings,
}: AIGuideScreenProps) => {
  const chatStorageKey = useMemo(
    () => `civicpath_chat_session_${user.id ?? user.uid}`,
    [user.id, user.uid],
  );
  const [messages, setMessages] = useState<GuideMessage[]>(() =>
    readStoredMessages(chatStorageKey),
  );
  const [input, setInput] = useState(getDraftQuestion);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [mode, setMode] = useState<ChatMode>("simple");
  const [hasUnseenResponse, setHasUnseenResponse] = useState(false);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);
  const isUserNearBottomRef = useRef(true);
  const userHasManuallyScrolledRef = useRef(false);
  const toastTimeoutRef = useRef<number | null>(null);
  const greetingUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isGreetingSpeakingRef = useRef(false);
  const {
    canListen,
    isListening,
    speechError,
    startListening,
    stopListening,
  } = useSpeech();
  const {
    canSpeak,
    speakMessage,
    stopSpeaking,
    speakingMessageId,
    highlightedCharIndex,
    highlightedCharLength,
    isSpeaking,
    speechError: readerError,
  } = useSpeechReader();

  const effectiveMode = accessibilitySettings.simpleLanguage ? "simple" : mode;
  const promptGroups = messages.length === 0 ? welcomePromptGroups : promptGroupsByMode[effectiveMode];
  const greetingText = useMemo(
    () => buildGreetingText(user),
    [user.isGuest, user.name],
  );
  const greetingStorageKey = useMemo(
    () => `civicpath_ai_greeting_spoken_${user.id ?? user.uid}`,
    [user.id, user.uid],
  );

  useEffect(() => {
    setMessages(readStoredMessages(chatStorageKey));
  }, [chatStorageKey]);

  useEffect(() => {
    if (typeof sessionStorage === "undefined") {
      return;
    }

    try {
      sessionStorage.setItem(chatStorageKey, JSON.stringify(messages.slice(-40)));
    } catch {
      // Chat history is helpful, not critical.
    }
  }, [chatStorageKey, messages]);

  useEffect(() => {
    if (accessibilitySettings.simpleLanguage) {
      setMode("simple");
    }
  }, [accessibilitySettings.simpleLanguage]);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = accessibilitySettings.reduceAnimations ? "auto" : "smooth") => {
      window.requestAnimationFrame(() => {
        bottomAnchorRef.current?.scrollIntoView({
          behavior,
          block: "end",
        });
      });
    },
    [accessibilitySettings.reduceAnimations],
  );

  const handleChatScroll = useCallback(() => {
    const container = chatScrollRef.current;
    if (!container) {
      return;
    }

    const nearBottom = isNearBottom(container);
    isUserNearBottomRef.current = nearBottom;
    setIsUserNearBottom(nearBottom);

    if (nearBottom) {
      userHasManuallyScrolledRef.current = false;
      setHasUnseenResponse(false);
    } else {
      userHasManuallyScrolledRef.current = true;
    }
  }, []);

  const scrollToLatestResponse = useCallback(() => {
    userHasManuallyScrolledRef.current = false;
    setHasUnseenResponse(false);
    scrollToBottom();
  }, [scrollToBottom]);

  const stopGreetingSpeech = useCallback(() => {
    if (!isGreetingSpeakingRef.current && !greetingUtteranceRef.current) {
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    greetingUtteranceRef.current = null;
    isGreetingSpeakingRef.current = false;
  }, []);

  const speakGreeting = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) {
        return false;
      }

      stopGreetingSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = accessibilitySettings.simpleLanguage ? 0.88 : 1;
      utterance.lang = user.language === "en" ? "en-US" : user.language;
      greetingUtteranceRef.current = utterance;
      isGreetingSpeakingRef.current = true;

      utterance.onend = () => {
        if (greetingUtteranceRef.current === utterance) {
          greetingUtteranceRef.current = null;
          isGreetingSpeakingRef.current = false;
        }
      };
      utterance.onerror = () => {
        if (greetingUtteranceRef.current === utterance) {
          greetingUtteranceRef.current = null;
          isGreetingSpeakingRef.current = false;
        }
      };

      try {
        window.speechSynthesis.speak(utterance);
        return true;
      } catch {
        greetingUtteranceRef.current = null;
        isGreetingSpeakingRef.current = false;
        return false;
      }
    },
    [accessibilitySettings.simpleLanguage, stopGreetingSpeech, user.language],
  );

  useEffect(
    () => () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
      stopGreetingSpeech();
    },
    [stopGreetingSpeech],
  );

  useEffect(() => {
    if (messages.length !== 0 || typeof sessionStorage === "undefined") {
      return;
    }

    try {
      if (sessionStorage.getItem(greetingStorageKey) === "true") {
        return;
      }

      sessionStorage.setItem(greetingStorageKey, "true");
      speakGreeting(greetingText);
    } catch {
      speakGreeting(greetingText);
    }
  }, [greetingStorageKey, greetingText, messages.length, speakGreeting]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSpeaking) {
        stopSpeaking();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSpeaking, stopSpeaking]);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 2600);
  };

  const autoReadAnswer = (messageId: string, text: string) => {
    if (!accessibilitySettings.readAnswersAloud && !accessibilitySettings.voiceExplanations) {
      return;
    }

    speakMessage(messageId, text, {
      rate: accessibilitySettings.simpleLanguage ? 0.88 : 1,
      lang: user.language === "en" ? "en-US" : user.language,
    });
  };

  const submitQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isTyping) return;

    stopGreetingSpeech();

    const userMessage: GuideMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
      mode: effectiveMode,
      relatedTopics: [],
      followUps: [],
      isSaved: false,
    };
    const history = toChatHistory(messages);
    const shouldScrollForUserMessage =
      isUserNearBottomRef.current && !userHasManuallyScrolledRef.current;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsTyping(true);
    if (shouldScrollForUserMessage) {
      scrollToBottom();
    }

    try {
      const response = await generateCivicAnswer({
        question: trimmed,
        mode: effectiveMode,
        userRole: user.role,
        language: user.language,
        conversationHistory: history,
      });
      const assistantId = createId();
      const shouldScrollForAssistant =
        isUserNearBottomRef.current && !userHasManuallyScrolledRef.current;

      const assistantMessage: GuideMessage = {
        id: assistantId,
        role: "assistant",
        content: response.answer,
        timestamp: new Date().toISOString(),
        mode: effectiveMode,
        relatedTopics: response.relatedTopics,
        followUps: response.followUps,
        isSaved: false,
        answer: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (shouldScrollForAssistant) {
        scrollToBottom();
      } else {
        setHasUnseenResponse(true);
      }
      autoReadAnswer(assistantId, response.answer);
    } catch {
      setError("Civic AI could not answer right now. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSimplify = async (message: GuideMessage) => {
    if (isTyping) return;

    setError(null);
    setIsTyping(true);

    try {
      const response = await simplifyCivicAnswer({
        answer: message.content,
        question: "Explain the previous answer more simply.",
        conversationHistory: toChatHistory(messages),
        language: user.language,
      });
      const assistantId = createId();
      const shouldScrollForAssistant =
        isUserNearBottomRef.current && !userHasManuallyScrolledRef.current;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: response.answer,
          timestamp: new Date().toISOString(),
          mode: "simple",
          relatedTopics: response.relatedTopics,
          followUps: response.followUps,
          isSaved: false,
          answer: response,
        },
      ]);
      if (shouldScrollForAssistant) {
        scrollToBottom();
      } else {
        setHasUnseenResponse(true);
      }
      autoReadAnswer(assistantId, response.answer);
    } catch {
      setError("Civic AI could not simplify that answer right now.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateQuiz = async (message: GuideMessage) => {
    if (isTyping) return;

    setError(null);
    setIsTyping(true);

    try {
      const quiz = await generateQuizFromAnswer({
        answer: message.content,
        topic: message.answer?.summary || "AI Guide Answer",
        count: 5,
        conversationHistory: toChatHistory(messages),
      });
      const activeQuiz = buildActiveQuizFromGenerated({
        generatedQuiz: quiz,
        sourceType: "ai",
        sourceTitle: "AI Guide Answer",
        fallbackId: "ai-answer",
      });

      if (activeQuiz.questions.length === 0) {
        throw new Error("No quiz questions were generated.");
      }

      onStartQuiz(activeQuiz);
    } catch {
      setError("Civic AI could not generate a quiz from that answer.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSave = (message: GuideMessage) => {
    const savedId = `ai-${message.id}`;
    const isAlreadySaved =
      message.isSaved || user.savedItems.some((item) => item.id === savedId);

    if (isAlreadySaved) {
      showToast("Answer already saved.");
      return;
    }

    onSaveAnswer({
      id: savedId,
      type: "ai",
      title: buildSavedTitle(message),
      date: formatDate(),
      category: "AI Guide",
      data: message.answer ?? message.content,
    });
    setMessages((prev) =>
      prev.map((item) => (item.id === message.id ? { ...item, isSaved: true } : item)),
    );
    showToast("Answer saved.");
  };

  const handleCopy = async (message: GuideMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      showToast("Answer copied.");
    } catch {
      showToast("Copy is not available in this browser.");
    }
  };

  const handleRead = (message: GuideMessage) => {
    if (!canSpeak) {
      showToast("Read-aloud is not supported in this browser.");
      return;
    }

    stopGreetingSpeech();
    speakMessage(message.id, message.content, {
      rate: accessibilitySettings.simpleLanguage ? 0.88 : 1,
      lang: user.language === "en" ? "en-US" : user.language,
    });
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      return;
    }

    if (!canListen) {
      showToast("Microphone input is not supported in this browser.");
      return;
    }

    startListening(
      (transcript) => {
        setInput((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
      },
      { lang: user.language === "en" ? "en-US" : user.language },
    );
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-paper pt-[var(--mobile-header-height)] md:pt-0">
      <header className="shrink-0 border-b border-border bg-white/95 px-4 py-4 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
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
                key={item.value}
                type="button"
                onClick={() => setMode(item.value)}
                disabled={accessibilitySettings.simpleLanguage && item.value !== "simple"}
                className={`min-h-12 shrink-0 rounded-full px-4 text-sm font-bold transition ${
                  effectiveMode === item.value
                    ? "bg-accent text-white shadow-sm"
                    : "border border-border bg-white text-muted hover:text-accent"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div
        ref={chatScrollRef}
        onScroll={handleChatScroll}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-8">
          {messages.length === 0 && (
            <>
              <section className="greeting-card">
                <div className="greeting-avatar">
                  <Bot size={26} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="greeting-status-chip">
                      <Sparkles size={13} />
                      Neutral election education
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-ink sm:text-3xl">
                    Welcome to Civic AI Guide
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                    {greetingText}
                  </p>
                  <p className="mt-2 text-sm font-bold text-accent">
                    Ask a question below to begin.
                  </p>
                  <button
                    type="button"
                    onClick={() => speakGreeting(greetingText)}
                    className="replay-greeting-button mt-4"
                  >
                    <RotateCcw size={14} />
                    Replay greeting
                  </button>
                </div>
              </section>

              <section className="screen-card bg-gradient-to-br from-white to-soft-blue p-5 shadow-sm sm:p-6">
                <p className="page-eyebrow">Suggested prompts</p>
                <h2 className="mt-1 text-2xl font-black text-ink">
                  What would you like to understand today?
                </h2>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {promptGroups.map((group) => (
                    <div
                      key={group.title}
                      className="rounded-2xl border border-blue-100 bg-white/80 p-4"
                    >
                      <h3 className="text-sm font-black text-ink">{group.title}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.prompts.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => void submitQuestion(prompt)}
                            disabled={isTyping}
                            className="min-h-11 rounded-full border border-blue-100 bg-white px-3 py-2 text-left text-xs font-bold leading-5 text-accent shadow-sm transition hover:border-accent disabled:opacity-50"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {messages.map((message) => {
            const savedId = `ai-${message.id}`;
            const isSaved =
              message.isSaved || user.savedItems.some((item) => item.id === savedId);
            const isReadingThisMessage =
              message.role === "assistant" && isSpeaking && speakingMessageId === message.id;

            return (
              <div
                key={message.id}
                className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-[1.5rem] px-5 py-4 shadow-sm sm:max-w-[84%] sm:px-6 sm:py-5 ${
                    message.role === "user"
                      ? "rounded-br-md bg-accent text-white"
                      : "rounded-bl-md border border-border bg-white text-ink"
                  } ${isReadingThisMessage ? "reading-active-message" : ""}`}
                >
                  {message.role === "user" ? (
                    <p className="whitespace-pre-wrap text-sm leading-7 sm:text-base">
                      {message.content}
                    </p>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-muted">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-soft-blue text-accent">
                          <Bot size={16} />
                        </span>
                        Civic AI
                      </div>
                      <StructuredAnswer
                        messageId={message.id}
                        answer={message.answer}
                        content={message.content}
                        isSpeaking={isSpeaking}
                        speakingMessageId={speakingMessageId}
                        highlightedCharIndex={highlightedCharIndex}
                        highlightedCharLength={highlightedCharLength}
                        onFollowUp={(question) => void submitQuestion(question)}
                        followUpDisabled={isTyping}
                      />
                      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                        <button
                          type="button"
                          onClick={() => handleRead(message)}
                          aria-label="Read this answer aloud"
                          className="secondary-button min-h-11 rounded-full px-3 py-2 text-xs"
                        >
                          <Volume2 size={14} />
                          {isReadingThisMessage ? "Reading..." : "Read aloud"}
                        </button>
                        <button
                          type="button"
                          onClick={stopSpeaking}
                          disabled={!isSpeaking}
                          aria-label="Stop reading aloud"
                          className="secondary-button min-h-11 rounded-full px-3 py-2 text-xs"
                        >
                          <Square size={13} />
                          Stop
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSave(message)}
                          className="secondary-button min-h-11 rounded-full px-3 py-2 text-xs"
                        >
                          {isSaved ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}
                          {isSaved ? "Saved" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleSimplify(message)}
                          disabled={isTyping}
                          className="secondary-button min-h-11 rounded-full px-3 py-2 text-xs"
                        >
                          <Wand2 size={14} />
                          Explain simpler
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleGenerateQuiz(message)}
                          disabled={isTyping}
                          className="secondary-button min-h-11 rounded-full px-3 py-2 text-xs"
                        >
                          <Check size={14} />
                          Generate quiz
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleCopy(message)}
                          className="secondary-button min-h-11 rounded-full px-3 py-2 text-xs"
                        >
                          <Clipboard size={14} />
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <span className="mt-2 px-2 text-[11px] font-bold text-muted">
                  {message.role === "assistant" ? "Civic AI" : "You"}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex flex-col items-start">
              <div className="rounded-[1.5rem] rounded-bl-md border border-border bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-accent" />
                  <span className="ml-2 text-sm font-bold text-muted">
                    Drafting a neutral answer
                  </span>
                </div>
              </div>
            </div>
          )}

          {(error || speechError || readerError) && (
            <div
              role="alert"
              className="rounded-3xl border border-red-100 bg-red-50 p-4 text-sm font-bold leading-6 text-error"
            >
              {error ?? speechError ?? readerError}
            </div>
          )}

          <div ref={bottomAnchorRef} />
        </div>
      </div>

      <footer className="shrink-0 border-t border-border bg-white/95 px-4 pb-[calc(var(--mobile-bottom-nav-height)+1rem)] pt-4 shadow-[0_-16px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-6 md:pb-5 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          {hasUnseenResponse && !isUserNearBottom && (
            <div className="mb-3 flex justify-center">
              <button
                type="button"
                onClick={scrollToLatestResponse}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-indigo"
              >
                New response
                <ArrowDown size={14} />
              </button>
            </div>
          )}
          {toast && (
            <div className="mb-3 rounded-2xl border border-blue-100 bg-soft-blue px-4 py-3 text-sm font-bold text-accent">
              {toast}
            </div>
          )}
          <div className="flex items-end gap-2 rounded-[1.5rem] border border-border bg-paper p-2 shadow-sm">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void submitQuestion(input);
                }
              }}
              placeholder="Ask about elections..."
              rows={1}
              className="max-h-36 min-h-12 min-w-0 flex-1 resize-none border-none bg-transparent px-3 py-3 text-sm leading-6 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isTyping}
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
        </div>
      </footer>
    </div>
  );
};
