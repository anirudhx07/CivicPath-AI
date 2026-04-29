import { AppScreen } from "../types";
import type { UserProfile } from "../types";

interface ProfileScreenProps {
  user: UserProfile;
  onNavigate: (s: AppScreen) => void;
  onSignOut: () => Promise<void>;
  authError: string | null;
  syncLoading: boolean;
  signOutLoading: boolean;
}

export const ProfileScreen = ({
  user,
  onNavigate,
  onSignOut,
  authError,
  syncLoading,
  signOutLoading,
}: ProfileScreenProps) => (
    <div className="flex-1 flex flex-col pt-20 px-8 pb-32 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-8 mb-16">
            <div className="w-24 h-24 bg-ink text-white flex items-center justify-center text-4xl shrink-0 overflow-hidden">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={`${user.name} avatar`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                    user.name[0]
                )}
            </div>
            <div>
                <h2 className="text-4xl font-serif italic font-bold">{user.name}</h2>
                <p className="text-muted text-xs font-bold mt-2">{user.email ?? "Guest session"}</p>
                <p className="text-muted text-[10px] uppercase tracking-[0.2em] font-bold mt-2">{user.role.replace("-", " ")}</p>
                <div className="flex gap-4 mt-4">
                    <button onClick={() => onNavigate(AppScreen.BADGES)} className="text-[10px] font-bold uppercase tracking-widest border-b border-accent text-accent">View Honors</button>
                </div>
            </div>
        </div>

        <section className="grid grid-cols-3 gap-0 border border-border mb-16">
            <div className="p-8 text-center border-r border-border">
                <div className="text-4xl font-serif text-accent mb-2">{user.lessonsCompleted.length}</div>
                <div className="text-[9px] text-muted uppercase font-black tracking-widest">Accreditations</div>
            </div>
            <div className="p-8 text-center border-r border-border">
                <div className="text-4xl font-serif text-accent mb-2">{user.badges.length}</div>
                <div className="text-[9px] text-muted uppercase font-black tracking-widest">Merits</div>
            </div>
            <div className="p-8 text-center">
                <div className="text-4xl font-serif text-accent mb-2">{user.readinessScore}%</div>
                <div className="text-[9px] text-muted uppercase font-black tracking-widest">Readiness</div>
            </div>
        </section>

        <div className="space-y-0 border-t border-border">
            {[
                { label: "Saved Materials", icon: "history_edu", screen: AppScreen.SAVED },
                { label: "Notifications", icon: "mail", screen: AppScreen.NOTIFICATIONS },
                { label: "Accessibility", icon: "settings_accessibility", screen: AppScreen.ACCESSIBILITY },
                { label: "Teacher Toolkit", icon: "auto_stories", screen: AppScreen.TEACHER_TOOLKIT },
                { label: "Privacy Commitment", icon: "verified_user", screen: AppScreen.PRIVACY_SAFETY },
            ].map(item => (
                <button 
                    key={item.label}
                    onClick={() => onNavigate(item.screen)}
                    className="w-full flex items-center justify-between py-6 border-b border-border group hover:pl-2 transition-all"
                >
                    <div className="flex items-center gap-6">
                        <span className="material-symbols-outlined text-muted group-hover:text-ink">{item.icon}</span>
                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-border group-hover:text-ink">arrow_forward_ios</span>
                </button>
            ))}
            {authError && (
                <p role="alert" className="py-4 text-xs leading-relaxed text-red-600 font-bold">
                    {authError}
                </p>
            )}
            {syncLoading && (
                <p className="py-4 text-xs leading-relaxed text-muted font-bold">
                    Syncing learning record...
                </p>
            )}
            <button
                type="button"
                onClick={onSignOut}
                disabled={signOutLoading}
                className="w-full flex items-center gap-6 py-8 text-red-600 font-bold group disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <span className="material-symbols-outlined">power_settings_new</span>
                <span className="text-sm uppercase tracking-widest">{signOutLoading ? "Ending Session" : "Terminate Session"}</span>
            </button>
        </div>
    </div>
);
