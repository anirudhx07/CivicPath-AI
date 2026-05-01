import {
  Accessibility,
  Bell,
  Bookmark,
  ChevronRight,
  GraduationCap,
  LogOut,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";
import { AppScreen } from "../types";
import type { Language, UserProfile, UserRole } from "../types";

interface ProfileScreenProps {
  user: UserProfile;
  onNavigate: (s: AppScreen) => void;
  onSignOut: () => Promise<void>;
  authError: string | null;
  signOutLoading: boolean;
}

const roleLabels: Record<UserRole, string> = {
  "first-time-voter": "First-Time Voter",
  student: "Student",
  teacher: "Teacher",
  citizen: "Citizen",
  volunteer: "Volunteer",
  researcher: "Researcher",
};

const languageLabels: Record<Language, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
};

export const ProfileScreen = ({
  user,
  onNavigate,
  onSignOut,
  authError,
  signOutLoading,
}: ProfileScreenProps) => {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stats = [
    { label: "Readiness", value: `${user.readinessScore}%` },
    { label: "Lessons", value: user.lessonsCompleted.length },
    { label: "Badges", value: user.badges.length },
    { label: "Saved", value: user.savedItems.length },
  ];

  const settings = [
    { label: "Saved Items", desc: "AI answers, myths, lessons, and quiz records", icon: Bookmark, screen: AppScreen.SAVED },
    { label: "Updates", desc: "Learning reminders and badge notifications", icon: Bell, screen: AppScreen.NOTIFICATIONS },
    { label: "Accessibility", desc: "Visual, voice, and learning preferences", icon: Accessibility, screen: AppScreen.ACCESSIBILITY },
    { label: "Teacher Toolkit", desc: "Classroom-friendly civic learning support", icon: GraduationCap, screen: AppScreen.TEACHER_TOOLKIT },
    { label: "Badges", desc: "Your civic learning milestones", icon: Trophy, screen: AppScreen.BADGES },
    { label: "Audit & Safety", desc: "Neutrality, privacy, and prototype data", icon: ShieldCheck, screen: AppScreen.PRIVACY_SAFETY },
  ];

  return (
    <div className="screen-shell screen-shell-lg flex-1">
      <section className="mb-6 screen-card overflow-hidden p-5 sm:p-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-accent to-indigo text-3xl font-black text-white shadow-lg shadow-blue-500/20">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`${user.name} avatar`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                initials || <UserRound size={34} />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black leading-tight text-ink sm:text-4xl">
                  {user.name}
                </h1>
                {user.isGuest && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-warning">
                    Guest
                  </span>
                )}
              </div>
              <p className="mt-2 break-words text-sm font-semibold text-muted">
                {user.isGuest ? "Guest learner" : user.email}
              </p>
              <p className="mt-1 text-sm font-bold text-accent">
                {roleLabels[user.role]} / {languageLabels[user.language]}
              </p>
              {user.isGuest && (
                <p className="mt-3 max-w-xl rounded-2xl bg-amber-50 p-3 text-sm leading-6 text-amber-700">
                  Guest mode: progress is saved only on this device.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-soft-blue p-5 md:w-64">
            <div className="flex items-center gap-3">
              <Sparkles className="text-accent" size={22} />
              <h2 className="font-black text-ink">Readiness</h2>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-accent" style={{ width: `${user.readinessScore}%` }} />
            </div>
            <p className="mt-3 text-2xl font-black text-accent">{user.readinessScore}%</p>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card text-center">
            <p className="text-3xl font-black text-ink">{stat.value}</p>
            <p className="mt-1 text-xs font-bold text-muted">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {settings.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className="screen-card tap-scale flex items-center gap-4 p-5 text-left transition hover:border-accent sm:p-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-soft-blue text-accent">
                <Icon size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-black text-ink">{item.label}</span>
                <span className="mt-1 block text-sm leading-5 text-muted">{item.desc}</span>
              </span>
              <ChevronRight className="shrink-0 text-muted" size={20} />
            </button>
          );
        })}
      </section>

      {authError && (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold leading-6 text-error"
        >
          {authError}
        </p>
      )}

      <button
        type="button"
        onClick={onSignOut}
        disabled={signOutLoading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-black text-error transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut size={18} />
        {signOutLoading ? "Ending Session..." : "Logout"}
      </button>
    </div>
  );
};
