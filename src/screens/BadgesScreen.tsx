import { ArrowLeft, Lock, Sparkles } from "lucide-react";
import type { UserProfile } from "../types";
import { BADGES } from "../data/badges";

interface BadgesScreenProps {
  user: UserProfile;
  onBack: () => void;
}

export const BadgesScreen = ({ user, onBack }: BadgesScreenProps) => (
  <div className="screen-shell screen-shell-lg min-h-screen">
    <button onClick={onBack} className="ghost-button mb-6">
      <ArrowLeft size={17} />
      Back
    </button>
    <section className="mb-6">
      <p className="page-eyebrow">Badges</p>
      <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Your milestones</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Earn badges as you complete lessons, quizzes, and readiness activities.
      </p>
    </section>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BADGES.map((badge) => {
        const isEarned = user.badges.includes(badge.id);

        return (
          <article
            key={badge.id}
            className={`screen-card p-5 text-center transition sm:p-6 ${
              isEarned ? "border-amber-200 bg-white shadow-md" : "bg-white/70 opacity-75"
            }`}
          >
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] ${
                isEarned ? "bg-amber-50 text-warning" : "bg-paper text-muted"
              }`}
            >
              {isEarned ? (
                <span className="material-symbols-outlined text-4xl">{badge.icon}</span>
              ) : (
                <Lock size={28} />
              )}
            </div>
            <h2 className="mt-5 text-xl font-black text-ink">{badge.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{badge.description}</p>
            <div
              className={`mt-5 rounded-2xl px-3 py-2 text-xs font-bold ${
                isEarned ? "bg-amber-50 text-warning" : "bg-paper text-muted"
              }`}
            >
              {isEarned ? (
                <span className="inline-flex items-center gap-1">
                  <Sparkles size={14} />
                  Unlocked
                </span>
              ) : (
                badge.requirement
              )}
            </div>
          </article>
        );
      })}
    </div>
  </div>
);
