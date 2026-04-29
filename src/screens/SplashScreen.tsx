import { motion } from "motion/react";

export const SplashScreen = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-paper text-ink overflow-hidden">
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
        >
            <div className="w-24 h-24 border-2 border-ink flex items-center justify-center mb-8 relative">
                <span className="material-symbols-outlined text-[48px]">how_to_vote</span>
                <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-accent flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-white text-xs">auto_awesome</span>
                </motion.div>
            </div>
            <h1 className="text-5xl font-serif italic font-bold tracking-tight mb-4">CivicPath AI</h1>
            <div className="h-[1px] w-12 bg-ink mb-4" />
            <p className="text-muted tracking-[0.2em] font-bold uppercase text-[10px]">Election Education Archive</p>
        </motion.div>
        
        <div className="absolute bottom-12 flex flex-col items-center gap-4">
            <div className="flex gap-4">
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }} className="w-1 h-1 bg-ink" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} className="w-1 h-1 bg-ink" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6 }} className="w-1 h-1 bg-ink" />
            </div>
        </div>
    </div>
);
