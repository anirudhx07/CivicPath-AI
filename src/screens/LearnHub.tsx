import type { UserProfile } from "../types";
import { LESSONS } from "../data/lessons";

interface LearnHubProps {
  user: UserProfile;
  onOpenLesson: (id: string) => void;
}

export const LearnHub = ({ user, onOpenLesson }: LearnHubProps) => (
    <div className="flex-1 flex flex-col pt-20 px-8 pb-32 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-serif italic font-bold mb-4">Education Portal</h1>
        <p className="text-muted mb-12">Core curriculum for democratic participation.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
            {LESSONS.map(lesson => (
                <button 
                    key={lesson.id}
                    onClick={() => onOpenLesson(lesson.id)}
                    className="p-8 border-r border-b border-border text-left hover:bg-white transition-colors group bg-paper/30"
                >
                    <div className="flex justify-between items-start mb-10">
                         <div className={`w-10 h-10 flex items-center justify-center font-bold text-xs border ${user.lessonsCompleted.includes(lesson.id) ? "bg-ink text-white border-ink" : "bg-white border-border text-muted"}`}>
                            {user.lessonsCompleted.includes(lesson.id) ? "✓" : "→"}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.lessonsCompleted.includes(lesson.id) ? "text-green-600" : "text-ink"}`}>
                            {user.lessonsCompleted.includes(lesson.id) ? "Passed" : lesson.difficulty}
                        </span>
                    </div>
                    <h4 className="text-xl font-serif italic mb-4 leading-snug group-hover:text-accent transition-colors">{lesson.title}</h4>
                    <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-muted">
                        <span>{lesson.timeEstimate}</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);
