import { ArrowLeft, CheckCircle2, GraduationCap, School, Users, Vote } from "lucide-react";
import type { UserProfile, UserRole } from "../types";

interface RoleSelectionScreenProps {
  user: UserProfile;
  onSelect: (role: UserRole) => void;
  onBack: () => void;
}

export const RoleSelectionScreen = ({ user, onBack, onSelect }: RoleSelectionScreenProps) => {
  const roles: { id: UserRole; title: string; desc: string; icon: typeof Vote }[] = [
    {
      id: "first-time-voter",
      title: "First-time voter",
      desc: "Step-by-step guidance on registration and understanding the ballot.",
      icon: Vote,
    },
    {
      id: "student",
      title: "Student",
      desc: "Structured learning paths, definitions, and quick checks.",
      icon: School,
    },
    {
      id: "teacher",
      title: "Teacher",
      desc: "Classroom prompts, lesson ideas, and neutral teaching notes.",
      icon: GraduationCap,
    },
    {
      id: "citizen",
      title: "General citizen",
      desc: "Clear overviews of election processes and civic responsibilities.",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#EFF6FF_0%,#F8FAFC_50%,#FFFFFF_100%)] px-4 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col justify-center">
        <button onClick={onBack} className="ghost-button mb-6 w-fit">
          <ArrowLeft size={17} />
          Back
        </button>
        <section className="screen-card p-5 sm:p-7">
          <p className="page-eyebrow">Learning setup</p>
          <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Choose your learning role</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            This adjusts tone and examples while keeping CivicPath neutral and process-focused.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {roles.map((role) => {
              const Icon = role.icon;
              const selected = user.role === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => onSelect(role.id)}
                  className={`rounded-3xl border p-5 text-left transition ${
                    selected
                      ? "border-blue-200 bg-soft-blue shadow-sm"
                      : "border-border bg-white hover:border-accent"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-accent">
                      <Icon size={22} />
                    </span>
                    {selected && <CheckCircle2 className="text-success" size={22} />}
                  </div>
                  <h2 className="text-xl font-black text-ink">{role.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{role.desc}</p>
                </button>
              );
            })}
          </div>
          <button onClick={() => onSelect(user.role)} className="primary-button mt-6 w-full">
            Continue
          </button>
        </section>
      </div>
    </div>
  );
};
