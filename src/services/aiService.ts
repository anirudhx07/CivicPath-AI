import type { GoogleGenAI as GoogleGenAIClient } from "@google/genai";
import {
  civicKnowledge,
  civicKnowledgeTopics,
  type CivicKnowledgeKey,
  type CivicKnowledgeTopic,
} from "../data/civicKnowledge";
import { LESSONS } from "../data/lessons";
import { QUIZ_QUESTIONS } from "../data/quizQuestions";
import { TIMELINE_STEPS } from "../data/timeline";
import { getGeminiApiKey as getConfiguredGeminiApiKey } from "./env";

export type ChatMode = "simple" | "detailed" | "student" | "teacher";
export type AnswerMode = ChatMode;
type LegacyAnswerMode = "Simple" | "Detailed" | "Student" | "Teacher";

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  mode?: ChatMode;
  relatedTopics?: string[];
  followUps?: string[];
  isSaved?: boolean;
  error?: string;
}

export type CivicAnswerParams = {
  question: string;
  mode: ChatMode;
  userRole?: string;
  language?: string;
  conversationHistory?: ChatMessage[];
  localKnowledge?: string;
};

export type CivicAnswerResult = {
  answer: string;
  summary: string;
  keyPoints: string[];
  steps?: string[];
  example?: string;
  safetyNote: string;
  followUps: string[];
  relatedTopics: string[];
  confidence: "high" | "medium" | "low";
  needsOfficialVerification: boolean;
  usedFallback?: boolean;
  fallbackReason?: string;
};

export interface CivicAnswerOptions {
  mode?: ChatMode | LegacyAnswerMode;
  userRole?: string;
  language?: string;
  conversationHistory?: ChatMessage[];
  localKnowledge?: string;
}

export interface AIChatResponse {
  text: string;
  suggestedFollowUps: string[];
  usedFallback: boolean;
}

export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GeneratedQuiz {
  title: string;
  questions: GeneratedQuizQuestion[];
  usedFallback: boolean;
}

export interface QuizTopicOptions {
  sourceType?: "lesson" | "timeline" | "ai" | "mock";
  sourceTitle?: string;
}

export interface ElectionClaimClassification {
  classification: "True" | "False" | "Misleading" | "Needs official verification";
  shortExplanation: string;
  whyPeopleBelieveThis: string;
  truth: string;
  citizenAction: string;
  relatedTopics: string[];
  claim: string;
  usedFallback: boolean;
  status?: "True" | "False" | "Misleading" | "Needs Local Verification";
  explanation?: string;
}

export type MythCheckResponse = ElectionClaimClassification;

type SimplifyCivicAnswerParams = {
  answer: string;
  question?: string;
  mode?: ChatMode;
  conversationHistory?: ChatMessage[];
  language?: string;
};

type QuizFromAnswerParams = {
  answer: string;
  question?: string;
  topic?: string;
  count?: number;
  conversationHistory?: ChatMessage[];
};

type ClaimParams = {
  claim: string;
  conversationHistory?: ChatMessage[];
};

const MODEL = "gemini-2.5-flash";

const CIVIC_SYSTEM_INSTRUCTION = `
You are CivicPath AI, a neutral, non-partisan election process education assistant.

Your job is to explain election processes, voting steps, voter registration, election timelines, candidate nomination, campaigning rules, polling day, vote counting, result declaration, government formation, voter rights, civic responsibilities, misinformation awareness, and classroom learning activities.

You must:
- Stay politically neutral.
- Never recommend a candidate, party, ideology, or voting choice.
- Never persuade the user how to vote.
- Never rank or compare political parties.
- Explain processes in clear, simple, educational language.
- Mention when rules vary by country, state, or local election authority.
- Encourage users to verify deadlines, documents, eligibility, polling location, and official rules with their local election authority.
- Use structured answers with headings, bullet points, steps, examples, and follow-up questions.
- If the user asks who to vote for, which party is best, who will win, or asks for political persuasion, refuse politely and offer neutral civic criteria instead.
- Do not claim official legal authority.
- Do not invent exact deadlines, documents, or polling locations unless the user provides an official source.
- If unsure, say the answer depends on local rules and recommend official verification.

Tone:
Friendly, clear, beginner-friendly, confident, and educational.
`.trim();

const SAFE_REFUSAL =
  "I can't recommend a candidate, party, ideology, or voting choice. CivicPath AI is designed for neutral election process education. I can help you evaluate candidates using your own priorities, official information, manifestos, public records, debates, and policy comparisons.";

const neutralEvaluationFollowUps = [
  "How can I evaluate candidates neutrally?",
  "What should I look for in a manifesto?",
  "How do I verify election information?",
  "What are voter rights?",
];

const genericFollowUps = [
  "How do I register to vote?",
  "What happens on voting day?",
  "How are votes counted?",
  "How do I verify election information?",
];

const persuasionPatterns = [
  /\bwho should i vote for\b/i,
  /\bwho to vote for\b/i,
  /\bwhich party should i support\b/i,
  /\bwhich candidate is best\b/i,
  /\btell me who to (choose|vote for)\b/i,
  /\bconvince me to vote for\b/i,
  /\bshould i vote for\b/i,
  /\bpredict who will win\b/i,
  /\bwho will win\b/i,
  /\bmake propaganda\b/i,
  /\bwrite (a )?campaign message\b/i,
  /\bwrite (a )?slogan for\b/i,
  /\brank (the )?(parties|candidates)\b/i,
  /\bbest (party|candidate)\b/i,
];

