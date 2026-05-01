import { motion } from "motion/react";
import { Sparkles, Vote } from "lucide-react";

interface SplashScreenProps {
  reduceAnimations: boolean;
}

export const SplashScreen = ({ reduceAnimations }: SplashScreenProps) => (
  <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#EFF6FF_0%,#F8FAFC_50%,#FFFFFF_100%)] px-4 text-ink">
    <motion.div
      initial={reduceAnimations ? false : { y: 18, opacity: 0 }}
      animate={reduceAnimations ? { opacity: 1 } : { y: 0, opacity: 1 }}
      transition={{ duration: reduceAnimations ? 0 : 0.7, ease: "easeOut" }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-accent to-indigo text-white shadow-xl shadow-blue-500/20">
        <Vote size={46} />
        <motion.div
          animate={reduceAnimations ? { opacity: 1 } : { scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ repeat: reduceAnimations ? 0 : Infinity, duration: reduceAnimations ? 0 : 2 }}
          className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-warning text-white shadow-md"
        >
          <Sparkles size={16} />
        </motion.div>
      </div>
      <h1 className="text-4xl font-black text-ink sm:text-5xl">CivicPath AI</h1>
      <p className="mt-3 text-sm font-bold text-muted">Neutral election education</p>
    </motion.div>
  </div>
);
