import { Lesson, TimelineStep, QuizQuestion, Badge, Notification, AppScreen } from "./types";

export const LESSONS: Lesson[] = [
  {
    id: "l1",
    title: "Election Basics",
    description: "Understand the fundamental principles of democratic voting and how your voice shapes governance.",
    difficulty: "Beginner",
    timeEstimate: "5 min",
    category: "Basics",
    sections: [
      { id: "s1", title: "What is an election?", content: "An election is a formal group decision-making process by which a population chooses an individual or multiple individuals to hold public office." },
      { id: "s2", title: "The Power of One Vote", content: "Democracy relies on the participation of citizens. Each vote is a voice in determining the future path of the country." }
    ]
  },
  {
    id: "l2",
    title: "Voter Registration",
    description: "Learn how to get on the official voter list and what documents you need to prove your eligibility.",
    difficulty: "Beginner",
    timeEstimate: "8 min",
    category: "Registration",
    sections: [
      { id: "s1", title: "Eligibility Criteria", content: "Usually, you must be a citizen of the country and of a certain age (often 18 or older) to register." },
      { id: "s2", title: "Required Documentation", content: "Proof of identity, age, and address are typically required for a successful registration." }
    ]
  },
  {
    id: "l3",
    title: "Voting Day Guide",
    description: "A complete walkthrough of what happens from the moment you reach the polling station.",
    difficulty: "Beginner",
    timeEstimate: "10 min",
    category: "Process",
    sections: [
      { id: "s1", title: "At the Polling Station", content: "You will be identified, your name checked against the registry, and then guided to a private booth." },
      { id: "s2", title: "Marking the Ballot", content: "Whether digital or paper, ensure you select only the candidates you intend to support and wait for confirmation." }
    ]
  }
];

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: "ts1",
    title: "Voter Registration",
    description: "The first step for any eligible citizen to participate in the democratic process.",
    fullExplanation: "Voter registration is the process of being added to the official list of voters. This ensures that only eligible citizens participate and prevents double voting.",
    checklist: ["Check eligibility", "Gather documents", "Submit form"],
    commonQuestions: [
      { q: "Can I register online?", a: "Many regions now offer online portals, but verify with your local election board." },
      { q: "Do I need to re-register if I move?", a: "Yes, you typically need to update your address to vote in the correct local contests." }
    ]
  },
  {
    id: "ts2",
    title: "Voter List Verification",
    description: "Confirming that your name and details are correctly listed in the published roll.",
    fullExplanation: "Once registration is complete, periodic drafts of the voter list are published. It is the citizen's duty to check for errors.",
    checklist: ["Check official website", "Verify spelling of name", "Confirm address"],
    commonQuestions: [
      { q: "What if my name is missing?", a: "Contact your local election office immediately to provide proof of registration." }
    ]
  },
  {
    id: "ts3",
    title: "Candidate Nomination",
    description: "Individuals stepping forward to run for office and declaring their manifestos.",
    fullExplanation: "Candidates must file official nomination papers and often pay a deposit to enter the election.",
    checklist: ["Research candidates", "Read manifestos", "Attend town halls"],
    commonQuestions: []
  },
   {
    id: "ts4",
    title: "Campaign Period",
    description: "The time when candidates promote their ideas and ask for your vote.",
    fullExplanation: "During this time, citizens are encouraged to evaluate different platforms and ask questions.",
    checklist: ["Watch debates", "Evaluate promises", "Fact-check claims"],
    commonQuestions: []
  },
  {
    id: "ts5",
    title: "Voting Day",
    description: "Cast your vote at your assigned polling station.",
    fullExplanation: "The day when the will of the people is expressed through the ballot box.",
    checklist: ["Find pooling station", "Bring ID", "Verify marking"],
    commonQuestions: []
  }
];

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

export const BADGES: Badge[] = [
  { id: "b1", title: "First Step Learner", description: "Complete your first lesson to begin your civic journey.", icon: "emoji_events", requirement: "Complete 1 lesson" },
  { id: "b2", title: "Registration Ready", description: "Master the knowledge required for voter registration.", icon: "how_to_reg", requirement: "Complete Registration lesson" },
  { id: "b3", title: "Quiz Starter", description: "Complete your first quiz with confidence.", icon: "school", requirement: "Complete 1 quiz" },
  { id: "b4", title: "Voting Day Champion", description: "Understand the entire process of voting day.", icon: "verified_user", requirement: "Complete Voting Day lesson" },
  { id: "b5", title: "Myth Buster", description: "Correctly identify 5 different election myths.", icon: "shutter_speed", requirement: "Analyze 5 myths" },
  { id: "b6", title: "Quiz Master", description: "Achieve a score of 90% or higher in any quiz.", icon: "workspace_premium", requirement: "Score 90%+" },
  { id: "b7", title: "Election Ready Citizen", description: "Reach a 100% readiness score.", icon: "military_tech", requirement: "100% Readiness" }
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Continue Learning", message: "You were halfway through 'Voter Registration'. Finish it now!", type: "lesson", date: "2 hours ago", read: false, link: AppScreen.LEARN },
  { id: "n2", title: "Badge Unlocked!", message: "Congrats! You've earned the 'First Step Learner' badge.", type: "badge", date: "Yesterday", read: true, link: AppScreen.BADGES }
];
