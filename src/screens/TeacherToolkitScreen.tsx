interface TeacherToolkitScreenProps {
  onBack: () => void;
}

export const TeacherToolkitScreen = ({ onBack }: TeacherToolkitScreenProps) => (
    <div className="min-h-screen pt-20 px-8 pb-32 max-w-4xl mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return
        </button>
        <div className="p-12 border border-ink mb-12 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
                <h2 className="text-4xl font-serif italic font-bold mb-4">Classroom Archives</h2>
                <p className="text-muted leading-relaxed">Curated tools and academic resources designed for multi-user classroom environments.</p>
            </div>
            <div className="w-32 h-32 border-2 border-ink text-ink flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-5xl">inventory_2</span>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
                { title: "Syllabus Generator", icon: "auto_fix", desc: "Compose a comprehensive 45-min curriculum based on verifiable data." },
                { title: "Examination Creator", icon: "add_task", desc: "Initialize regional quizzes for verified student groups." },
                { title: "Dialectic Prompts", icon: "forum", desc: "Analytical questions to foster civil discourse in academic settings." },
                { title: "Printable Briefs", icon: "print", desc: "Hard-copy versions of current election roadmap steps." },
            ].map(it => (
                <button key={it.title} className="p-8 border border-border text-left group hover:border-ink transition-all flex flex-col h-full bg-paper/30">
                    <span className="material-symbols-outlined text-muted group-hover:text-ink mb-6">{it.icon}</span>
                    <h4 className="text-xl font-serif italic mb-2 tracking-tight">{it.title}</h4>
                    <p className="text-[11px] text-muted uppercase font-bold tracking-widest leading-relaxed mb-auto">{it.desc}</p>
                    <span className="mt-8 text-[10px] font-black uppercase text-accent tracking-widest border-b border-accent w-fit">Request Access</span>
                </button>
            ))}
        </div>
    </div>
);
