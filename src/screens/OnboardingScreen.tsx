import { motion } from "motion/react";

interface OnboardingScreenProps {
  onNext: () => void;
  onSkip: () => void;
  reduceAnimations: boolean;
}

export const OnboardingScreen = ({ onNext, onSkip, reduceAnimations }: OnboardingScreenProps) => {
    return (
        <div className="min-h-screen flex flex-col p-4 sm:p-8 pb-[calc(2rem+env(safe-area-inset-bottom))] max-w-lg mx-auto w-full bg-paper">
            <div className="flex justify-end pt-4 mb-12">
                <button onClick={onSkip} className="text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted/30">Skip Briefing</button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-40 h-40 sm:w-48 sm:h-48 border border-ink flex items-center justify-center mb-12 sm:mb-16 relative">
                    <motion.div 
                        animate={reduceAnimations ? { opacity: 0.16 } : { opacity: [0.1, 0.2, 0.1] }}
                        transition={{ repeat: reduceAnimations ? 0 : Infinity, duration: reduceAnimations ? 0 : 4 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-[84px] sm:text-[100px] text-ink">menu_book</span>
                    </motion.div>
                    <span className="material-symbols-outlined text-[56px] sm:text-[64px] text-ink z-10">smart_toy</span>
                </div>
                <div className="space-y-6 mb-16">
                    <h1 className="text-4xl font-serif italic font-bold">The Civic Assistant</h1>
                    <p className="text-muted leading-relaxed">A specialized non-partisan protocol designed to clarify the nuances of the democratic journey.</p>
                </div>
                
                <div className="w-full space-y-4">
                    <div className="p-6 border border-border bg-white text-left italic font-serif text-sm relative">
                        <div className="absolute -top-2 -left-2 bg-ink text-white text-[8px] font-black uppercase tracking-widest px-1">INQUIRY</div>
                        "How do I verify my registration status?"
                    </div>
                </div>
            </div>
            <div className="pt-16 flex flex-col gap-8">
                <div className="flex justify-center gap-4">
                    <div className="w-8 h-[1px] bg-ink" />
                    <div className="w-8 h-[1px] bg-border" />
                    <div className="w-8 h-[1px] bg-border" />
                </div>
                <button 
                    onClick={onNext}
                    className="w-full py-6 bg-ink text-white font-bold uppercase text-[10px] tracking-widest sm:tracking-[0.3em] hover:bg-black transition-colors"
                >
                    Next Chapter
                </button>
            </div>
        </div>
    );
};
