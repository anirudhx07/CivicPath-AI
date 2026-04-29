import { AppScreen } from "../types";
import type { UserProfile } from "../types";
import { LESSONS } from "../data/lessons";
import { TIMELINE_STEPS } from "../data/timeline";

interface HomeDashboardProps {
  user: UserProfile;
  onNavigate: (s: AppScreen) => void;
}

export const HomeDashboard = ({ user, onNavigate }: HomeDashboardProps) => {
    return (
        <div className="flex-1 flex flex-col pt-24 px-8 pb-32 max-w-5xl mx-auto w-full">
            <section className="mb-12">
                <h1 className="text-4xl font-serif italic font-bold mb-2">Hello, {user.name}</h1>
                <p className="text-muted">Explore your verified election education guide.</p>
            </section>

            <section className="hero-card mb-12">
                <span className="pill bg-white/20 text-white mb-6">Readiness Update</span>
                <h2 className="text-5xl font-serif italic mb-4 leading-tight">Will you be ready<br/>for the next ballot?</h2>
                <p className="text-white/70 mb-8 max-w-md">Complete your learning modules to ensure you can exercise your democratic rights with confidence.</p>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="flex-1 w-full bg-white/10 border border-white/20 p-4 flex justify-between items-center cursor-pointer" onClick={() => onNavigate(AppScreen.AI_GUIDE)}>
                        <span className="text-sm opacity-60">Ask Civic AI a question...</span>
                        <span className="text-[10px] opacity-40 font-mono">CMD K</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="stat-card">
                    <span className="pill mb-4">Learning Progress</span>
                    <div className="text-[80px] font-serif leading-none text-accent mb-2">{user.readinessScore}%</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-ink">Global Readiness Score</div>
                    <p className="text-sm text-muted mt-6 leading-relaxed">
                        You've completed {user.lessonsCompleted.length} of {LESSONS.length} essential modules.
                        You're {LESSONS.length - user.lessonsCompleted.length} steps away from becoming a Certified Citizen.
                    </p>
                </div>

                <div className="stat-card flex flex-col">
                    <span className="pill mb-4">Current Module</span>
                    <h3 className="text-3xl font-serif italic mb-4">The Power of Choice</h3>
                    <p className="text-sm text-muted mb-auto leading-relaxed">
                        Topic: How candidate manifestos shape public policy and your future.
                    </p>
                    <button 
                        onClick={() => onNavigate(AppScreen.LEARN)}
                        className="mt-8 py-4 bg-ink text-white font-bold text-sm tracking-widest uppercase hover:bg-black transition-colors"
                    >
                        Continue Journey
                    </button>
                </div>
            </div>

            <section className="mb-16">
                <div className="flex justify-between items-end mb-8 pb-2 border-b border-ink">
                    <h3 className="text-2xl font-serif italic">Myth vs. Fact</h3>
                    <button onClick={() => onNavigate(AppScreen.MYTH_BUSTER)} className="text-xs font-bold uppercase tracking-widest border-b border-accent text-accent">Verify Claims</button>
                </div>
                <div className="bg-[#FEF2F2] border-l-4 border-[#EF4444] p-8">
                    <span className="text-[10px] font-black uppercase text-[#EF4444] tracking-widest block mb-4">Misleading Claim</span>
                    <p className="text-lg font-serif mb-4 leading-relaxed italic">"Election results are determined by the first exit polls shown on television."</p>
                    <div className="bg-white/50 p-4 text-sm leading-relaxed border border-[#FEE2E2]">
                        <strong>The Fact:</strong> Exit polls are statistical estimates. Official results are only declared after every single vote is manually or digitally counted and verified by the commission.
                    </div>
                </div>
            </section>

            <section className="mb-16">
                <div className="flex justify-between items-end mb-8 pb-2 border-b border-ink">
                    <h3 className="text-2xl font-serif italic">Citizen Timeline</h3>
                    <button onClick={() => onNavigate(AppScreen.TIMELINE)} className="text-xs font-bold uppercase tracking-widest border-b border-accent text-accent">Full Journey</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {TIMELINE_STEPS.slice(0, 4).map((step, idx) => (
                        <div key={step.id} className="p-6 bg-white border border-border flex gap-4">
                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold text-xs border ${user.timelineStepsCompleted.includes(step.id) ? "bg-ink text-white border-ink" : "bg-paper border-border text-muted"}`}>
                                0{idx + 1}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                                <span className={`text-[10px] uppercase font-black tracking-tighter ${user.timelineStepsCompleted.includes(step.id) ? "text-green-600" : "text-muted"}`}>
                                    {user.timelineStepsCompleted.includes(step.id) ? "Completed" : "Locked"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
