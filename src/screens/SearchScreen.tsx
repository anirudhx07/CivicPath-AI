import { useState } from "react";
import { AppScreen } from "../types";

interface SearchScreenProps {
  onBack: () => void;
  onNavigate: (s: AppScreen) => void;
}

export const SearchScreen = ({ onBack, onNavigate }: SearchScreenProps) => {
    const [query, setQuery] = useState("");
    return (
        <div className="min-h-screen pt-20 px-8 bg-paper">
            <div className="max-w-4xl mx-auto py-12">
                <div className="flex gap-8 items-center mb-16">
                    <div className="flex-1 bg-white border border-ink flex items-center p-6 gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                        <span className="material-symbols-outlined text-muted">search</span>
                        <input 
                            autoFocus
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search archives, myths, or curricula..." 
                            className="bg-transparent border-none w-full focus:ring-0 outline-none font-serif italic text-xl" 
                        />
                    </div>
                    <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-ink border-b-2 border-ink pb-1">Terminate Search</button>
                </div>
                
                {query ? (
                    <div className="space-y-12">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted border-b border-border pb-4">Query Results</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <button onClick={() => onNavigate(AppScreen.LESSON_DETAIL)} className="p-8 bg-white border border-border group hover:border-ink text-left transition-all">
                               <div className="flex justify-between items-start mb-6">
                                   <div className="w-10 h-10 border border-ink flex items-center justify-center font-bold text-xs">01</div>
                                   <span className="pill">Issue 01</span>
                               </div>
                               <h4 className="text-2xl font-serif italic font-bold mb-2 group-hover:text-accent">Voter Registration Process</h4>
                               <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Found in Core Educational Curriculum</p>
                           </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center text-center opacity-40">
                        <span className="material-symbols-outlined text-8xl text-ink mb-8">document_scanner</span>
                        <p className="text-xl font-serif italic max-w-sm">Awaiting input for centralized archive investigation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