const topicKeywords: Array<{ key: CivicKnowledgeKey; words: string[] }> = [
  {
    key: "voterRegistration",
    words: ["register", "registration", "new voter", "first-time", "first time", "sign up"],
  },
  {
    key: "voterListVerification",
    words: ["voter list", "electoral roll", "registered", "check my name", "name missing"],
  },
  {
    key: "candidateNomination",
    words: ["candidate nomination", "nomination", "become candidate", "file papers"],
  },
  {
    key: "campaignPeriod",
    words: ["campaign", "model code", "code of conduct", "manifesto", "advertising", "debate"],
  },
  {
    key: "votingDay",
    words: [
      "voting day",
      "polling",
      "polling station",
      "polling place",
      "ballot",
      "evm",
      "postal ballot",
      "vote by mail",
      "booth",
    ],
  },
  {
    key: "voteCounting",
    words: ["count", "counting", "recount", "audit", "ballots secured", "votes counted"],
  },
  {
    key: "resultDeclaration",
    words: ["result", "declared", "declaration", "certified", "exit poll", "projection"],
  },
  {
    key: "governmentFormation",
    words: ["government formation", "coalition", "take office", "swearing", "oath", "majority"],
  },
  {
    key: "voterRights",
    words: ["rights", "intimidation", "assistance", "accessibility", "disabled", "complaint"],
  },
  {
    key: "misinformation",
    words: ["myth", "misinformation", "rumor", "fake", "claim", "useless", "one vote", "not matter"],
  },
  {
    key: "teacherToolkit",
    words: ["lesson plan", "classroom", "teacher", "discussion questions", "activity"],
  },
  {
    key: "studentLearning",
    words: ["student", "like i am", "flashcards", "quiz me", "explain like", "i am 10", "i am 12"],
  },
  {
    key: "electionOverview",
    words: ["timeline", "full election", "election process", "step by step", "overview"],
  },
];

function normalizeMode(mode: ChatMode | LegacyAnswerMode | undefined): ChatMode {
  const normalized = (mode ?? "simple").toString().toLowerCase();

  if (normalized === "detailed" || normalized === "student" || normalized === "teacher") {
    return normalized;
  }

  return "simple";
}

function isDevelopment() {
  return Boolean(import.meta.env.DEV);
}

function logDevError(label: string, error: unknown) {
  if (isDevelopment()) {
    // Keep technical details out of the UI while still making local debugging useful.
    console.error(`[CivicPath AI] ${label}`, error);
  }
}

function createClient(): Promise<GoogleGenAIClient | null> {
  const apiKey = getConfiguredGeminiApiKey();

  if (!apiKey) {
    return Promise.resolve(null);
  }

  return import("@google/genai").then(({ GoogleGenAI }) => new GoogleGenAI({ apiKey }));
}

function isPersuasionRequest(question: string) {
  return persuasionPatterns.some((pattern) => pattern.test(question));
}

