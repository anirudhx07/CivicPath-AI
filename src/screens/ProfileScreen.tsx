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
}: ProfileScreenProps) => (
  <div className="screen-shell screen-shell-sm flex-1 flex flex-col">
    <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 mb-12 sm:mb-16">
      <div className="w-24 h-24 bg-ink text-white flex items-center justify-center text-4xl shrink-0 overflow-hidden">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.name} avatar`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          user.name[0]
        )}
      </div>
      <div className="min-w-0 w-full">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl sm:text-4xl font-serif italic font-bold break-words">
            {user.name}
          </h2>
          {user.isGuest && (
            <span className="border border-ink px-3 py-1 text-[9px] font-black uppercase tracking-widest">
              Guest Mode
            </span>
          )}
        </div>
        {!user.isGuest && user.email && (
          <p className="text-muted text-xs font-bold mt-2 break-words">{user.email}</p>
        )}
        <p className="text-muted text-[10px] uppercase tracking-[0.2em] font-bold mt-2">
          {roleLabels[user.role]} / {languageLabels[user.language]}
        </p>
        {user.isGuest && (
          <p className="mt-4 text-xs leading-relaxed text-muted max-w-xl">
            You are using guest mode. Your progress is saved only on this device.
          </p>
        )}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => onNavigate(AppScreen.BADGES)}
            className="text-[10px] font-bold uppercase tracking-widest border-b border-accent text-accent"
          >
            View Honors
          </button>
        </div>
      </div>
    </div>

    <section className="grid grid-cols-1 sm:grid-cols-4 gap-0 border border-border mb-12 sm:mb-16">
      <div className="p-6 sm:p-8 text-center border-b sm:border-b-0 sm:border-r border-border">
        <div className="text-4xl font-serif text-accent mb-2">{user.readinessScore}%</div>
        <div className="text-[9px] text-muted uppercase font-black tracking-widest">
          Readiness
        </div>
      </div>
      <div className="p-6 sm:p-8 text-center border-b sm:border-b-0 sm:border-r border-border">
        <div className="text-4xl font-serif text-accent mb-2">
          {user.lessonsCompleted.length}
        </div>
        <div className="text-[9px] text-muted uppercase font-black tracking-widest">
          Lessons
        </div>
      </div>
      <div className="p-6 sm:p-8 text-center border-b sm:border-b-0 sm:border-r border-border">
        <div className="text-4xl font-serif text-accent mb-2">{user.badges.length}</div>
        <div className="text-[9px] text-muted uppercase font-black tracking-widest">Badges</div>
      </div>
      <div className="p-6 sm:p-8 text-center">
        <div className="text-4xl font-serif text-accent mb-2">{user.savedItems.length}</div>
        <div className="text-[9px] text-muted uppercase font-black tracking-widest">
          Saved Items
        </div>
      </div>
    </section>

    <div className="space-y-0 border-t border-border">
      {[
        { label: "Saved Materials", icon: "history_edu", screen: AppScreen.SAVED },
        { label: "Notifications", icon: "mail", screen: AppScreen.NOTIFICATIONS },
        { label: "Accessibility", icon: "settings_accessibility", screen: AppScreen.ACCESSIBILITY },
        { label: "Teacher Toolkit", icon: "auto_stories", screen: AppScreen.TEACHER_TOOLKIT },
        { label: "Privacy Commitment", icon: "verified_user", screen: AppScreen.PRIVACY_SAFETY },
      ].map((item) => (
        <button
          key={item.label}
          onClick={() => onNavigate(item.screen)}
          className="w-full flex items-center justify-between py-6 border-b border-border group hover:pl-2 transition-all"
        >
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <span className="material-symbols-outlined text-muted group-hover:text-ink">
              {item.icon}
            </span>
            <span className="font-bold text-sm tracking-tight break-words">{item.label}</span>
          </div>
          <span className="material-symbols-outlined text-border group-hover:text-ink">
            arrow_forward_ios
          </span>
        </button>
      ))}
      {authError && (
        <p role="alert" className="py-4 text-xs leading-relaxed text-red-600 font-bold">
          {authError}
        </p>
      )}
      <button
        type="button"
        onClick={onSignOut}
        disabled={signOutLoading}
        className="w-full flex items-center gap-6 py-8 text-red-600 font-bold group disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">power_settings_new</span>
        <span className="text-sm uppercase tracking-widest">
          {signOutLoading ? "Ending Session" : "Log Out"}
        </span>
      </button>
    </div>
  </div>
);
