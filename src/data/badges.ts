import type { Badge } from "../types";

export const BADGES: Badge[] = [
  { id: "b1", title: "First Step Learner", description: "Complete your first lesson to begin your civic journey.", icon: "emoji_events", requirement: "Complete 1 lesson" },
  { id: "b2", title: "Registration Ready", description: "Master the knowledge required for voter registration.", icon: "how_to_reg", requirement: "Complete Registration lesson" },
  { id: "b3", title: "Quiz Starter", description: "Complete your first quiz with confidence.", icon: "school", requirement: "Complete 1 quiz" },
  { id: "b4", title: "Voting Day Champion", description: "Understand the entire process of voting day.", icon: "verified_user", requirement: "Complete Voting Day lesson" },
  { id: "b5", title: "Myth Buster", description: "Correctly identify 5 different election myths.", icon: "shutter_speed", requirement: "Analyze 5 myths" },
  { id: "b6", title: "Quiz Master", description: "Achieve a score of 90% or higher in any quiz.", icon: "workspace_premium", requirement: "Score 90%+" },
  { id: "b7", title: "Election Ready Citizen", description: "Reach a 100% readiness score.", icon: "military_tech", requirement: "100% Readiness" }
];
