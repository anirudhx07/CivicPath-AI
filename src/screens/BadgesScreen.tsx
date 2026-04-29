import type { UserProfile } from "../types";
import { BADGES } from "../data/badges";

interface BadgesScreenProps {
  user: UserProfile;
  onBack: () => void;
}

export const BadgesScreen = ({ user, onBack }: BadgesScreenProps) => (
    <div className="min-h-screen pt-20 px-8 pb-32 max-w-4xl mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1 w-fit">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return
        </button>
        <h1 className="text-4xl font-serif italic font-bold mb-4">Honors & Merits</h1>
        <p className="text-muted mb-12">An archive of your demonstrated civic competencies and research contributions.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {BADGES.map(badge => {
                const isEarned = user.badges.includes(badge.id);
                return (
                    <div key={badge.id} className={`p-8 border flex flex-col items-center text-center transition-all ${
                        isEarned ? "bg-white border-ink shadow-lg" : "bg-paper/30 border-border opacity-40 grayscale"
                    }`}>
                        <div className={`w-20 h-20 border flex items-center justify-center mb-6 ${
                            isEarned ? "bg-ink text-white border-ink" : "bg-paper border-border text-muted"
                        }`}>
                            <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
                        </div>
                        <h3 className="text-xl font-serif italic font-bold mb-2">{badge.title}</h3>
                        <p className="text-[10px] text-muted uppercase font-bold tracking-widest leading-relaxed">{badge.requirement}</p>
                        {isEarned && (
                            <div className="mt-8 pt-4 border-t border-border w-full">
                                <span className="text-[9px] font-black uppercase text-accent tracking-widest">Authenticated Record</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
);
