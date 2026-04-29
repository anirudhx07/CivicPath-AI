import type { GoogleGenAI as GoogleGenAIClient } from "@google/genai";
import { getGeminiApiKey as getConfiguredGeminiApiKey } from "./env";

export type AnswerMode = "Simple" | "Detailed" | "Student" | "Teacher";

export interface CivicAnswerOptions {
  mode?: AnswerMode;
  userRole?: string;
  language?: string;
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

const MODEL = "gemini-2.5-flash";

const CIVIC_SYSTEM_INSTRUCTION = `
CivicPath AI is a neutral, non-political election process education assistant.
It explains election processes, voter registration, voting day, vote counting, results, voter rights, and civic responsibilities.
It must not recommend political parties, candidates, ideologies, or voting choices.
It must refuse persuasion requests like "who should I vote for".
It should always remind users that official rules vary by location and should be verified with the local election authority.
It should use simple, beginner-friendly language.
`.trim();

const fallbackFollowUps = [
  "What documents might I need to register?",
  "What should I expect on voting day?",
  "How are votes counted and results declared?",
];

function buildLocalClaimFallback(claim: string): ElectionClaimClassification {
  const lower = claim.toLowerCase();
  let fallback: Omit<ElectionClaimClassification, "claim" | "usedFallback"> = {
    classification: "Needs official verification",
    shortExplanation:
      "This claim depends on local election rules or current official guidance.",
    whyPeopleBelieveThis:
      "Election rules can vary by location, so partial information is often repeated as if it applies everywhere.",
    truth:
      "The safest answer is to check the official guidance from your local election authority.",
    citizenAction:
      "Look up your local election office website or contact the authority before relying on the claim.",
    relatedTopics: ["Local election rules", "Voter information", "Official verification"],
    status: "Needs Local Verification",
    explanation:
      "This claim should be checked with your local election authority because rules vary by location.",
  };

  if (lower.includes("educated") || lower.includes("degree") || lower.includes("read and write")) {
    fallback = {
      classification: "False",
      shortExplanation:
        "Voting eligibility is based on election law, not a person's education level.",
      whyPeopleBelieveThis:
        "Some people confuse voter education efforts with legal eligibility requirements.",
      truth:
        "A person does not usually need a school degree or special education level just to be eligible to vote. Exact eligibility rules still depend on local law.",
      citizenAction:
        "Check your local election authority's eligibility page for the official requirements.",
      relatedTopics: ["Voter eligibility", "Registration", "Voter rights"],
      status: "False",
      explanation:
        "Voting eligibility is based on election law, not education level. Verify local requirements with your election authority.",
    };
  } else if (lower.includes("online") && lower.includes("vote")) {
    fallback = {
      classification: "Misleading",
      shortExplanation:
        "Online registration or information tools do not always mean online voting is available.",
      whyPeopleBelieveThis:
        "Many official services are online, so people may assume the ballot itself can also be submitted online.",
      truth:
        "Voting methods vary by location. Some places allow mail, early, or in-person voting, while online voting is uncommon and tightly controlled where available.",
      citizenAction:
        "Use only your local election authority's website to confirm approved voting methods.",
      relatedTopics: ["Voting methods", "Registration portals", "Election security"],
      status: "Misleading",
      explanation:
        "Online election services do not automatically mean online voting is allowed. Verify approved voting methods locally.",
    };
  } else if (lower.includes("result") || lower.includes("count")) {
    fallback = {
      classification: "Misleading",
      shortExplanation:
        "Election results may take time because counting, checking, and certification steps can be required.",
      whyPeopleBelieveThis:
        "Fast unofficial projections can make people expect final official results immediately.",
      truth:
        "Official results are declared only after the required counting and verification process. Timing varies by location.",
      citizenAction:
        "Follow official result updates from the election authority and distinguish projections from certified results.",
      relatedTopics: ["Vote counting", "Result certification", "Election transparency"],
      status: "Misleading",
      explanation:
        "Results usually require counting, checks, and official declaration. Timing varies by location.",
    };
  } else if (lower.includes("id") || lower.includes("document")) {
    fallback = {
      classification: "Needs official verification",
      shortExplanation:
        "ID and document requirements vary widely by jurisdiction.",
      whyPeopleBelieveThis:
        "People often hear a rule from one location and assume it applies everywhere.",
      truth:
        "Some places require specific documents, while others accept different proof or have alternative procedures.",
      citizenAction:
        "Check your local election authority's document checklist before registration or voting day.",
      relatedTopics: ["Voter ID", "Registration documents", "Polling place rules"],
      status: "Needs Local Verification",
      explanation:
        "Document requirements vary by location and should be verified with the local election authority.",
    };
  }

  return {
    claim,
    ...fallback,
    usedFallback: true,
  };
}

async function createClient(): Promise<GoogleGenAIClient | null> {
  const apiKey = getConfiguredGeminiApiKey();

  if (!apiKey) {
    return null;
  }

  const { GoogleGenAI } = await import("@google/genai");
  return new GoogleGenAI({ apiKey });
}

function getModeInstruction(mode: AnswerMode): string {
  switch (mode) {
    case "Detailed":
      return "Answer with clear sections, practical detail, and a short checklist.";
    case "Student":
      return "Answer like a patient civics teacher: define key terms and include one quick learning check.";
    case "Teacher":
      return "Answer with classroom-friendly structure, discussion prompts, and neutral teaching notes.";
    case "Simple":
    default:
      return "Answer briefly using plain language, short paragraphs, and no jargon.";
  }
}

function buildFallbackAnswer(question: string, mode: AnswerMode): AIChatResponse {
  const detail =
    mode === "Detailed" || mode === "Teacher"
      ? " Election processes usually include registration, identity checks, private ballot marking, secure counting, and an official results declaration."
      : "";

  return {
    text:
      `I can help explain the election process in a neutral way. ${question ? "For your question, the safest starting point is to check the official steps published by your local election authority." : "Ask about registration, voting day, counting, results, voter rights, or civic responsibilities."}` +
      detail +
      " Rules and deadlines vary by location, so always verify details with your local election authority.",
    suggestedFollowUps: fallbackFollowUps,
    usedFallback: true,
  };
}

function parseJsonObject<T>(raw: string | undefined, fallback: T): T {
  if (!raw) {
    return fallback;
  }

  try {
    const cleaned = raw
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "");

    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

async function generateText(
  prompt: string,
  mode: AnswerMode = "Simple",
  responseMimeType?: string,
): Promise<string> {
  const ai = await createClient();

  if (!ai) {
    throw new Error("Gemini API key is missing.");
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: `${CIVIC_SYSTEM_INSTRUCTION}\n\nStyle mode: ${mode}. ${getModeInstruction(mode)}`,
      temperature: 0.3,
      maxOutputTokens: 900,
      responseMimeType,
    },
  });

