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
        <div className="screen-shell screen-shell-xl flex-1 flex flex-col">
            <section className="mb-12">
                <h1 className="text-3xl sm:text-4xl font-serif italic font-bold mb-2 break-words">Hello, {user.name}</h1>
                <p className="text-muted">Explore your verified election education guide.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-8 items-start">
                <div className="min-w-0">
            <section className="hero-card mb-12 p-6 sm:p-8">
                <span className="pill bg-white/20 text-white mb-6">Readiness Update</span>
                <h2 className="text-4xl sm:text-5xl font-serif italic mb-4 leading-tight">Will you be ready<br className="hidden sm:block"/> for the next ballot?</h2>
                <p className="text-white/70 mb-8 max-w-md">Complete your learning modules to ensure you can exercise your democratic rights with confidence.</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8">
                    <button className="flex-1 w-full bg-white/10 border border-white/20 p-4 flex justify-between items-center cursor-pointer text-left gap-4 min-w-0" onClick={() => onNavigate(AppScreen.AI_GUIDE)}>
                        <span className="text-sm opacity-70 truncate">Ask Civic AI a question...</span>
                        <span className="hidden sm:inline text-[10px] opacity-40 font-mono shrink-0">CMD K</span>
                    </button>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 lg:hidden">
                <div className="stat-card">
                    <span className="pill mb-4">Learning Progress</span>
                    <div className="text-6xl sm:text-[80px] font-serif leading-none text-accent mb-2">{user.readinessScore}%</div>
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 pb-2 border-b border-ink">
                    <h3 className="text-2xl font-serif italic">Myth vs. Fact</h3>
                    <button onClick={() => onNavigate(AppScreen.MYTH_BUSTER)} className="inline-flex items-center min-h-11 text-xs font-bold uppercase tracking-widest border-b border-accent text-accent w-fit">Verify Claims</button>
                </div>
                <div className="bg-[#FEF2F2] border-l-4 border-[#EF4444] p-6 sm:p-8">
                    <span className="text-[10px] font-black uppercase text-[#EF4444] tracking-widest block mb-4">Misleading Claim</span>
                    <p className="text-lg font-serif mb-4 leading-relaxed italic">"Election results are determined by the first exit polls shown on television."</p>
                    <div className="bg-white/50 p-4 text-sm leading-relaxed border border-[#FEE2E2]">
                        <strong>The Fact:</strong> Exit polls are statistical estimates. Official results are only declared after every single vote is manually or digitally counted and verified by the commission.
                    </div>
                </div>
            </section>

            <section className="mb-16">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 pb-2 border-b border-ink">
                    <h3 className="text-2xl font-serif italic">Citizen Timeline</h3>
                    <button onClick={() => onNavigate(AppScreen.TIMELINE)} className="inline-flex items-center min-h-11 text-xs font-bold uppercase tracking-widest border-b border-accent text-accent w-fit">Full Journey</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {TIMELINE_STEPS.slice(0, 4).map((step, idx) => (
                        <div key={step.id} className="p-6 bg-white border border-border flex gap-4 min-w-0">
                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold text-xs border ${user.timelineStepsCompleted.includes(step.id) ? "bg-ink text-white border-ink" : "bg-paper border-border text-muted"}`}>
                                0{idx + 1}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-bold text-sm mb-1 break-words">{step.title}</h4>
                                <span className={`text-[10px] uppercase font-black tracking-tighter ${user.timelineStepsCompleted.includes(step.id) ? "text-green-600" : "text-muted"}`}>
                                    {user.timelineStepsCompleted.includes(step.id) ? "Completed" : "Locked"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
                </div>

                <aside className="hidden lg:block space-y-8 sticky top-8">
                <div className="stat-card">
                    <span className="pill mb-4">Learning Progress</span>
                    <div className="text-6xl font-serif leading-none text-accent mb-2">{user.readinessScore}%</div>
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
                </aside>
            </div>
        </div>
    );
};
