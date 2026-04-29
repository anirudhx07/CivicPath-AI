import type { QuizQuestion } from "../types";

export const CURRENT_QUIZ_ID = "civic-readiness-quiz";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    text: "What is usually the first step for a new voter?",
    options: ["Vote counting", "Voter registration", "Result declaration", "Campaign speech"],
    correctIndex: 1,
    explanation: "Registration is the essential first step to being recognized as an eligible voter."
  },
  {
    id: "q2",
    text: "What is a voter list?",
    options: ["A list of candidates", "A list of eligible registered voters", "A list of campaign events", "A list of results"],
    correctIndex: 1,
    explanation: "The voter list (or electoral roll) contains the names of everyone who has registered and is eligible to vote."
  },
  {
    id: "q3",
    text: "What happens after voting ends?",
    options: ["Votes are counted", "Campaigning starts", "Registration starts", "Candidates file nomination"],
    correctIndex: 0,
    explanation: "Once polls close, officials begin the secure process of counting all valid ballots."
  },
  {
    id: "q4",
    text: "Can the AI tell users who to vote for?",
    options: ["Yes", "No", "Only sometimes", "Only for local elections"],
    correctIndex: 1,
    explanation: "Educational AI tools must remain neutral and never influence political choice."
  },
  {
    id: "q5",
    text: "What is the purpose of a polling station?",
    options: ["To count money", "To cast votes", "To create campaign posters", "To announce holidays"],
    correctIndex: 1,
    explanation: "Polling stations are the official designated locations where voters go to cast their ballots privately."
  }
];
