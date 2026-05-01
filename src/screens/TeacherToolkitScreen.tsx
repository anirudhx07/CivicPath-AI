import { ArrowLeft, FileText, GraduationCap, MessagesSquare, Printer, Wand2 } from "lucide-react";

interface TeacherToolkitScreenProps {
  onBack: () => void;
}

export const TeacherToolkitScreen = ({ onBack }: TeacherToolkitScreenProps) => {
  const tools = [
    {
      title: "Syllabus Generator",
      icon: Wand2,
      desc: "Compose a 45-minute neutral civic lesson plan from verified learning material.",
    },
    {
      title: "Quiz Creator",
      icon: FileText,
      desc: "Create classroom practice questions for election-process topics.",
    },
    {
      title: "Discussion Prompts",
      icon: MessagesSquare,
      desc: "Use guided questions to support civil, non-partisan classroom discussion.",
    },
    {
      title: "Printable Briefs",
      icon: Printer,
      desc: "Prepare printable summaries of timeline steps and lesson concepts.",
    },
  ];

  return (
    <div className="screen-shell screen-shell-lg min-h-screen">
      <button onClick={onBack} className="ghost-button mb-6">
        <ArrowLeft size={17} />
        Back
      </button>
      <section className="mb-6 screen-card p-5 sm:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="page-eyebrow">Teacher Toolkit</p>
            <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Classroom support</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Classroom-friendly tools for neutral civic education and structured learning.
            </p>
          </div>
          <span className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-soft-blue text-accent">
            <GraduationCap size={38} />
          </span>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.title}
              className="screen-card tap-scale flex h-full flex-col items-start p-5 text-left transition hover:border-accent sm:p-6"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-blue text-accent">
                <Icon size={22} />
              </span>
              <h2 className="text-xl font-black text-ink">{tool.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">{tool.desc}</p>
              <span className="secondary-button mt-5 min-h-12 rounded-full px-3 py-2 text-xs">
                Request Access
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
