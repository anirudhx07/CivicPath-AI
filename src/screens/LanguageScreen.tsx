import { useState } from "react";
import type { Language } from "../types";

interface LanguageScreenProps {
  onNext: (lang: Language) => void;
}

export const LanguageScreen = ({ onNext }: LanguageScreenProps) => {
    const langs: { id: Language; label: string; native: string }[] = [
        { id: "en", label: "English", native: "English" },
        { id: "hi", label: "Hindi", native: "हिन्दी" },
        { id: "bn", label: "Bengali", native: "বাংলা" },
        { id: "ta", label: "Tamil", native: "தமிழ்" },
        { id: "te", label: "Telugu", native: "తెలుగు" },
        { id: "mr", label: "Marathi", native: "मराठी" },
    ];
    const [selected, setSelected] = useState<Language>("en");

    return (
        <div className="min-h-screen px-8 py-12 flex flex-col max-w-lg mx-auto w-full bg-paper">
            <div className="text-center mb-16">
                <div className="w-20 h-20 border border-ink mx-auto mb-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-ink text-3xl">language</span>
                </div>
                <h1 className="text-4xl font-serif italic font-bold mb-4">Linguistic Setting</h1>
                <p className="text-muted leading-relaxed">Select your primary medium for civic discovery and educational records.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-16">
                {langs.map((l) => (
                    <button
                        key={l.id}
                        onClick={() => setSelected(l.id)}
                        className={`flex items-center justify-between p-6 border transition-all ${
                            selected === l.id ? "border-ink bg-ink text-paper" : "border-border bg-white hover:border-ink"
                        }`}
                    >
                        <div className="text-left">
                            <div className="font-serif italic text-lg">{l.label}</div>
                            <div className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${selected === l.id ? "text-paper/60" : "text-muted"}`}>{l.native}</div>
                        </div>
                        {selected === l.id && <span className="material-symbols-outlined text-paper text-sm">verified</span>}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onNext(selected)}
                className="mt-auto w-full py-6 bg-ink text-white font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-black transition-colors"
            >
                Confirm Setting
            </button>
        </div>
    );
};