  return response.text?.trim() || "";
}

export async function generateCivicAnswer(
  question: string,
  options: CivicAnswerOptions = {},
): Promise<AIChatResponse> {
  const mode = options.mode ?? "Simple";

  if (!getConfiguredGeminiApiKey()) {
    return buildFallbackAnswer(question, mode);
  }

  const prompt = `
Answer this civic education question.

Question: ${question}
User role: ${options.userRole ?? "general learner"}
Preferred language: ${options.language ?? "English"}

Return JSON only with this shape:
{
  "text": "answer text",
  "suggestedFollowUps": ["question 1", "question 2", "question 3"]
}
`.trim();

  const responseText = await generateText(prompt, mode, "application/json");
  const parsed = parseJsonObject<AIChatResponse>(responseText, {
    text: responseText,
    suggestedFollowUps: fallbackFollowUps,
    usedFallback: false,
  });

  return {
    text: parsed.text || responseText,
    suggestedFollowUps:
      parsed.suggestedFollowUps?.length > 0 ? parsed.suggestedFollowUps : fallbackFollowUps,
    usedFallback: false,
  };
}

export async function generateQuizFromAnswer(answer: string): Promise<GeneratedQuiz> {
  if (!getConfiguredGeminiApiKey()) {
    return {
      title: "Civic Learning Check",
      questions: [
        {
          question: "Where should voters verify local election rules?",
          options: [
            "A local election authority",
            "A campaign advertisement",
            "A social media comment",
            "An unofficial rumor",
          ],
          correctIndex: 0,
          explanation:
            "Election rules vary by location, so official local sources are the safest reference.",
        },
      ],
      usedFallback: true,
    };
  }

  try {
    const responseText = await generateText(
      `
Create a short neutral quiz from this answer:

${answer}

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
`.trim(),
      "Student",
      "application/json",
    );

    const parsed = parseJsonObject<GeneratedQuiz>(responseText, {
      title: "Civic Learning Check",
      questions: [],
      usedFallback: false,
    });

    return {
      title: parsed.title || "Civic Learning Check",
      questions: parsed.questions ?? [],
      usedFallback: false,
    };
  } catch {
    return {
      title: "Civic Learning Check",
      questions: [
        {
          question: "What should learners do before relying on election-process details?",
          options: [
            "Verify with the local election authority",
            "Follow the loudest online post",
            "Assume every location has identical rules",
            "Ignore official deadlines",
          ],
          correctIndex: 0,
          explanation:
            "Election rules and deadlines vary by location, so official local verification is essential.",
        },
      ],
      usedFallback: true,
    };
  }
}

