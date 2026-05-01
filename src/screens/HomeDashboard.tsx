import {
  BadgeCheck,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Lightbulb,
  SearchCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { AppScreen } from "../types";
import type { UserProfile } from "../types";
import { LESSONS } from "../data/lessons";
import { TIMELINE_STEPS } from "../data/timeline";

interface HomeDashboardProps {
  user: UserProfile;
  onNavigate: (s: AppScreen) => void;
}

export const HomeDashboard = ({ user, onNavigate }: HomeDashboardProps) => {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const quizAverage =
    user.quizHistory.length > 0
      ? Math.round(
          user.quizHistory.reduce(
            (sum, record) => sum + (record.score / Math.max(record.totalQuestions, 1)) * 100,
            0,
          ) / user.quizHistory.length,
        )
      : 0;

  const stats = [
    { label: "Readiness Score", value: `${user.readinessScore}%`, icon: Brain, tone: "text-accent" },
    { label: "Lessons Completed", value: `${user.lessonsCompleted.length}`, icon: BookOpen, tone: "text-success" },
    { label: "Badges Earned", value: `${user.badges.length}`, icon: Trophy, tone: "text-warning" },
    { label: "Quiz Average", value: quizAverage ? `${quizAverage}%` : "Start", icon: BadgeCheck, tone: "text-indigo" },
  ];

  const actions = [
    { label: "Ask AI Guide", icon: Bot, screen: AppScreen.AI_GUIDE },
    { label: "Explore Timeline", icon: ClipboardList, screen: AppScreen.TIMELINE },
    { label: "Take Quiz", icon: Brain, screen: AppScreen.QUIZ_START },
    { label: "Bust a Myth", icon: SearchCheck, screen: AppScreen.MYTH_BUSTER },
  ];

  const nextLesson =
    LESSONS.find((lesson) => !user.lessonsCompleted.includes(lesson.id)) ?? LESSONS[0];

  return (
    <div className="screen-shell screen-shell-xl flex-1">
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="page-eyebrow">Dashboard</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-ink sm:text-4xl">
            Hello, {user.name} 👋
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Continue your election learning journey.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-blue-100 bg-soft-blue px-4 py-3 sm:block">
            <p className="text-xs font-bold text-muted">Readiness</p>
            <p className="text-lg font-black text-accent">{user.readinessScore}% ready</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(AppScreen.PROFILE)}
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-accent text-sm font-black text-white shadow-md"
            aria-label="Open profile"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.name} avatar`}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              initials
            )}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <main className="min-w-0 space-y-6">
          <section className="hero-card">
            <div className="relative z-10 max-w-2xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20">
                <Sparkles size={14} />
                AI-powered civic education
              </span>
              <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                Understand Elections with Civic AI
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/78 sm:text-base">
                Ask questions, follow the election timeline, complete lessons, and test your
                knowledge with neutral guidance.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onNavigate(AppScreen.AI_GUIDE)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-accent shadow-lg transition hover:-translate-y-0.5"
                >
                  <Bot size={18} />
                  Ask Civic AI
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(AppScreen.LEARN)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/15"
                >
                  <BookOpen size={18} />
                  Continue Learning
                </button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="stat-card tap-scale">
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 ${stat.tone}`}>
                    <Icon size={19} />
                  </div>
                  <p className="text-2xl font-black text-ink">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-muted">{stat.label}</p>
                </div>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="screen-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="page-eyebrow">Quick actions</p>
                  <h3 className="section-title mt-1">Jump back in</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => onNavigate(action.screen)}
                      className="tap-scale flex min-h-28 flex-col items-start justify-between rounded-3xl border border-border bg-paper p-4 text-left transition hover:border-accent hover:bg-soft-blue"
                    >
                      <Icon className="text-accent" size={22} />
                      <span className="text-sm font-extrabold text-ink">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="screen-card overflow-hidden p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="page-eyebrow">Today&apos;s Focus</p>
                  <h3 className="mt-1 text-2xl font-black text-ink">
                    {nextLesson?.title ?? "Voter Registration"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {nextLesson?.description ?? "Build confidence with the next short lesson."}
                  </p>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-soft-blue text-accent">
                  <Clock3 size={28} />
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="status-chip w-fit">
                  <Clock3 size={14} />
                  {nextLesson?.timeEstimate ?? "5 min"} lesson
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(AppScreen.LEARN)}
                  className="primary-button"
                >
                  Start
                </button>
              </div>
            </div>
          </section>

          <section className="screen-card p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="page-eyebrow">Timeline preview</p>
                <h3 className="section-title mt-1">Election journey</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(AppScreen.TIMELINE)}
                className="ghost-button w-fit"
              >
                Full Journey
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {TIMELINE_STEPS.slice(0, 4).map((step, index) => {
                const completed = user.timelineStepsCompleted.includes(step.id);
                const current =
                  !completed &&
                  (index === 0 || user.timelineStepsCompleted.includes(TIMELINE_STEPS[index - 1].id));

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => onNavigate(AppScreen.TIMELINE)}
                    className="rounded-3xl border border-border bg-paper p-4 text-left transition hover:border-accent hover:bg-soft-blue"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-2xl text-xs font-black ${
                          completed
                            ? "bg-green-100 text-success"
                            : current
                              ? "bg-blue-100 text-accent"
                              : "bg-slate-100 text-muted"
                        }`}
                      >
                        {completed ? <CheckCircle2 size={17} /> : `0${index + 1}`}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          completed
                            ? "bg-green-50 text-success"
                            : current
                              ? "bg-blue-50 text-accent"
                              : "bg-slate-100 text-muted"
                        }`}
                      >
                        {completed ? "Completed" : current ? "Current" : "Locked"}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-ink">{step.title}</h4>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{step.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="screen-card border-amber-100 bg-amber-50/70 p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-warning shadow-sm">
                <Lightbulb size={21} />
              </span>
              <div>
                <p className="text-xs font-bold text-warning">Myth preview</p>
                <h3 className="text-xl font-black text-ink">Verify before you share</h3>
              </div>
            </div>
            <p className="text-base font-extrabold leading-7 text-ink">
              Claim: &quot;Election results are determined by exit polls.&quot;
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Fact: Exit polls are estimates. Official results are declared only after votes are
              counted, checked, and certified by the election authority.
            </p>
            <button
              type="button"
              onClick={() => onNavigate(AppScreen.MYTH_BUSTER)}
              className="secondary-button mt-5"
            >
              Verify More Claims
            </button>
          </section>
        </main>

        <aside className="space-y-6 lg:sticky lg:top-8">
          <div className="screen-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="page-eyebrow">Progress</p>
                <h3 className="mt-1 text-xl font-black text-ink">Current module</h3>
              </div>
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-lg font-black text-accent"
                style={{
                  background: `conic-gradient(#2563EB ${user.readinessScore * 3.6}deg, #E2E8F0 0deg)`,
                }}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                  {user.readinessScore}%
                </span>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-indigo"
                style={{ width: `${user.readinessScore}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              You&apos;ve completed {user.lessonsCompleted.length} of {LESSONS.length} lessons and{" "}
              {user.timelineStepsCompleted.length} of {TIMELINE_STEPS.length} journey steps.
            </p>
            <button
              type="button"
              onClick={() => onNavigate(AppScreen.LEARN)}
              className="primary-button mt-5 w-full"
            >
              Continue Learning
            </button>
          </div>

          <div className="screen-card p-5 sm:p-6">
            <p className="page-eyebrow">Badges</p>
            <h3 className="mt-1 text-xl font-black text-ink">Milestones</h3>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {["First lesson", "Timeline", "Quiz"].map((label, index) => (
                <div key={label} className="rounded-2xl border border-border bg-paper p-3 text-center">
                  <Trophy className={index < user.badges.length ? "mx-auto text-warning" : "mx-auto text-muted"} size={22} />
                  <p className="mt-2 text-[11px] font-bold leading-4 text-muted">{label}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onNavigate(AppScreen.BADGES)}
              className="ghost-button mt-4 w-full"
            >
              View all badges
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
