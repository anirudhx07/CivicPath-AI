import type { UserProfile } from "../types";
import { TIMELINE_STEPS } from "../data/timeline";

interface TimelineScreenProps {
  user: UserProfile;
  onOpenStep: (id: string, shouldMarkComplete: boolean) => void;
}

export const TimelineScreen = ({ user, onOpenStep }: TimelineScreenProps) => {
    return (
        <div className="flex-1 flex flex-col pt-20 px-8 pb-32 max-w-4xl mx-auto w-full">
            <h1 className="text-4xl font-serif italic font-bold mb-4">Election Roadmap</h1>
            <p className="text-muted mb-12">A chronological guide to the democratic process, from registration to the final count.</p>
            
            <div className="space-y-0">
                {TIMELINE_STEPS.map((step, idx) => {
                    const isCompleted = user.timelineStepsCompleted.includes(step.id);
                    const isNext = !isCompleted && (idx === 0 || user.timelineStepsCompleted.includes(TIMELINE_STEPS[idx - 1].id));
                    const isLocked = !isCompleted && !isNext;

                    return (
                        <div key={step.id} className={`flex gap-10 border-b border-border py-12 ${isLocked ? "opacity-30" : ""}`}>
                            <div className={`w-12 h-12 shrink-0 flex items-center justify-center font-bold border transition-colors ${
                                isCompleted ? "bg-ink text-white border-ink" : isNext ? "bg-accent text-white border-accent" : "bg-paper border-border text-muted"
                            }`}>
                                0{idx + 1}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-serif italic mb-2">{step.title}</h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-border ${isCompleted ? "text-green-600" : isNext ? "text-accent" : "text-muted"}`}>
                                        {isCompleted ? "Verified" : isNext ? "Active" : "Locked"}
                                    </span>
                                </div>
                                <p className="text-muted leading-relaxed mb-8 max-w-2xl">{step.description}</p>
                                {!isLocked && (
                                    <button 
                                        onClick={() => {
                                            onOpenStep(step.id, isNext);
                                        }}
                                        className="inline-block py-2 border-b-2 border-ink font-bold text-xs uppercase tracking-widest hover:text-muted hover:border-muted transition-all"
                                    >
                                        {isCompleted ? "Review Records" : "Begin Documentation"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
