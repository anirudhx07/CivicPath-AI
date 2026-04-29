import type { TimelineStep } from "../types";
import { TIMELINE_STEPS } from "../data/timeline";

interface TimelineDetailScreenProps {
  step: TimelineStep;
  onBack: () => void;
}

export const TimelineDetailScreen = ({ step, onBack }: TimelineDetailScreenProps) => {
    const stepNumber = TIMELINE_STEPS.findIndex((item) => item.id === step.id) + 1;

    return (
        <div className="min-h-screen bg-paper pt-[var(--mobile-header-height)] lg:pt-0">
            <header className="min-h-20 px-4 sm:px-8 bg-white border-b border-ink flex items-center justify-between sticky top-[var(--mobile-header-height)] lg:top-0 z-30 gap-4">
                <button onClick={onBack} className="min-w-11 px-2 -ml-2 text-ink uppercase text-[10px] font-black tracking-widest flex items-center gap-2 shrink-0">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Return
                </button>
                <span className="font-serif italic font-bold truncate min-w-0">Documentation Extract</span>
                <div className="w-12 h-12 border border-ink flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs">description</span>
                </div>
            </header>
            <main className="px-4 sm:px-8 py-8 space-y-12 max-w-3xl mx-auto pb-[calc(var(--mobile-bottom-nav-height)+2rem)] lg:pb-32">
                <div className="aspect-[4/3] sm:aspect-[21/9] bg-ink flex items-center justify-center overflow-hidden relative border border-ink">
                    <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-60 grayscale" alt="Process" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent p-5 sm:p-10 flex flex-col justify-end">
                        <span className="pill bg-white text-ink mb-2">Reference Step {String(stepNumber).padStart(2, "0")}</span>
                        <h1 className="text-3xl sm:text-4xl font-serif italic font-bold text-white leading-tight break-words">{step.title}</h1>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-12">
                        <section className="space-y-6">
                            <h3 className="text-2xl font-serif italic font-bold border-b border-ink pb-4">Standardized Requirements</h3>
                            <p className="text-lg font-serif italic text-muted leading-relaxed">
                                {step.fullExplanation}
                            </p>
                            <div className="space-y-4">
                                {step.checklist.map((item, idx) => (
                                    <div key={item} className="p-5 sm:p-8 border border-border bg-white flex gap-4 sm:gap-8 min-w-0">
                                        <div className="text-accent font-serif italic text-3xl shrink-0">0{idx + 1}</div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm uppercase tracking-tight mb-1">Checklist Item</h4>
                                            <p className="text-[11px] text-muted uppercase font-bold tracking-widest leading-relaxed">{item}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {step.commonQuestions.length > 0 && (
                            <section className="space-y-6">
                                <h3 className="text-2xl font-serif italic font-bold border-b border-ink pb-4">Common Questions</h3>
                                <div className="space-y-4">
                                    {step.commonQuestions.map((question) => (
                                        <div key={question.q} className="p-5 sm:p-8 border border-border bg-white space-y-4">
                                            <h4 className="font-bold text-sm uppercase tracking-tight">{question.q}</h4>
                                            <p className="text-sm text-muted leading-relaxed">{question.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                    <div className="space-y-8">
                        <div className="border border-ink p-6 bg-paper">
                            <h4 className="text-xs font-black uppercase tracking-widest text-ink mb-4">Regional Reminder</h4>
                            <div className="space-y-4 border-t border-ink pt-6">
                                <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-muted">Status</span>
                                    <span className="text-ink">{step.description}</span>
                                </div>
                            </div>
                        </div>
                        <div className="border border-border bg-white p-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-ink mb-4">Verify Locally</h4>
                            <p className="text-sm text-muted leading-relaxed">
                                Election dates, deadlines, and required documents vary by location. Always confirm the latest rules with your local election authority.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
