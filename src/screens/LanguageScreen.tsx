import { useState } from "react";
import { CheckCircle2, Languages } from "lucide-react";
import type { Language } from "../types";

interface LanguageScreenProps {
  onNext: (lang: Language) => void;
}

export const LanguageScreen = ({ onNext }: LanguageScreenProps) => {
  const langs: { id: Language; label: string; native: string }[] = [
    { id: "en", label: "English", native: "English" },
    { id: "hi", label: "Hindi", native: "Hindi" },
    { id: "bn", label: "Bengali", native: "Bengali" },
    { id: "ta", label: "Tamil", native: "Tamil" },
    { id: "te", label: "Telugu", native: "Telugu" },
    { id: "mr", label: "Marathi", native: "Marathi" },
  ];
  const [selected, setSelected] = useState<Language>("en");

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#EFF6FF_0%,#F8FAFC_50%,#FFFFFF_100%)] px-4 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-xl flex-col justify-center">
        <section className="screen-card p-5 sm:p-7">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-accent text-white shadow-lg shadow-blue-500/20">
            <Languages size={30} />
          </div>
          <div className="mt-5 text-center">
            <p className="page-eyebrow">Language</p>
            <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Choose a language</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Select your primary language for civic learning.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            {langs.map((language) => {
              const isSelected = selected === language.id;

              return (
                <button
                  key={language.id}
                  onClick={() => setSelected(language.id)}
                  className={`flex items-center justify-between rounded-3xl border p-4 text-left transition ${
                    isSelected
                      ? "border-blue-200 bg-soft-blue"
                      : "border-border bg-white hover:border-accent"
                  }`}
                >
                  <span>
                    <span className="block text-lg font-black text-ink">{language.label}</span>
                    <span className="block text-sm font-semibold text-muted">{language.native}</span>
                  </span>
                  {isSelected && <CheckCircle2 className="text-success" size={22} />}
                </button>
              );
            })}
          </div>
          <button onClick={() => onNext(selected)} className="primary-button mt-6 w-full">
            Confirm
          </button>
        </section>
      </div>
    </div>
  );
};
