import type { TimelineStep } from "../types";

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
    checklist: ["Find polling station", "Bring ID", "Verify marking"],
    commonQuestions: []
  }
];
