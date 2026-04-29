import type { AccessibilitySettings, Lesson } from "../types";
import { LESSONS } from "../data/lessons";
import { useSpeech } from "../hooks/useSpeech";

interface LessonDetailScreenProps {
  lesson: Lesson;
  accessibilitySettings: AccessibilitySettings;
  onBack: () => void;
  onComplete: (id: string) => void;
}

export const LessonDetailScreen = ({
  lesson,
  accessibilitySettings,
  onBack,
  onComplete,
}: LessonDetailScreenProps) => {
    const { canSpeak, isSpeaking, speechError, speak, stopSpeaking } = useSpeech();
    const lessonNumber = LESSONS.findIndex((item) => item.id === lesson.id) + 1;
    const l = lesson;
    const lessonText = [
      lesson.title,
      lesson.description,
      ...lesson.sections.flatMap((section) => [section.title, section.content]),
    ].join(". ");
    const speechRate = accessibilitySettings.simpleLanguage ? 0.88 : 1;
    return (
        <div className="min-h-screen bg-white pt-[var(--mobile-header-height)] lg:pt-0">
            <header className="sticky top-[var(--mobile-header-height)] lg:top-0 h-16 px-4 sm:px-8 border-b border-border bg-white z-30 flex items-center justify-between gap-4">
                <button onClick={onBack} className="w-11 h-11 -ml-2 text-ink flex items-center justify-center shrink-0"><span className="material-symbols-outlined">arrow_back</span></button>
                <span className="font-serif italic font-bold text-sm truncate min-w-0">{lesson.title}</span>
                <span className="text-[10px] font-black text-accent tracking-tighter">{lesson.sections.length} SECTIONS</span>
            </header>
            <main className="pt-10 pb-[calc(var(--mobile-bottom-nav-height)+8rem)] lg:pb-40 px-4 sm:px-8 max-w-3xl mx-auto space-y-16">
                <div>
                   <span className="pill">Issue 01 • {l.category}</span>
                   <h1 className="text-4xl sm:text-5xl font-serif italic font-bold mt-8 mb-6 break-words">{lesson.title}</h1>
                   <p className="text-lg font-serif italic text-muted leading-relaxed">{lesson.description}</p>
                   <div className="flex flex-wrap gap-3 mt-8">
                      <button
                        type="button"
                        onClick={() => speak(lessonText, { rate: speechRate })}
                        disabled={!canSpeak}
                        className="px-4 py-3 border border-ink bg-white text-ink font-bold uppercase text-[10px] tracking-widest disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-sm align-middle mr-2">volume_up</span>
                        Read Lesson
                      </button>
                      <button
                        type="button"
                        onClick={stopSpeaking}
                        disabled={!isSpeaking}
                        className="px-4 py-3 border border-border bg-paper text-muted font-bold uppercase text-[10px] tracking-widest disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-sm align-middle mr-2">volume_off</span>
                        Stop Speaking
                      </button>
                   </div>
                   {!canSpeak && (
                    <p className="mt-4 text-[10px] uppercase font-bold tracking-widest text-muted">
                      Read-aloud is not supported in this browser.
                    </p>
                   )}
                   {speechError && (
                    <p role="alert" className="mt-4 text-sm font-bold text-red-600">
                      {speechError}
                    </p>
                   )}
                </div>
                
                <div className="space-y-16">
                    {lesson.sections.map((s, idx) => (
                    <div key={s.id} className="space-y-6">
                            <div className="flex items-center gap-4 sm:gap-6 border-b border-border pb-4">
                                <div className="w-10 h-10 border border-ink text-ink flex items-center justify-center font-bold text-xs">0{idx + 1}</div>
                                <h3 className="font-serif italic font-bold text-2xl break-words min-w-0">{s.title}</h3>
                            </div>
                            <p className="text-lg text-ink/90 leading-loose font-serif italic lg:pl-16">{s.content}</p>
                        </div>
                    ))}
                </div>

                <div className="p-6 sm:p-12 border-2 border-ink flex flex-col md:flex-row items-stretch md:items-center gap-8 md:gap-10">
                    <div className="w-20 h-20 bg-ink text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-4xl">menu_book</span>
                    </div>
                    <div>
                        <h4 className="text-xl font-serif italic font-bold mb-2">Academic Support</h4>
                        <p className="text-sm text-muted leading-relaxed">Request a synthesized summary or detailed dialectic analysis of this chapter.</p>
                    </div>
                    <button className="px-8 py-3 bg-ink text-white font-bold uppercase text-[10px] tracking-widest md:ml-auto">Request Info</button>
                </div>
            </main>
            <div className="fixed bottom-[var(--mobile-bottom-nav-height)] lg:bottom-0 left-0 right-0 lg:left-64 z-40 p-4 sm:p-8 bg-white border-t border-ink">
              <div className="max-w-3xl mx-auto flex gap-4">
                <button onClick={() => { onComplete(lesson.id); onBack(); }} className="flex-1 py-6 bg-ink text-white font-bold uppercase text-xs tracking-widest sm:tracking-[0.3em] hover:bg-black transition-colors">
                    Acknowledge Module Completion
                </button>
              </div>
            </div>
        </div>
    );
};
