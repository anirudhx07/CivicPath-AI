export interface CivicKnowledgeTopic {
  id: string;
  title: string;
  summary: string;
  simpleExplanation: string;
  detailedExplanation: string;
  steps: string[];
  commonQuestions: string[];
  commonMistakes: string[];
  officialVerificationReminder: string;
  relatedTopics: string[];
}

export const civicKnowledge = {
  electionOverview: {
    id: "electionOverview",
    title: "Election Overview",
    summary:
      "An election is a formal process where eligible people choose representatives or decide public questions through an official voting system.",
    simpleExplanation:
      "Elections let eligible voters make a choice in a private and organized way. The process usually includes registration, candidate nomination, campaigning, voting, counting, and official results.",
    detailedExplanation:
      "Most election systems follow a public timeline: eligible voters are registered, candidates or choices are officially listed, campaigns share information, voters cast ballots through approved methods, votes are counted under official rules, and results are declared or certified by the election authority.",
    steps: [
      "Check eligibility and registration rules.",
      "Review the official voter list and correct errors early.",
      "Learn about candidates, issues, and the election timeline from reliable sources.",
      "Vote using an approved method such as in-person, postal, or another official option.",
      "Follow official counting and result updates.",
    ],
    commonQuestions: [
      "Why do elections have many stages?",
      "Who manages elections?",
      "Are projections the same as official results?",
    ],
    commonMistakes: [
      "Assuming election rules are identical everywhere.",
      "Treating social media claims as official instructions.",
      "Confusing campaign messages with neutral civic information.",
    ],
    officialVerificationReminder:
      "Election steps, dates, documents, and voting methods vary by location. Verify current details with your local election authority.",
    relatedTopics: ["Voter registration", "Voting day", "Vote counting", "Results"],
  },
  voterRegistration: {
    id: "voterRegistration",
    title: "Voter Registration",
    summary:
      "Voter registration is the process of adding an eligible person to the official voter list.",
    simpleExplanation:
      "Registration tells election officials that you are eligible to vote and where you should vote. Without being correctly listed, a voter may face delays or may not be able to cast a regular ballot.",
    detailedExplanation:
      "Registration usually asks for eligibility information such as identity, age, citizenship or residency status where applicable, and address. Officials may verify the information before the person's name appears on the voter list.",
    steps: [
      "Check whether you meet the eligibility rules.",
      "Find the official registration method for your area.",
      "Prepare commonly requested proof such as identity, age, and address categories.",
      "Submit the form before the deadline.",
      "Confirm that your name appears correctly on the voter list.",
    ],
    commonQuestions: [
      "How do I register as a first-time voter?",
      "What documents might I need?",
      "Do I need to update my registration after moving?",
    ],
    commonMistakes: [
      "Waiting until the last day to register.",
      "Entering address or name details differently from official documents.",
      "Assuming registration is complete without checking the voter list.",
    ],
    officialVerificationReminder:
      "Exact forms, deadlines, eligibility rules, and document requirements must be checked with the official election authority for your location.",
    relatedTopics: ["Eligibility", "Documents", "Voter list verification", "Deadlines"],
  },
  voterListVerification: {
    id: "voterListVerification",
    title: "Voter List Verification",
    summary:
      "Voter list verification means checking that your name and details appear correctly on the official voter roll.",
    simpleExplanation:
      "After registration, your name should appear on the voter list. Checking early helps you fix mistakes before election day.",
    detailedExplanation:
      "Election authorities maintain voter lists to make sure eligible voters can vote in the correct area and to reduce duplicate or incorrect records. People are often encouraged to review draft or final lists before polling day.",
    steps: [
      "Use the official voter list lookup tool or local election office.",
      "Check your name, address, and assigned voting area.",
      "Report missing or incorrect details as early as possible.",
      "Keep confirmation or reference details if the authority provides them.",
    ],
    commonQuestions: [
      "What if my name is missing?",
      "How do I correct spelling or address errors?",
      "Can I vote if my registration is pending?",
    ],
    commonMistakes: [
      "Checking unofficial lists instead of the official source.",
      "Ignoring small spelling or address errors.",
      "Waiting until polling day to discover a missing name.",
    ],
    officialVerificationReminder:
      "Use only the official voter list service or local election office for final confirmation.",
    relatedTopics: ["Registration", "Polling station", "Voter rights"],
  },
  candidateNomination: {
    id: "candidateNomination",
    title: "Candidate Nomination",
    summary:
      "Candidate nomination is the official process where eligible people apply or are put forward to contest an election.",
    simpleExplanation:
      "Before voters see names on a ballot, candidates usually have to file official papers and meet rules set by the election authority.",
    detailedExplanation:
      "Nomination rules may include eligibility checks, filing forms, signatures, deposits, party endorsement, independent candidate rules, disclosure forms, or deadlines. Requirements depend on the type of election and local law.",
    steps: [
      "Election authority announces nomination rules and dates.",
      "Candidates submit required forms and declarations.",
      "Officials review eligibility and paperwork.",
      "Accepted candidates are listed for the election.",
      "Rejected or challenged nominations follow local appeal or correction rules.",
    ],
    commonQuestions: [
      "Who can become a candidate?",
      "Why can a nomination be rejected?",
      "What is a manifesto?",
    ],
    commonMistakes: [
      "Assuming every interested person automatically appears on the ballot.",
      "Confusing party selection with official nomination.",
      "Treating candidate claims as verified facts without checking records.",
    ],
    officialVerificationReminder:
      "Candidate eligibility, nomination deadlines, and disclosure rules vary by election type and location.",
    relatedTopics: ["Campaigning", "Manifestos", "Election timeline"],
  },
  campaignPeriod: {
    id: "campaignPeriod",
    title: "Campaign Period",
    summary:
      "The campaign period is when candidates and groups communicate their ideas to voters under election rules.",
    simpleExplanation:
      "Campaigning is how voters learn what candidates say they will do. Rules usually exist to keep campaigning fair and orderly.",
    detailedExplanation:
      "Campaign rules can cover spending, advertising, public meetings, media use, silence periods, conduct near polling places, and misinformation. Some places use a model code of conduct or similar campaign rules.",
    steps: [
      "Listen to candidate positions from official or direct sources.",
      "Compare promises with public records and practical responsibilities.",
      "Check whether claims are supported by reliable evidence.",
      "Avoid sharing unverified rumors or manipulated media.",
      "Follow official guidance on campaign rules and reporting violations.",
    ],
    commonQuestions: [
      "What is a campaign rule?",
      "Can campaigning happen near polling stations?",
      "How do I compare manifestos neutrally?",
    ],
    commonMistakes: [
      "Sharing campaign claims without verification.",
      "Assuming a viral post is official.",
      "Confusing neutral civic education with political persuasion.",
    ],
    officialVerificationReminder:
      "Campaign finance, advertising, conduct, and silence-period rules are local legal matters. Verify with the election authority.",
    relatedTopics: ["Misinformation", "Manifestos", "Voter responsibilities"],
  },
  votingDay: {
    id: "votingDay",
    title: "Voting Day",
    summary:
      "Voting day is when eligible voters cast their ballot through an approved process.",
    simpleExplanation:
      "On voting day, voters usually go to an assigned polling station, verify their identity or registration as required, vote privately, and leave once the ballot is cast.",
    detailedExplanation:
      "Polling places are organized to protect privacy, order, accessibility, and election integrity. Depending on local rules, voting may use paper ballots, machines, postal ballots, early voting, or other approved methods.",
    steps: [
      "Before going, check your polling location, hours, and required documents.",
      "At the polling station, follow queue and check-in instructions.",
      "Complete identity or voter-list verification if required.",
      "Cast your vote privately using the approved ballot or device.",
      "Leave the polling area calmly and follow rules about photos, campaigning, or assistance.",
    ],
    commonQuestions: [
      "What happens at the polling station?",
      "Can someone help a voter with accessibility needs?",
      "What should I avoid on voting day?",
    ],
    commonMistakes: [
      "Going to the wrong polling station.",
      "Forgetting locally required documents.",
      "Taking or sharing ballot photos where rules do not allow it.",
    ],
    officialVerificationReminder:
      "Polling place hours, accepted documents, accessibility help, and ballot rules vary. Check official local instructions before voting.",
    relatedTopics: ["Polling station", "Ballot", "Accessibility", "Voter rights"],
  },
  voteCounting: {
    id: "voteCounting",
    title: "Vote Counting",
    summary:
      "Vote counting is the official process of tallying valid votes after voting closes.",
    simpleExplanation:
      "After voting ends, officials secure ballots or voting records, count them under rules, check totals, and prepare official results.",
    detailedExplanation:
      "Counting may involve reconciling voter records, opening ballot boxes, reading machine totals, counting postal ballots, checking disputed ballots, audits, observers, recounts, and certification steps depending on local law.",
    steps: [
      "Voting closes and ballots or voting records are secured.",
      "Officials reconcile records and prepare counting areas.",
      "Votes are counted according to official rules.",
      "Totals are checked, documented, and reviewed.",
      "Official results are declared or certified after required procedures.",
    ],
    commonQuestions: [
      "Why can counting take time?",
      "Are exit polls official results?",
      "What is a recount?",
    ],
    commonMistakes: [
      "Believing delays automatically mean something is wrong.",
      "Treating media projections as official results.",
      "Ignoring postal, provisional, or challenged ballot procedures.",
    ],
    officialVerificationReminder:
      "Counting, recount, audit, and certification rules vary by location and election type.",
    relatedTopics: ["Results", "Election security", "Official verification"],
  },
  resultDeclaration: {
    id: "resultDeclaration",
    title: "Result Declaration",
    summary:
      "Result declaration is the official announcement of election outcomes after counting and required checks.",
    simpleExplanation:
      "Results become official only when the election authority declares or certifies them under the rules.",
    detailedExplanation:
      "Unofficial counts, projections, exit polls, or media estimates may appear before final results. Official declaration usually follows counting, verification, dispute handling, and certification requirements.",
    steps: [
      "Counting totals are completed.",
      "Officials review required forms and checks.",
      "Challenges, recounts, or corrections are handled if applicable.",
      "The election authority declares or certifies official results.",
      "Winning candidates or outcomes move to the next legal step.",
    ],
    commonQuestions: [
      "When are results official?",
      "What is the difference between a projection and a result?",
      "Can results be challenged?",
    ],
    commonMistakes: [
      "Sharing early projections as final results.",
      "Trusting screenshots without official links.",
      "Assuming every election reports results at the same speed.",
    ],
    officialVerificationReminder:
      "Use the official election authority for final results and certification status.",
    relatedTopics: ["Vote counting", "Recounts", "Government formation"],
  },
  governmentFormation: {
    id: "governmentFormation",
    title: "Government Formation",
    summary:
      "Government formation is the process that follows official results, where elected representatives take office according to law.",
    simpleExplanation:
      "After results are official, winners may take an oath, parties may form a majority or coalition, and the new body begins its duties.",
    detailedExplanation:
      "The steps after an election depend on the constitution, election law, office type, and political system. Some systems involve appointments, coalition negotiations, legislative seating, or transition periods.",
    steps: [
      "Official results are declared or certified.",
      "Winning representatives receive confirmation under local rules.",
      "Oath-taking, seating, appointment, or transition steps occur.",
      "A government, council, or elected body begins work.",
      "Citizens continue civic participation by following decisions and contacting representatives.",
    ],
    commonQuestions: [
      "Does the winner take office immediately?",
      "What is a coalition?",
      "What can citizens do after election day?",
    ],
    commonMistakes: [
      "Assuming every system forms government in the same way.",
      "Thinking civic participation ends after voting.",
      "Treating unofficial results as enough for office-taking.",
    ],
    officialVerificationReminder:
      "Transition and office-taking rules depend on the legal system and election type.",
    relatedTopics: ["Results", "Civic responsibilities", "Representatives"],
  },
  voterRights: {
    id: "voterRights",
    title: "Voter Rights",
    summary:
      "Voter rights are protections that help eligible people participate freely, privately, and fairly.",
    simpleExplanation:
      "Voters generally have the right to clear information, privacy, fair treatment, and help when rules allow it.",
    detailedExplanation:
      "Rights and protections can include ballot privacy, accessibility assistance, language support, complaint channels, protection from intimidation, and the ability to correct voter-list errors. Exact rights depend on local law.",
    steps: [
      "Learn your eligibility and voting options from official sources.",
      "Check accessibility, language, or assistance options before voting day.",
      "Report intimidation, misinformation, or process problems through official channels.",
      "Keep records of official confirmations or complaint references.",
    ],
    commonQuestions: [
      "What if I face intimidation?",
      "Can I get assistance at the polling station?",
      "How do I report a problem?",
    ],
    commonMistakes: [
      "Assuming help is unavailable without checking.",
      "Not reporting serious problems through official channels.",
      "Believing privacy protections are optional.",
    ],
    officialVerificationReminder:
      "Voter rights and complaint procedures vary by location. Check local election authority guidance.",
    relatedTopics: ["Accessibility", "Polling station", "Official verification"],
  },
  misinformation: {
    id: "misinformation",
    title: "Misinformation Awareness",
    summary:
      "Misinformation awareness means checking election claims before believing or sharing them.",
    simpleExplanation:
      "Election rumors can confuse voters. A careful voter checks the source, date, evidence, and official guidance before sharing.",
    detailedExplanation:
      "Misinformation can include wrong dates, fake polling locations, misleading result claims, edited media, false document requirements, or persuasion disguised as neutral information. Neutral civic education helps people verify process facts without telling them how to vote.",
    steps: [
      "Pause before sharing urgent or emotional election claims.",
      "Check whether the source is official or clearly reliable.",
      "Look for the date, location, and election type.",
      "Compare with the election authority's current guidance.",
      "Report harmful false information through official or platform channels if appropriate.",
    ],
    commonQuestions: [
      "Are exit polls official results?",
      "Is one vote useless?",
      "How do I check a voting-date claim?",
    ],
    commonMistakes: [
      "Trusting screenshots without links.",
      "Assuming old election rules still apply.",
      "Confusing opinions with verified process facts.",
    ],
    officialVerificationReminder:
      "Use official election sources for dates, polling places, voter lists, documents, and results.",
    relatedTopics: ["Myth checking", "Official verification", "Voter responsibilities"],
  },
  safetyAndNeutrality: {
    id: "safetyAndNeutrality",
    title: "Neutral Civic Guidance",
    summary:
      "CivicPath AI explains election processes but does not recommend parties, candidates, ideologies, or voting choices.",
    simpleExplanation:
      "A neutral assistant can help you compare information fairly, but your voting choice must be your own.",
    detailedExplanation:
      "Neutral election education can explain how to evaluate manifestos, records, debates, policy responsibilities, and sources. It must not persuade a voter, rank political options, create campaign propaganda, or predict results as guidance.",
    steps: [
      "Use official and direct sources for candidate and process information.",
      "Compare issues that matter to you using the same criteria for each candidate.",
      "Separate verified records from promises, opinions, and rumors.",
      "Make your own private voting decision.",
    ],
    commonQuestions: [
      "How can I evaluate candidates neutrally?",
      "What should I look for in a manifesto?",
      "Can AI tell me who to vote for?",
    ],
    commonMistakes: [
      "Treating persuasive content as neutral education.",
      "Using different standards for different candidates.",
      "Asking a tool to make a private voting choice for you.",
    ],
    officialVerificationReminder:
      "Verify candidate lists, manifestos, voting rules, and result information with official or primary sources.",
    relatedTopics: ["Manifestos", "Misinformation", "Voter rights"],
  },
  teacherToolkit: {
    id: "teacherToolkit",
    title: "Teacher Toolkit",
    summary:
      "Teacher resources should explain election processes neutrally and help students practice civic reasoning.",
    simpleExplanation:
      "A good classroom activity teaches steps, vocabulary, fair comparison, and source checking without promoting a political side.",
    detailedExplanation:
      "Election lessons can include objectives, key terms, short explanations, discussion questions, role-play activities, source-checking practice, and quizzes. Teachers should avoid party advocacy and keep examples process-focused.",
    steps: [
      "Set a neutral learning objective.",
      "Explain the election stage with simple vocabulary.",
      "Use a classroom activity such as timeline sorting or polling-station role play.",
      "Ask discussion questions about rights, responsibilities, and verification.",
      "Close with a short quiz or reflection.",
    ],
    commonQuestions: [
      "How do I teach voting day in 20 minutes?",
      "What discussion questions are neutral?",
      "How can students practice fact-checking?",
    ],
    commonMistakes: [
      "Using party examples that feel persuasive.",
      "Skipping official verification reminders.",
      "Making the lesson only about opinions instead of process knowledge.",
    ],
    officialVerificationReminder:
      "Use official election education materials where available and adapt examples to local rules without endorsing parties.",
    relatedTopics: ["Classroom activity", "Student summary", "Quiz"],
  },
  studentLearning: {
    id: "studentLearning",
    title: "Student Learning",
    summary:
      "Student election learning should use simple language, examples, analogies, key terms, and quick checks for understanding.",
    simpleExplanation:
      "Students can learn elections as a step-by-step class project: make a list of voters, explain choices, vote privately, count fairly, and announce results.",
    detailedExplanation:
      "Student-friendly explanations should define key terms, connect election steps to familiar situations, and include small quizzes or flashcards. The focus should be participation, fairness, privacy, and verification.",
    steps: [
      "Learn the main election stages in order.",
      "Practice key words like voter, ballot, candidate, polling station, count, and result.",
      "Use examples and analogies to remember each stage.",
      "Take short quizzes to check understanding.",
    ],
    commonQuestions: [
      "Can you explain elections like I am 10?",
      "Can you give me flashcards?",
      "Can you quiz me on registration?",
    ],
    commonMistakes: [
      "Memorizing words without understanding the process.",
      "Thinking voting is public instead of private.",
      "Forgetting that rules vary by place.",
    ],
    officialVerificationReminder:
      "Classroom explanations are educational. Current rules must still be checked with official election sources.",
    relatedTopics: ["Election basics", "Flashcards", "Quiz", "Voting day"],
  },
} satisfies Record<string, CivicKnowledgeTopic>;

export type CivicKnowledgeKey = keyof typeof civicKnowledge;

export const civicKnowledgeTopics = Object.values(civicKnowledge);
