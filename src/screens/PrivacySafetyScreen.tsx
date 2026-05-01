import { ArrowLeft, Database, Flag, LifeBuoy, Scale, ShieldCheck } from "lucide-react";

interface PrivacySafetyScreenProps {
  onBack: () => void;
}

export const PrivacySafetyScreen = ({ onBack }: PrivacySafetyScreenProps) => {
  const cards = [
    {
      title: "Neutral education",
      desc: "CivicPath explains election processes, voter rights, and verification steps without recommending any candidate, party, or ideology.",
      icon: Scale,
    },
    {
      title: "No party promotion",
      desc: "The assistant is constrained to civic-process education and should refuse persuasion or voting-choice requests.",
      icon: Flag,
    },
    {
      title: "Official verification reminder",
      desc: "Rules and deadlines vary by location. The app repeatedly reminds learners to check local election authorities.",
      icon: ShieldCheck,
    },
    {
      title: "Local prototype data",
      desc: "Prototype accounts, guest progress, saved items, and settings are stored locally on this device.",
      icon: Database,
    },
    {
      title: "Report issue",
      desc: "Use this trust view as the submission-ready place to explain safety expectations and collect future feedback.",
      icon: LifeBuoy,
    },
  ];

  return (
    <div className="screen-shell screen-shell-lg min-h-screen">
      <button onClick={onBack} className="ghost-button mb-6">
        <ArrowLeft size={17} />
        Back
      </button>

      <section className="mb-6 screen-card overflow-hidden bg-gradient-to-br from-ink to-indigo p-6 text-white sm:p-8">
        <div className="flex max-w-3xl flex-col gap-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/12 text-white ring-1 ring-white/20">
            <ShieldCheck size={28} />
          </span>
          <div>
            <p className="text-sm font-bold text-white/70">Audit & Safety</p>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">Trust dashboard</h1>
            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              CivicPath AI is a neutral civic education prototype. It is designed to teach process,
              encourage official verification, and avoid political persuasion.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <section key={card.title} className="screen-card p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-blue text-accent">
                  <Icon size={22} />
                </span>
                <h2 className="text-xl font-black text-ink">{card.title}</h2>
              </div>
              <p className="text-sm leading-6 text-muted">{card.desc}</p>
            </section>
          );
        })}
      </div>
    </div>
  );
};
