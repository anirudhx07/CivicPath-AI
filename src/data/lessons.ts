import type { Lesson } from "../types";

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
