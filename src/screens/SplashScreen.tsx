import { motion } from "motion/react";

interface SplashScreenProps {
  reduceAnimations: boolean;
}

export const SplashScreen = ({ reduceAnimations }: SplashScreenProps) => (
    <div className="h-[100dvh] w-full px-4 flex flex-col items-center justify-center bg-paper text-ink overflow-hidden">
        <motion.div 
            initial={reduceAnimations ? false : { y: 20, opacity: 0 }}
            animate={reduceAnimations ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={{ duration: reduceAnimations ? 0 : 1, ease: "easeOut" }}
            className="flex flex-col items-center"
        >
            <div className="w-24 h-24 border-2 border-ink flex items-center justify-center mb-8 relative">
                <span className="material-symbols-outlined text-[48px]">how_to_vote</span>
                <motion.div 
                    animate={reduceAnimations ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: reduceAnimations ? 0 : Infinity, duration: reduceAnimations ? 0 : 2 }}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-accent flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-white text-xs">auto_awesome</span>
                </motion.div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif italic font-bold tracking-tight mb-4 text-center">CivicPath AI</h1>
            <div className="h-[1px] w-12 bg-ink mb-4" />
            <p className="text-muted tracking-[0.2em] font-bold uppercase text-[10px]">Election Education Archive</p>
        </motion.div>
        
        <div className="absolute bottom-[calc(3rem+env(safe-area-inset-bottom))] flex flex-col items-center gap-4">
            <div className="flex gap-4">
                {[0, 0.3, 0.6].map((delay) => (
                    <motion.div
                        key={delay}
                        animate={reduceAnimations ? { opacity: 1 } : { scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: reduceAnimations ? 0 : Infinity, duration: reduceAnimations ? 0 : 2, delay: reduceAnimations ? 0 : delay }}
                        className="w-1 h-1 bg-ink"
                    />
                ))}
            </div>
        </div>
    </div>
);
