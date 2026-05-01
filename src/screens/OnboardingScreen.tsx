import { motion } from "motion/react";
import { Bot, MessageCircle, Sparkles } from "lucide-react";

interface OnboardingScreenProps {
  onNext: () => void;
  onSkip: () => void;
  reduceAnimations: boolean;
}

export const OnboardingScreen = ({ onNext, onSkip, reduceAnimations }: OnboardingScreenProps) => (
  <div className="min-h-screen bg-[linear-gradient(135deg,#EFF6FF_0%,#F8FAFC_55%,#FFFFFF_100%)] px-4 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-8">
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col">
      <div className="flex justify-end">
        <button onClick={onSkip} className="ghost-button">
          Skip
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          animate={reduceAnimations ? { opacity: 1 } : { y: [0, -6, 0] }}
          transition={{ repeat: reduceAnimations ? 0 : Infinity, duration: reduceAnimations ? 0 : 4 }}
          className="mb-8 flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-accent to-indigo text-white shadow-xl shadow-blue-500/20"
        >
          <Bot size={58} />
        </motion.div>
        <p className="page-eyebrow">Welcome</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Meet your Civic AI Guide</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-muted">
          Ask neutral questions, learn each election step, save useful answers, and practice with
          quizzes built for civic understanding.
        </p>

        <div className="mt-8 w-full rounded-3xl border border-border bg-white p-5 text-left shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <MessageCircle className="text-accent" size={20} />
            <p className="font-black text-ink">Try asking</p>
          </div>
          <p className="text-sm leading-6 text-muted">How do I verify my voter registration?</p>
        </div>
      </div>
      <button onClick={onNext} className="primary-button w-full">
        <Sparkles size={18} />
        Continue
      </button>
    </div>
  </div>
);
