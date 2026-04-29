import { AppScreen } from "../types";
import type { Notification } from "../types";

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Continue Learning", message: "You were halfway through 'Voter Registration'. Finish it now!", type: "lesson", date: "2 hours ago", read: false, link: AppScreen.LEARN },
  { id: "n2", title: "Badge Unlocked!", message: "Congrats! You've earned the 'First Step Learner' badge.", type: "badge", date: "Yesterday", read: true, link: AppScreen.BADGES }
];