function detectKnowledgeKeys(question: string): CivicKnowledgeKey[] {
  const lower = question.toLowerCase();
  const scores = topicKeywords
    .map(({ key, words }) => ({
      key,
      score: words.reduce((total, word) => total + (lower.includes(word) ? 1 : 0), 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.key);

  if (/\b(document|id proof|identity|age proof|address proof|papers)\b/i.test(question)) {
    scores.unshift("voterRegistration");
  }

  if (/\b(deadline|date|when is|last day|schedule)\b/i.test(question)) {
    scores.unshift("electionOverview");
  }

  return Array.from(new Set(scores.length > 0 ? scores : ["electionOverview"]));
}

function getPrimaryTopic(question: string, preferredMode?: ChatMode): CivicKnowledgeTopic {
  if (preferredMode === "teacher" && /lesson|class|teacher|activity|discussion/i.test(question)) {
    return civicKnowledge.teacherToolkit;
  }

  if (preferredMode === "student" && /student|like i am|flashcard|quiz|simple/i.test(question)) {
    return civicKnowledge.studentLearning;
  }

  const [key] = detectKnowledgeKeys(question);
  return civicKnowledge[key] ?? civicKnowledge.electionOverview;
}

function modeInstruction(mode: ChatMode) {
  switch (mode) {
    case "detailed":
      return [
        "Use sections: Quick answer, Step-by-step process, Why it matters, Common mistakes, What to verify officially, Related questions.",
        "Be specific and practical, but do not invent local deadlines or document lists.",
      ].join(" ");
    case "student":
      return [
        "Explain like a school lesson.",
        "Include an analogy, key terms, a mini quiz question, and a remember-this summary.",
      ].join(" ");
    case "teacher":
      return [
        "Provide a classroom explanation with teaching objective, discussion questions, activity idea, short quiz, and neutral teaching note.",
      ].join(" ");
    case "simple":
    default:
      return [
        "Use short sentences, easy words, 3 to 5 bullet-style key points, and one simple example.",
        "Avoid technical terms.",
      ].join(" ");
  }
}

function safeJsonCandidate(raw: string | undefined) {
  if (!raw) {
    return "";
  }

  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
    return cleaned;
  }

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return cleaned.slice(start, end + 1);
  }

  return cleaned;
}

function parseJsonObject<T>(raw: string | undefined): T | null {
  const candidate = safeJsonCandidate(raw);

  if (!candidate) {
    return null;
  }

  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
}

function stringList(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cleaned = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return cleaned.length > 0 ? cleaned : fallback;
}

function confidence(value: unknown): CivicAnswerResult["confidence"] {
  return value === "high" || value === "medium" || value === "low" ? value : "medium";
}

function firstParagraph(text: string) {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .find(Boolean);
}

function normalizeCivicResult(
  raw: Partial<CivicAnswerResult> | null,
  fallbackText: string,
  options: {
    question: string;
    mode: ChatMode;
    usedFallback?: boolean;
    fallbackReason?: string;
  },
): CivicAnswerResult {
  const topic = getPrimaryTopic(options.question, options.mode);
  const answer = typeof raw?.answer === "string" && raw.answer.trim()
    ? raw.answer.trim()
    : fallbackText.trim();
  const fallbackFollowUps = getLocalFollowUps(options.question, topic);

  return {
    answer,
    summary:
      typeof raw?.summary === "string" && raw.summary.trim()
        ? raw.summary.trim()
        : firstParagraph(answer) ?? topic.summary,
    keyPoints: stringList(raw?.keyPoints, topic.steps.slice(0, 4)),
    steps: stringList(raw?.steps, topic.steps),
    example:
      typeof raw?.example === "string" && raw.example.trim()
        ? raw.example.trim()
        : getLocalExample(topic, options.question),
    safetyNote:
      typeof raw?.safetyNote === "string" && raw.safetyNote.trim()
        ? raw.safetyNote.trim()
        : topic.officialVerificationReminder,
    followUps: stringList(raw?.followUps, fallbackFollowUps).slice(0, 5),
    relatedTopics: stringList(raw?.relatedTopics, topic.relatedTopics).slice(0, 6),
    confidence: confidence(raw?.confidence),
    needsOfficialVerification:
      typeof raw?.needsOfficialVerification === "boolean"
        ? raw.needsOfficialVerification
        : true,
    usedFallback: options.usedFallback,
    fallbackReason: options.fallbackReason,
  };
}

function buildConversationContext(messages: ChatMessage[] = []) {
  return messages
    .slice(-10)
    .map((message) => `${message.role === "assistant" ? "Assistant" : "User"}: ${message.content}`)
    .join("\n");
}

function buildLocalKnowledgeContext(question: string, extra?: string) {
  const keys = Array.from(new Set([...detectKnowledgeKeys(question), "safetyAndNeutrality"])).slice(
    0,
    4,
  );
  const topics = keys
    .map((key) => civicKnowledge[key])
    .filter(Boolean)
    .map(
      (topic) =>
        `${topic.title}: ${topic.summary}\nSteps: ${topic.steps.join(" | ")}\nReminder: ${topic.officialVerificationReminder}`,
    )
    .join("\n\n");

  const lessonContext = LESSONS.map(
    (lesson) =>
      `${lesson.title}: ${lesson.description} Sections: ${lesson.sections
        .map((section) => `${section.title} - ${section.content}`)
        .join(" ")}`,
  ).join("\n");

  const timelineContext = TIMELINE_STEPS.map(
    (step) => `${step.title}: ${step.description} ${step.fullExplanation}`,
  ).join("\n");

  const quizContext = QUIZ_QUESTIONS.map(
    (questionItem) => `${questionItem.text} Answer: ${questionItem.options[questionItem.correctIndex]}`,
  ).join("\n");

  return [
    topics,
    extra ? `Additional local context:\n${extra}` : "",
    `App lesson context:\n${lessonContext}`,
    `App timeline context:\n${timelineContext}`,
    `App quiz context:\n${quizContext}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function generateText(prompt: string, mode: ChatMode, responseMimeType = "application/json") {
  const ai = await createClient();

  if (!ai) {
    throw new Error("Gemini API key is missing.");
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: `${CIVIC_SYSTEM_INSTRUCTION}\n\nMode instructions: ${modeInstruction(mode)}`,
      temperature: 0.35,
      maxOutputTokens: mode === "detailed" || mode === "teacher" ? 1700 : 1200,
      responseMimeType,
    },
  });

  return response.text?.trim() ?? "";
}

function getLocalExample(topic: CivicKnowledgeTopic, question: string) {
  if (/document|id|identity|age|address/i.test(question)) {
    return "For example, one location may ask for identity, age, and address proof categories, while another may accept different documents or alternative verification.";
  }

  if (topic.id === "votingDay") {
    return "For example, a voter might check the polling station in the morning, bring locally required ID, join the queue, verify their name, vote privately, and leave without campaigning inside the polling area.";
  }

  if (topic.id === "voteCounting") {
    return "For example, officials may secure ballots after polls close, count them in a controlled area, check totals, and publish only official results after required verification.";
  }

  if (topic.id === "teacherToolkit") {
    return "For example, students can arrange cards for registration, nomination, campaign, voting, counting, and results into the correct timeline.";
  }

  if (topic.id === "studentLearning") {
    return "For example, a class election can show the idea: make a voter list, vote privately, count fairly, and announce the result.";
  }

  return "For example, if a rule mentions a deadline or document, treat it as a local detail and verify it with the official election authority before acting.";
}

function getLocalFollowUps(question: string, topic: CivicKnowledgeTopic) {
  if (topic.id === "safetyAndNeutrality") {
    return neutralEvaluationFollowUps;
  }

  if (/document|id|identity|age|address/i.test(question)) {
    return [
      "How do I check official document requirements?",
      "How do I confirm I am registered?",
      "What should a first-time voter know?",
      "What happens on voting day?",
    ];
  }

  if (/quiz|test me|quiz me/i.test(question)) {
    return [
      "Quiz me on voting day.",
      "Create a quiz on vote counting.",
      "Explain the answer to question 1.",
      "Give me election flashcards.",
    ];
  }

  return topic.commonQuestions.length > 0 ? topic.commonQuestions.slice(0, 4) : genericFollowUps;
}

function getDocumentKeyPoints() {
  return [
    "Document rules depend on your location and election type.",
    "Common categories may include identity, age, and address proof.",
    "Some places offer alternative verification if a voter lacks a standard document.",
    "Use the official election authority checklist before submitting forms or going to vote.",
  ];
}

function buildModeSpecificAnswer(
  params: CivicAnswerParams,
  topic: CivicKnowledgeTopic,
): CivicAnswerResult {
  const { question, mode, language } = params;
  const asksDocuments = /document|id proof|identity|age proof|address proof|papers/i.test(question);
  const asksQuiz = /\b(quiz me|test me|create a quiz|give me a quiz|flashcards)\b/i.test(question);
  const asksDeadline = /\b(deadline|date|when is|last day|schedule)\b/i.test(question);
  const asksMyth =
    /\b(useless|one vote|does not matter|doesn't matter|exit poll|official results|rumor|myth)\b/i.test(
      question,
    );
  const keyPoints = asksDocuments ? getDocumentKeyPoints() : topic.steps.slice(0, 5);
  const officialNote = asksDeadline
    ? "I cannot invent an exact deadline or date. Check the current deadline, required forms, and polling details with your local election authority."
    : topic.officialVerificationReminder;
  const followUps = getLocalFollowUps(question, topic);
  const languageNote =
    language && language !== "en" ? " I can also help translate or restate this if you want." : "";

  if (topic.id === "safetyAndNeutrality" || isPersuasionRequest(question)) {
    return {
      answer: SAFE_REFUSAL,
      summary: "CivicPath AI cannot tell a person who to vote for, but it can explain neutral evaluation criteria.",
      keyPoints: [
        "Compare candidates using the same neutral criteria.",
        "Use official candidate lists, manifestos, public records, and debates.",
        "Separate verified information from rumors or campaign persuasion.",
        "Your voting decision should remain private and personal.",
      ],
      steps: [
        "List the issues that matter to you.",
        "Read each candidate's official material.",
        "Check claims against reliable sources.",
        "Compare records and responsibilities fairly.",
        "Make your own private decision.",
      ],
      example:
        "A neutral comparison might ask: What policies does each candidate publish? What responsibilities does the office actually have? What reliable evidence supports each claim?",
      safetyNote:
        "I can explain election processes and neutral evaluation methods, but I cannot recommend a candidate, party, or voting choice.",
      followUps: neutralEvaluationFollowUps,
      relatedTopics: topic.relatedTopics,
      confidence: "high",
      needsOfficialVerification: false,
      usedFallback: true,
    };
  }

  if (asksQuiz) {
    return {
      answer:
        "Here is a quick neutral learning check. Try answering before you look at the explanations.",
      summary: "A short quiz can help review the election topic without political persuasion.",
      keyPoints: [
        "1. What is the safest source for current election rules?",
        "2. Why should voters check the voter list before election day?",
        "3. Are exit polls the same as official results?",
        "4. What should a neutral civic assistant avoid?",
      ],
      steps: [
        "Answer each question in your own words.",
        "Check the explanation after you answer.",
        "Ask CivicPath AI to generate a focused quiz from any answer.",
      ],
      example:
        "Answer key: official election authority; to catch errors early; no, only official authorities declare results; it should avoid telling people who to vote for.",
      safetyNote: officialNote,
      followUps,
      relatedTopics: ["Quiz", "Student learning", "Official verification"],
      confidence: "high",
      needsOfficialVerification: true,
      usedFallback: true,
    };
  }

  if (asksMyth && /useless|one vote|does not matter|doesn't matter/i.test(question)) {
    return {
      answer:
        "The claim that one vote is useless is misleading. A single vote is one part of a collective decision, and elections only work when eligible people participate. Even when one vote does not decide the final result by itself, voting records public preference, supports representation, and strengthens civic participation.",
      summary: "One vote matters as part of the collective election process.",
      keyPoints: [
        "Elections measure many individual choices together.",
        "Close contests can be affected by small margins.",
        "Voting is also a civic signal of participation.",
        "The practical impact depends on turnout, rules, and the election type.",
      ],
      steps: topic.steps,
      example:
        "Think of a classroom vote: one hand may not be the whole result, but the final decision is made only because each person adds their choice.",
      safetyNote: officialNote,
      followUps: [
        "How can I check election myths?",
        "What are voter rights?",
        "How are votes counted?",
        "How do I verify official results?",
      ],
      relatedTopics: ["Misinformation", "Voter rights", "Vote counting"],
      confidence: "medium",
      needsOfficialVerification: false,
      usedFallback: true,
    };
  }

  switch (mode) {
    case "detailed":
      return {
        answer: [
          `Quick answer: ${asksDocuments ? "The exact documents depend on local rules, but common categories are identity, age, and address proof." : topic.summary}`,
          `Step-by-step process: ${topic.detailedExplanation}`,
          `Why it matters: ${topic.simpleExplanation}`,
          `Common mistakes: ${topic.commonMistakes.join(" ")}`,
          `What to verify officially: ${officialNote}${languageNote}`,
        ].join("\n\n"),
        summary: topic.summary,
        keyPoints,
        steps: topic.steps,
        example: getLocalExample(topic, question),
        safetyNote: officialNote,
        followUps,
        relatedTopics: topic.relatedTopics,
        confidence: "high",
        needsOfficialVerification: true,
        usedFallback: true,
      };
    case "student":
      return {
        answer: [
          `${topic.title} in student language: ${topic.simpleExplanation}`,
          `Analogy: Think of an election like a class choosing a project leader. First the class list is checked, then choices are explained, then students vote privately, then the votes are counted fairly.`,
          `Key terms: voter, ballot, polling station, count, result, official verification.`,
          `Mini quiz: What source should you use to confirm current election rules?`,
          `Remember this: elections are organized steps, not just one voting moment.${languageNote}`,
        ].join("\n\n"),
        summary: `Student summary: ${topic.summary}`,
        keyPoints: [
          topic.simpleExplanation,
          "Rules can be different in different places.",
          "Official sources are the safest place for dates, documents, and locations.",
        ],
        steps: topic.steps,
        example: getLocalExample(civicKnowledge.studentLearning, question),
        safetyNote: officialNote,
        followUps,
        relatedTopics: Array.from(new Set([...topic.relatedTopics, "Student learning"])),
        confidence: "high",
        needsOfficialVerification: true,
        usedFallback: true,
      };
    case "teacher":
      return {
        answer: [
          `Teaching objective: Students will explain ${topic.title.toLowerCase()} as a neutral election-process topic and identify what details require official verification.`,
          `Classroom explanation: ${topic.detailedExplanation}`,
          `Activity idea: Give students cards for each step and ask them to arrange the process in order, then discuss why each step protects fairness and clarity.`,
          `Discussion questions: ${topic.commonQuestions.join(" ")}`,
          `Short quiz: 1. What is the official source for local election rules? 2. Why should voters verify information before acting? 3. What should neutral civic education avoid?`,
          "Neutral teaching note: Keep examples focused on process, rights, responsibilities, and source-checking rather than parties or candidates.",
        ].join("\n\n"),
        summary: `Teacher plan for ${topic.title.toLowerCase()}.`,
        keyPoints: [
          "Objective: explain the process neutrally.",
          "Activity: timeline sort or polling-station role play.",
          "Discussion: rights, responsibilities, and verification.",
          "Assessment: short quiz or exit ticket.",
        ],
        steps: civicKnowledge.teacherToolkit.steps,
        example: getLocalExample(civicKnowledge.teacherToolkit, question),
        safetyNote: officialNote,
        followUps,
        relatedTopics: Array.from(new Set([...topic.relatedTopics, "Teacher toolkit"])),
        confidence: "high",
        needsOfficialVerification: true,
        usedFallback: true,
      };
    case "simple":
    default:
      return {
        answer: `${topic.title}: ${
          asksDocuments
            ? "Documents depend on where you live and what election service you are using. Common categories may include identity, age, and address proof, but the exact list must come from your official election authority."
            : topic.simpleExplanation
        }${languageNote}`,
        summary: topic.summary,
        keyPoints: keyPoints.slice(0, 5),
        steps: topic.steps.slice(0, 5),
        example: getLocalExample(topic, question),
        safetyNote: officialNote,
        followUps,
        relatedTopics: topic.relatedTopics,
        confidence: "high",
        needsOfficialVerification: true,
        usedFallback: true,
      };
  }
}

function normalizeAnswerParams(
  paramsOrQuestion: CivicAnswerParams | string,
  legacyOptions: CivicAnswerOptions = {},
): CivicAnswerParams {
  if (typeof paramsOrQuestion === "string") {
    return {
      question: paramsOrQuestion,
      mode: normalizeMode(legacyOptions.mode),
      userRole: legacyOptions.userRole,
      language: legacyOptions.language,
      conversationHistory: legacyOptions.conversationHistory,
      localKnowledge: legacyOptions.localKnowledge,
    };
  }

  return {
    ...paramsOrQuestion,
    mode: normalizeMode(paramsOrQuestion.mode),
  };
}

function toLegacyResponse(result: CivicAnswerResult): AIChatResponse {
  return {
    text: result.answer,
    suggestedFollowUps: result.followUps,
    usedFallback: Boolean(result.usedFallback),
  };
}

export function getLocalFallbackAnswer(params: CivicAnswerParams): CivicAnswerResult {
  const normalized = normalizeAnswerParams(params);
  const topic = isPersuasionRequest(normalized.question)
    ? civicKnowledge.safetyAndNeutrality
    : getPrimaryTopic(normalized.question, normalized.mode);

  return buildModeSpecificAnswer(normalized, topic);
}

export async function generateCivicAnswer(
  paramsOrQuestion: CivicAnswerParams | string,
  legacyOptions: CivicAnswerOptions = {},
): Promise<CivicAnswerResult> {
  const params = normalizeAnswerParams(paramsOrQuestion, legacyOptions);

  if (isPersuasionRequest(params.question)) {
    return getLocalFallbackAnswer(params);
  }

  if (!getConfiguredGeminiApiKey()) {
    return getLocalFallbackAnswer(params);
  }

  const fallback = getLocalFallbackAnswer(params);

  try {
    const prompt = `
Answer the user's exact civic education question using the app's local election education context.

Question: ${params.question}
Mode: ${params.mode}
User role: ${params.userRole ?? "general learner"}
Preferred language code: ${params.language ?? "en"}

Conversation history:
${buildConversationContext(params.conversationHistory)}

Local knowledge:
${buildLocalKnowledgeContext(params.question, params.localKnowledge)}

Return JSON only in this exact shape:
{
  "answer": "...",
  "summary": "...",
  "keyPoints": ["...", "..."],
  "steps": ["...", "..."],
  "example": "...",
  "safetyNote": "...",
  "followUps": ["...", "...", "..."],
  "relatedTopics": ["...", "..."],
  "confidence": "high",
  "needsOfficialVerification": true
}

Do not begin with a generic phrase such as "I can help explain". Directly answer the question.
`.trim();

    const raw = await generateText(prompt, params.mode);
    const parsed = parseJsonObject<Partial<CivicAnswerResult>>(raw);

    return normalizeCivicResult(parsed, raw || fallback.answer, {
      question: params.question,
      mode: params.mode,
      usedFallback: false,
    });
  } catch (error) {
    logDevError("Gemini answer failed; using local fallback.", error);
    return {
      ...fallback,
      fallbackReason:
        "Civic AI could not reach the live model, so I used the local election education fallback.",
    };
  }
}

export async function generateFollowUpQuestions(params: CivicAnswerParams): Promise<string[]> {
  const normalized = normalizeAnswerParams(params);
  const topic = getPrimaryTopic(normalized.question, normalized.mode);

  if (!getConfiguredGeminiApiKey() || isPersuasionRequest(normalized.question)) {
    return getLocalFollowUps(normalized.question, topic);
  }

  try {
    const raw = await generateText(
      `
Generate 4 neutral follow-up questions for this civic education exchange.

Question: ${normalized.question}
Mode: ${normalized.mode}
Related topic: ${topic.title}

Return JSON only:
{ "followUps": ["...", "...", "...", "..."] }
`.trim(),
      normalized.mode,
    );
    const parsed = parseJsonObject<{ followUps?: string[] }>(raw);
    return stringList(parsed?.followUps, getLocalFollowUps(normalized.question, topic)).slice(0, 4);
  } catch (error) {
    logDevError("Gemini follow-ups failed; using local follow-ups.", error);
    return getLocalFollowUps(normalized.question, topic);
  }
}

export async function simplifyCivicAnswer(
  params: SimplifyCivicAnswerParams,
): Promise<CivicAnswerResult> {
  const source = params.answer.trim();
  const question = params.question?.trim() || "Explain the previous election answer more simply.";
  const fallback = normalizeCivicResult(
    {
      answer: [
        "Here is the simpler version:",
        source
          .replace(/\butilize\b/gi, "use")
          .replace(/\bverification\b/gi, "checking")
          .slice(0, 900),
        "Main idea: follow the official steps, check local rules, and use trusted election sources.",
      ].join("\n\n"),
      summary: "A simpler explanation of the previous answer.",
      keyPoints: [
        "Check whether the rule applies where you live.",
        "Use the official election authority for exact details.",
        "Ask for help early if something is unclear.",
      ],
      followUps: ["Give me an example.", "Quiz me on this.", "What should I verify officially?"],
    },
    source,
    {
      question,
      mode: "simple",
      usedFallback: true,
    },
  );

  if (!getConfiguredGeminiApiKey()) {
    return fallback;
  }

  try {
    const raw = await generateText(
      `
Rewrite this civic education answer in simpler beginner-friendly language. Keep it neutral.

Original answer:
${source}

Conversation history:
${buildConversationContext(params.conversationHistory)}

Return JSON only in this shape:
{
  "answer": "...",
  "summary": "...",
  "keyPoints": ["...", "..."],
  "steps": ["...", "..."],
  "example": "...",
  "safetyNote": "...",
  "followUps": ["...", "...", "..."],
  "relatedTopics": ["...", "..."],
  "confidence": "high",
  "needsOfficialVerification": true
}
`.trim(),
      "simple",
    );
    const parsed = parseJsonObject<Partial<CivicAnswerResult>>(raw);
    return normalizeCivicResult(parsed, raw || fallback.answer, {
      question,
      mode: "simple",
      usedFallback: false,
    });
  } catch (error) {
    logDevError("Gemini simplify failed; using local fallback.", error);
    return {
      ...fallback,
      fallbackReason:
        "Civic AI could not reach the live model, so I used the local election education fallback.",
    };
  }
}

function makeLocalQuiz(title: string, topicText = ""): GeneratedQuiz {
  const lower = topicText.toLowerCase();
  const topic = lower.includes("count")
    ? "vote counting"
    : lower.includes("document")
      ? "registration documents"
      : lower.includes("voting day") || lower.includes("polling")
        ? "voting day"
        : lower.includes("register")
          ? "voter registration"
          : "election process";

  const questions: GeneratedQuizQuestion[] = [
    {
      question: `What is the safest way to confirm current ${topic} rules?`,
      options: [
        "Check the official election authority",
        "Trust a forwarded message",
        "Use an old screenshot",
        "Ask a campaign account only",
      ],
      correctIndex: 0,
      explanation:
        "Election rules vary by location and time, so official election sources are the safest reference.",
    },
    {
      question: "What should neutral civic education avoid?",
      options: [
        "Explaining voting steps",
        "Recommending a party or candidate",
        "Defining key terms",
        "Encouraging official verification",
      ],
      correctIndex: 1,
      explanation:
        "A neutral assistant can explain election processes, but it should not influence a person's voting choice.",
    },
    {
      question: "Why should voters check details early?",
      options: [
        "To fix possible errors before deadlines",
        "To avoid using official sources",
        "To skip registration rules",
        "To treat projections as results",
      ],
      correctIndex: 0,
      explanation:
        "Checking early gives voters time to correct registration, document, or polling-location problems.",
    },
  ];

  return {
    title,
    questions,
    usedFallback: true,
  };
}

function normalizeQuiz(raw: Partial<GeneratedQuiz> | null, fallback: GeneratedQuiz) {
  const questions = Array.isArray(raw?.questions)
    ? raw.questions
        .map((question) => ({
          question: typeof question.question === "string" ? question.question.trim() : "",
          options: Array.isArray(question.options)
            ? question.options.map((option) => String(option).trim()).filter(Boolean)
            : [],
          correctIndex:
            typeof question.correctIndex === "number" && Number.isFinite(question.correctIndex)
              ? question.correctIndex
              : 0,
          explanation:
            typeof question.explanation === "string" && question.explanation.trim()
              ? question.explanation.trim()
              : "Check the official election authority for local details.",
        }))
        .filter((question) => question.question && question.options.length >= 2)
    : [];

  return {
    title:
      typeof raw?.title === "string" && raw.title.trim() ? raw.title.trim() : fallback.title,
    questions: questions.length > 0 ? questions.slice(0, 5) : fallback.questions,
    usedFallback: questions.length === 0 ? fallback.usedFallback : Boolean(raw?.usedFallback),
  };
}

export async function generateQuizFromAnswer(
  paramsOrAnswer: QuizFromAnswerParams | string,
): Promise<GeneratedQuiz> {
  const params =
    typeof paramsOrAnswer === "string"
      ? { answer: paramsOrAnswer, count: 5 }
      : { count: 5, ...paramsOrAnswer };
  const title = params.topic ? `${params.topic} Quiz` : "Civic Learning Check";
  const fallback = makeLocalQuiz(title, params.answer);

  if (!getConfiguredGeminiApiKey()) {
    return fallback;
  }

  try {
    const raw = await generateText(
      `
Create a neutral civic education quiz from this answer.

Source answer:
${params.answer}

Question context: ${params.question ?? "Not provided"}
Conversation history:
${buildConversationContext(params.conversationHistory)}

Return JSON only:
{
  "title": "quiz title",
  "questions": [
    {
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "why this is correct"
    }
  ]
}

Create ${params.count ?? 5} questions. Keep every item neutral and process-focused.
`.trim(),
      "student",
    );
    const parsed = parseJsonObject<Partial<GeneratedQuiz>>(raw);
    return normalizeQuiz(parsed, { ...fallback, usedFallback: false });
  } catch (error) {
    logDevError("Gemini quiz failed; using local quiz.", error);
    return fallback;
  }
}

export async function generateQuizFromTopic(
  topic: string,
  options: QuizTopicOptions = {},
): Promise<GeneratedQuiz> {
  return generateQuizFromAnswer({
    answer: topic,
    topic: options.sourceTitle ?? "Civic Learning",
    count: 5,
  });
}

function buildLocalClaimFallback(claim: string): ElectionClaimClassification {
  const lower = claim.toLowerCase();
  let classification: ElectionClaimClassification["classification"] =
    "Needs official verification";
  let shortExplanation =
    "This claim depends on local election rules or current official guidance.";
  let whyPeopleBelieveThis =
    "Election rules vary by place, so partial information is often repeated as if it applies everywhere.";
  let truth =
    "The safest answer is to check the current guidance from your official election authority.";
  let citizenAction =
    "Look up the official election authority website or contact the local office before relying on the claim.";
  let relatedTopics = ["Official verification", "Election process"];

  if (/one vote|vote.*useless|does not matter|doesn't matter/i.test(lower)) {
    classification = "Misleading";
    shortExplanation =
      "A single vote is part of a collective decision, and participation is how election results are formed.";
    whyPeopleBelieveThis =
      "People may compare one vote to the full result and miss how many individual choices create the total.";
    truth =
      "One vote may not always decide an election alone, but each vote contributes to representation and close contests can turn on small margins.";
    citizenAction = "Participate if eligible and encourage others to verify registration and voting rules.";
    relatedTopics = ["Voter rights", "Participation", "Vote counting"];
  } else if (/exit poll/i.test(lower)) {
    classification = "Misleading";
    shortExplanation = "Exit polls are not official results.";
    whyPeopleBelieveThis =
      "Exit polls are often reported quickly and can sound final before official counting is complete.";
    truth =
      "Only the election authority can declare official results after counting and verification.";
    citizenAction = "Use official result portals and check whether results are certified.";
    relatedTopics = ["Result declaration", "Vote counting", "Misinformation"];
  } else if (/online.*vote|vote.*online/i.test(lower)) {
    classification = "Misleading";
    shortExplanation =
      "Online election services do not automatically mean online voting is available.";
    whyPeopleBelieveThis =
      "People may see online registration or information portals and assume the ballot itself can be submitted online.";
    truth =
      "Approved voting methods vary by location and online voting is uncommon unless explicitly authorized.";
    citizenAction = "Confirm approved voting methods through the official election authority.";
    relatedTopics = ["Voting methods", "Election security", "Official verification"];
  } else if (/document|id|identity|age|address/i.test(lower)) {
    classification = "Needs official verification";
    shortExplanation = "Document requirements vary by location and election type.";
    whyPeopleBelieveThis =
      "A document rule from one place is often shared as if it applies everywhere.";
    truth =
      "Common categories may include identity, age, and address proof, but exact documents must come from official guidance.";
    citizenAction = "Check the official document checklist before registering or voting.";
    relatedTopics = ["Documents", "Registration", "Voting day"];
  }

  return {
    classification,
    shortExplanation,
    whyPeopleBelieveThis,
    truth,
    citizenAction,
    relatedTopics,
    claim,
    usedFallback: true,
    status:
      classification === "Needs official verification" ? "Needs Local Verification" : classification,
    explanation: shortExplanation,
  };
}

export async function classifyElectionClaim(
  paramsOrClaim: ClaimParams | string,
): Promise<ElectionClaimClassification> {
  const claim = typeof paramsOrClaim === "string" ? paramsOrClaim : paramsOrClaim.claim;
  const fallback = buildLocalClaimFallback(claim);

  if (!getConfiguredGeminiApiKey()) {
    return fallback;
  }

  try {
    const raw = await generateText(
      `
Classify this election-process claim without taking a political position.

Claim: ${claim}

Return JSON only:
{
  "classification": "True | False | Misleading | Needs official verification",
  "shortExplanation": "one or two sentence summary",
  "whyPeopleBelieveThis": "neutral explanation of why the claim spreads",
  "truth": "clear civic process explanation",
  "citizenAction": "what the citizen should do next",
  "relatedTopics": ["topic 1", "topic 2"],
  "claim": "original claim"
}
`.trim(),
      "simple",
    );
    const parsed = parseJsonObject<Partial<ElectionClaimClassification>>(raw);
    const classification =
      parsed?.classification === "True" ||
      parsed?.classification === "False" ||
      parsed?.classification === "Misleading" ||
      parsed?.classification === "Needs official verification"
        ? parsed.classification
        : fallback.classification;

    return {
      classification,
      shortExplanation: parsed?.shortExplanation || fallback.shortExplanation,
      whyPeopleBelieveThis: parsed?.whyPeopleBelieveThis || fallback.whyPeopleBelieveThis,
      truth: parsed?.truth || fallback.truth,
      citizenAction: parsed?.citizenAction || fallback.citizenAction,
      relatedTopics: stringList(parsed?.relatedTopics, fallback.relatedTopics),
      claim: parsed?.claim || claim,
      usedFallback: false,
      status:
        classification === "Needs official verification" ? "Needs Local Verification" : classification,
      explanation: parsed?.shortExplanation || fallback.shortExplanation,
    };
  } catch (error) {
    logDevError("Gemini claim classification failed; using local fallback.", error);
    return {
      ...fallback,
      shortExplanation:
        "The live model was unavailable, so CivicPath used a local safety fallback. " +
        fallback.shortExplanation,
    };
  }
}

export async function generateTeacherPlan(
  params: Omit<CivicAnswerParams, "mode"> & { mode?: ChatMode },
): Promise<CivicAnswerResult> {
  return generateCivicAnswer({
    ...params,
    mode: "teacher",
    question: params.question || "Create a neutral classroom lesson plan about elections.",
  });
}

export async function generateStudentSummary(
  params: Omit<CivicAnswerParams, "mode"> & { mode?: ChatMode },
): Promise<CivicAnswerResult> {
  return generateCivicAnswer({
    ...params,
    mode: "student",
    question: params.question || "Explain this election topic for students.",
  });
}

export async function simplifyAnswer(answer: string): Promise<AIChatResponse> {
  return toLegacyResponse(await simplifyCivicAnswer({ answer, mode: "simple" }));
}

export async function translateAnswer(
  answer: string,
  targetLanguage: string,
): Promise<AIChatResponse> {
  if (!getConfiguredGeminiApiKey()) {
    return {
      text: answer,
      suggestedFollowUps: genericFollowUps,
      usedFallback: true,
    };
  }

  try {
    const text = await generateText(
      `
Translate this neutral civic education answer into ${targetLanguage}. Preserve the official verification reminder.

Answer:
${answer}
`.trim(),
      "simple",
      "text/plain",
    );

    return {
      text: text || answer,
      suggestedFollowUps: genericFollowUps,
      usedFallback: false,
    };
  } catch (error) {
    logDevError("Gemini translation failed; returning original answer.", error);
    return {
      text: answer,
      suggestedFollowUps: genericFollowUps,
      usedFallback: true,
    };
  }
}

export async function sendChatMessage(
  question: string,
  userRole?: string,
  language?: string,
): Promise<AIChatResponse> {
  return toLegacyResponse(
    await generateCivicAnswer({
      question,
      mode: "simple",
      userRole,
      language,
    }),
  );
}

export async function checkMyth(claim: string): Promise<MythCheckResponse> {
  return classifyElectionClaim(claim);
}

export function getAllCivicKnowledgeTopics() {
  return civicKnowledgeTopics;
}
