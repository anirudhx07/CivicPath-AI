import type { UserProfile, UserRole } from "../types";

interface RoleSelectionScreenProps {
  user: UserProfile;
  onSelect: (role: UserRole) => void;
  onBack: () => void;
}

export const RoleSelectionScreen = ({ user, onBack, onSelect }: RoleSelectionScreenProps) => {
    const roles: { id: UserRole; title: string; desc: string; icon: string }[] = [
        { id: "first-time-voter", title: "First-time voter", desc: "Step-by-step guidance on registration and understanding the ballot.", icon: "badge" },
        { id: "student", title: "Student", desc: "Academic resources, historical context, and structured learning paths.", icon: "school" },
        { id: "teacher", title: "Teacher", desc: "Syllabus planning, classroom prompts, and regional curriculum.", icon: "cast_for_education" },
        { id: "citizen", title: "General citizen", desc: "Overviews of current policies, local issues, and civic engagement.", icon: "groups" },
    ];

    return (
        <div className="min-h-screen px-4 sm:px-8 py-12 sm:py-16 pb-[calc(3rem+env(safe-area-inset-bottom))] flex flex-col max-w-2xl mx-auto w-full bg-paper">
            <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1 w-fit">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Return
            </button>
            <h1 className="text-4xl font-serif italic font-bold mb-4">Educational Identity</h1>
            <p className="text-muted mb-12">Select your perspective to calibrate the Guide's pedagogical focus.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {roles.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => onSelect(r.id)}
                        className={`p-6 sm:p-8 border-2 text-left transition-all relative ${
                            user.role === r.id ? "border-ink bg-white shadow-xl" : "border-border bg-white/50 hover:border-muted"
                        }`}
                    >
                        {user.role === r.id && <span className="absolute top-4 right-4 material-symbols-outlined text-ink">verified</span>}
                        <div className={`w-12 h-12 border flex items-center justify-center mb-6 ${user.role === r.id ? "bg-ink text-white border-ink" : "bg-paper border-border text-muted"}`}>
                            <span className="material-symbols-outlined text-xl">{r.icon}</span>
                        </div>
                        <h3 className="text-xl font-serif italic font-bold mb-2">{r.title}</h3>
                        <p className="text-[11px] uppercase font-bold tracking-widest text-muted leading-relaxed">{r.desc}</p>
                    </button>
                ))}
            </div>
            <button 
                onClick={() => onSelect(user.role)}
                className="mt-16 w-full py-6 bg-ink text-white font-bold uppercase text-[10px] tracking-widest sm:tracking-[0.3em]"
            >
                Continue to Archive
            </button>
        </div>
    );
};
