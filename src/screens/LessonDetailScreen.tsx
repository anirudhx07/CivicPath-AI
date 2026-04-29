import type { Lesson } from "../types";
import { LESSONS } from "../data/lessons";

interface LessonDetailScreenProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (id: string) => void;
}

export const LessonDetailScreen = ({ lesson, onBack, onComplete }: LessonDetailScreenProps) => {
    const lessonNumber = LESSONS.findIndex((item) => item.id === lesson.id) + 1;
    const l = lesson;
    return (
        <div className="min-h-screen bg-white">
            <header className="fixed top-0 left-0 right-0 h-16 px-8 border-b border-border bg-white z-50 flex items-center justify-between">
                <button onClick={onBack} className="p-2 -ml-2 text-ink"><span className="material-symbols-outlined">arrow_back</span></button>
                <span className="font-serif italic font-bold text-sm truncate max-w-[200px]">{lesson.title}</span>
                <span className="text-[10px] font-black text-accent tracking-tighter">{lesson.sections.length} SECTIONS</span>
            </header>
            <main className="pt-24 pb-32 px-8 max-w-3xl mx-auto space-y-16">
                <div>
                   <span className="pill">Issue 01 • {l.category}</span>
                   <h1 className="text-5xl font-serif italic font-bold mt-8 mb-6">{lesson.title}</h1>
                   <p className="text-lg font-serif italic text-muted leading-relaxed">{lesson.description}</p>
                </div>
                
                <div className="space-y-16">
                    {lesson.sections.map((s, idx) => (
                        <div key={s.id} className="space-y-6">
                            <div className="flex items-center gap-6 border-b border-border pb-4">
                                <div className="w-10 h-10 border border-ink text-ink flex items-center justify-center font-bold text-xs">0{idx + 1}</div>
                                <h3 className="font-serif italic font-bold text-2xl">{s.title}</h3>
                            </div>
                            <p className="text-lg text-ink/90 leading-loose font-serif italic lg:pl-16">{s.content}</p>
                        </div>
                    ))}
                </div>

                <div className="p-12 border-2 border-ink flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 bg-ink text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-4xl">menu_book</span>
                    </div>
                    <div>
                        <h4 className="text-xl font-serif italic font-bold mb-2">Academic Support</h4>
                        <p className="text-sm text-muted leading-relaxed">Request a synthesized summary or detailed dialectic analysis of this chapter.</p>
                    </div>
                    <button className="px-8 py-3 bg-ink text-white font-bold uppercase text-[10px] tracking-widest ml-auto">Request Info</button>
                </div>
            </main>
            <div className="fixed bottom-0 left-0 right-0 p-8 bg-white border-t border-ink flex gap-4 max-w-3xl mx-auto md:ml-64">
                <button onClick={() => { onComplete(lesson.id); onBack(); }} className="flex-1 py-6 bg-ink text-white font-bold uppercase text-xs tracking-[0.3em] hover:bg-black transition-colors">
                    Acknowledge Module Completion
                </button>
            </div>
        </div>
    );
};
