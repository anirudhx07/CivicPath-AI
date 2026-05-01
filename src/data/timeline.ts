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
  },
  {
    id: "ts6",
    title: "Vote Counting",
    description: "Votes are counted under official procedures, observers, and verification rules.",
    fullExplanation: "Vote counting follows a transparent official process. Depending on the location, counts may include machine totals, paper ballots, postal ballots, audits, and reconciliation checks.",
    checklist: ["Follow official updates", "Distinguish projections from certified counts", "Check recount or audit rules"],
    commonQuestions: [
      { q: "Why can counting take time?", a: "Officials may need to verify ballots, reconcile records, and follow legal certification steps before declaring final totals." }
    ]
  },
  {
    id: "ts7",
    title: "Result Declaration",
    description: "Final results are announced after counting, checks, and certification are complete.",
    fullExplanation: "Result declaration is the official announcement of winners or outcomes after the required counting and verification process has been completed.",
    checklist: ["Use official result portals", "Check certification status", "Avoid confusing exit polls with final results"],
    commonQuestions: [
      { q: "Are media projections official?", a: "No. Projections can be informative, but only election authorities can declare official results." }
    ]
  },
  {
    id: "ts8",
    title: "Government Formation",
    description: "Elected representatives take office according to constitutional and legal rules.",
    fullExplanation: "After results are certified, the next government or elected body is formed through the procedures defined by law, such as oath-taking, coalition formation, or appointment steps.",
    checklist: ["Understand transition timelines", "Watch official swearing-in notices", "Track civic responsibilities after election day"],
    commonQuestions: [
      { q: "Does voting end civic participation?", a: "No. Citizens can keep following public decisions, contacting representatives, and participating in civic life." }
    ]
  }
];
