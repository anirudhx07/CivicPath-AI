import { AppScreen } from "../types";
import { NOTIFICATIONS } from "../data/notifications";

interface NotificationsScreenProps {
  onBack: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const NotificationsScreen = ({ onBack, onNavigate }: NotificationsScreenProps) => (
    <div className="min-h-screen pt-20 px-8 pb-32 max-w-2xl mx-auto w-full bg-paper">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1 w-fit">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return
        </button>
        <h1 className="text-4xl font-serif italic font-bold mb-4">Official Updates</h1>
        <p className="text-muted mb-12">Dispatch logs regarding your educational progress and accreditation status.</p>
        
        <div className="space-y-0 border border-border">
            {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`p-8 border-b border-border last:border-0 ${n.read ? "bg-paper/30 opacity-60" : "bg-white shadow-[inset_4px_0_0_0_#BC9F8B]"}`}>
                    <div className="flex gap-8">
                        <div className="w-10 h-10 border border-ink flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">{n.type === 'badge' ? "military_tech" : "school"}</span>
                        </div>
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-serif italic font-bold leading-none">{n.title}</h4>
                                <span className="text-[9px] text-muted uppercase font-bold tracking-widest">{n.date}</span>
                            </div>
                            <p className="text-sm text-ink/80 leading-relaxed mb-4">{n.message}</p>
                            <button onClick={() => n.link && onNavigate(n.link)} disabled={!n.link} className="text-[9px] uppercase font-black tracking-[0.2em] text-accent border-b border-accent disabled:text-muted disabled:border-muted">
                                {n.link ? "View Dispatch" : "No Dispatch Link"}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