export async function generateQuizFromTopic(
  topic: string,
  options: QuizTopicOptions = {},
): Promise<GeneratedQuiz> {
  const fallbackTitle = options.sourceTitle
    ? `${options.sourceTitle} Check`
    : "Civic Learning Check";

  if (!getConfiguredGeminiApiKey()) {
    return {
      title: fallbackTitle,
      questions: [
        {
          question: `What is the safest way to confirm details about ${options.sourceTitle ?? "an election process"}?`,
          options: [
            "Check the local election authority",
            "Rely on a forwarded message",
            "Use a campaign slogan",
            "Assume rules are identical everywhere",
          ],
          correctIndex: 0,
          explanation:
            "Election rules and deadlines vary by location, so official local sources are the safest reference.",
        },
        {
          question: "What should a neutral civic education tool avoid?",
          options: [
            "Explaining voter rights",
            "Recommending a candidate or party",
            "Describing voting day steps",
            "Encouraging official verification",
          ],
          correctIndex: 1,
          explanation:
            "A neutral civic tool can explain processes, but it must not influence political choices.",
        },
      ],
      usedFallback: true,
    };
  }

  try {
    const responseText = await generateText(
      `
Create a neutral, beginner-friendly civic education quiz from this source.

Source type: ${options.sourceType ?? "topic"}
Source title: ${options.sourceTitle ?? "Civic topic"}
Source material:
${topic}

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

Make 3 to 5 questions. Keep all questions neutral and educational. Do not mention parties, candidates, ideologies, or voting choices.
`.trim(),
      "Student",
      "application/json",
    );

    const parsed = parseJsonObject<GeneratedQuiz>(responseText, {
      title: fallbackTitle,
      questions: [],
      usedFallback: false,
    });

    return {
      title: parsed.title || fallbackTitle,
      questions: parsed.questions ?? [],
      usedFallback: false,
    };
  } catch {
    return {
      title: fallbackTitle,
      questions: [
        {
          question: "Why should election details be checked locally?",
          options: [
            "Rules can vary by location",
            "Unofficial claims are always correct",
            "Voting steps never change",
            "Local authorities do not publish rules",
          ],
          correctIndex: 0,
          explanation:
            "Local election authorities publish the official rules, dates, and requirements for their area.",
        },
      ],
      usedFallback: true,
    };
  }
}

export async function simplifyAnswer(answer: string): Promise<AIChatResponse> {
  if (!getConfiguredGeminiApiKey()) {
    return {
      text: `${answer}\n\nIn simpler terms: check the official steps, follow the local instructions, and ask your election authority if anything is unclear.`,
      suggestedFollowUps: fallbackFollowUps,
      usedFallback: true,
    };
  }

  const text = await generateText(
    `
Rewrite this answer in simpler beginner-friendly language. Keep it neutral and include the reminder to verify local rules.

Answer:
${answer}
`.trim(),
    "Simple",
  );

  return {
    text,
    suggestedFollowUps: fallbackFollowUps,
    usedFallback: false,
  };
}

export async function translateAnswer(
  answer: string,
  targetLanguage: string,
): Promise<AIChatResponse> {
  if (!getConfiguredGeminiApiKey()) {
    return {
      text: answer,
      suggestedFollowUps: fallbackFollowUps,
      usedFallback: true,
    };
  }

  const text = await generateText(
    `
Translate this civic education answer into ${targetLanguage}. Keep the neutral meaning and the reminder to verify local rules.

Answer:
${answer}
`.trim(),
    "Simple",
  );

  return {
    text,
    suggestedFollowUps: fallbackFollowUps,
    usedFallback: false,
  };
}

export async function classifyElectionClaim(
  claim: string,
): Promise<ElectionClaimClassification> {
  if (!getConfiguredGeminiApiKey()) {
    return buildLocalClaimFallback(claim);
  }

  try {
    const responseText = await generateText(
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
      "Simple",
      "application/json",
    );

    const parsed = parseJsonObject<ElectionClaimClassification>(responseText, {
      classification: "Needs official verification",
      shortExplanation:
        responseText || "This claim should be checked with the local election authority.",
      whyPeopleBelieveThis:
        "Election information is often repeated without local context or current official details.",
      truth:
        "Official rules vary by location and should be checked with the local election authority.",
      citizenAction:
        "Verify this claim through your local election authority before acting on it.",
      relatedTopics: ["Official verification", "Election process"],
      claim,
      usedFallback: false,
    });

    return {
      classification: parsed.classification ?? "Needs official verification",
      shortExplanation: parsed.shortExplanation,
      whyPeopleBelieveThis: parsed.whyPeopleBelieveThis,
      truth: parsed.truth,
      citizenAction: parsed.citizenAction,
      relatedTopics: parsed.relatedTopics ?? [],
      claim: parsed.claim ?? claim,
      status:
        parsed.classification === "Needs official verification"
          ? "Needs Local Verification"
          : parsed.classification,
      explanation: parsed.shortExplanation,
      usedFallback: false,
    };
  } catch {
    const fallback = buildLocalClaimFallback(claim);
    return {
      ...fallback,
      shortExplanation:
        "The AI review was unavailable, so CivicPath used a local safety fallback. " +
        fallback.shortExplanation,
    };
  }
}

export async function sendChatMessage(
  question: string,
  userRole?: string,
  language?: string,
): Promise<AIChatResponse> {
  return generateCivicAnswer(question, {
    mode: "Simple",
    userRole,
    language,
  });
}

export async function checkMyth(claim: string): Promise<MythCheckResponse> {
  return classifyElectionClaim(claim);
}
