import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AppScreen, 
  UserProfile, 
  UserRole, 
  Language, 
  SavedItem 
} from "./types";
import { Sidebar } from "./components/Sidebar";
import { BottomNav } from "./components/BottomNav";
import { Header } from "./components/Header";
import { LESSONS, TIMELINE_STEPS, QUIZ_QUESTIONS, BADGES, NOTIFICATIONS } from "./constants";

// For brevity in the single-file view, I'll define some screens as sub-components
// or placeholders while I build the main architecture.

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [user, setUser] = useState<UserProfile>({
    name: "Guest",
    role: "first-time-voter",
    language: "en",
    readinessScore: 28,
    lessonsCompleted: ["l1"],
    timelineStepsCompleted: ["ts1"],
    quizzesCompleted: [],
    quizScores: {},
    badges: ["b1"],
    savedItems: [],
  });

  // Navigation history for "Back" button
  const [history, setHistory] = useState<AppScreen[]>([]);

  const navigateTo = (screen: AppScreen) => {
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((p) => p.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen(AppScreen.HOME);
    }
  };

  // Splash timeout
  useEffect(() => {
    if (currentScreen === AppScreen.SPLASH) {
      const timer = setTimeout(() => setCurrentScreen(AppScreen.LANGUAGE), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const updateProgress = (lessons: string[], timeline: string[], quizzes: string[]) => {
    // Basic formula from request: 40% lessons, 25% timeline, 25% quiz, 10% myth
    const lessonWeight = (lessons.length / LESSONS.length) * 40;
    const timelineWeight = (timeline.length / TIMELINE_STEPS.length) * 25;
    const quizWeight = (quizzes.length > 0 ? 25 : 0); // Simplified
    const newScore = Math.min(Math.round(lessonWeight + timelineWeight + quizWeight), 100);
    
    setUser(prev => ({
      ...prev,
      lessonsCompleted: lessons,
      timelineStepsCompleted: timeline,
      quizzesCompleted: quizzes,
      readinessScore: newScore
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.SPLASH: return <SplashScreen />;
      case AppScreen.LANGUAGE: return <LanguageScreen onNext={(lang) => { setUser({...user, language: lang}); navigateTo(AppScreen.ONBOARDING); }} />;
      case AppScreen.ONBOARDING: return <OnboardingScreen onNext={() => navigateTo(AppScreen.ROLE_SELECTION)} onSkip={() => navigateTo(AppScreen.SIGN_IN)} />;
      case AppScreen.ROLE_SELECTION: return <RoleSelectionScreen user={user} onSelect={(role) => { setUser({...user, role}); navigateTo(AppScreen.SIGN_IN); }} onBack={goBack} />;
      case AppScreen.SIGN_IN: return <SignInScreen onNext={() => navigateTo(AppScreen.HOME)} onBack={goBack} />;
      case AppScreen.HOME: return <HomeDashboard user={user} onNavigate={navigateTo} />;
      case AppScreen.AI_GUIDE: return <AIGuide user={user} onNavigate={navigateTo} onSaveAnswer={(item) => setUser({...user, savedItems: [...user.savedItems, item]})} />;
      case AppScreen.TIMELINE: return <TimelineScreen user={user} onNavigate={navigateTo} onStepComplete={(id) => updateProgress(user.lessonsCompleted, Array.from(new Set([...user.timelineStepsCompleted, id])), user.quizzesCompleted)} />;
      case AppScreen.LEARN: return <LearnHub user={user} onNavigate={navigateTo} />;
      case AppScreen.PROFILE: return <ProfileScreen user={user} onNavigate={navigateTo} />;
      case AppScreen.BADGES: return <BadgesScreen user={user} onBack={goBack} />;
      case AppScreen.SAVED: return <SavedItemsScreen user={user} onBack={goBack} />;
      case AppScreen.MYTH_BUSTER: return <MythBusterScreen onBack={goBack} />;
      case AppScreen.QUIZ_START: return <QuizStartScreen onStart={() => navigateTo(AppScreen.QUIZ_QUESTION)} onBack={goBack} />;
      case AppScreen.QUIZ_QUESTION: return <QuizQuestionScreen user={user} onComplete={(score) => { updateProgress(user.lessonsCompleted, user.timelineStepsCompleted, Array.from(new Set([...user.quizzesCompleted, "current_quiz"]))); navigateTo(AppScreen.QUIZ_RESULT); }} />;
      case AppScreen.QUIZ_RESULT: return <QuizResultScreen user={user} onRetry={() => navigateTo(AppScreen.QUIZ_START)} onHome={() => navigateTo(AppScreen.HOME)} />;
      case AppScreen.LESSON_DETAIL: return <LessonDetailScreen onBack={goBack} onComplete={(id) => updateProgress(Array.from(new Set([...user.lessonsCompleted, id])), user.timelineStepsCompleted, user.quizzesCompleted)} />;
      case AppScreen.TIMELINE_DETAIL: return <TimelineDetailScreen onBack={goBack} />;
      case AppScreen.ACCESSIBILITY: return <AccessibilityScreen onBack={goBack} />;
      case AppScreen.TEACHER_TOOLKIT: return <TeacherToolkitScreen onBack={goBack} />;
      case AppScreen.SEARCH: return <SearchScreen onBack={goBack} onNavigate={navigateTo} />;
      case AppScreen.PRIVACY_SAFETY: return <PrivacySafetyScreen onBack={goBack} />;
      default: return <div className="p-10 text-center pt-24 space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-slate-300">
            <span className="material-symbols-outlined text-4xl">construction</span>
          </div>
          <h3 className="font-bold">Under Construction</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">This educational module is currently being verified for accuracy. Check back soon!</p>
          <button onClick={() => navigateTo(AppScreen.HOME)} className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-sm">Go Home</button>
      </div>;
    }
  };

  const showNav = ![AppScreen.SPLASH, AppScreen.LANGUAGE, AppScreen.ONBOARDING, AppScreen.ROLE_SELECTION, AppScreen.SIGN_IN].includes(currentScreen);

  return (
    <div className="min-h-screen bg-paper flex text-ink font-sans selection:bg-accent/20">
      {showNav && <Sidebar currentScreen={currentScreen} onNavigate={navigateTo} />}
      
      <main className="flex-1 relative flex flex-col min-w-0">
        {showNav && (
            <Header 
              currentScreen={currentScreen} 
              onNavigate={navigateTo} 
              onBack={history.length > 0 ? goBack : undefined} 
            />
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {showNav && <BottomNav currentScreen={currentScreen} onNavigate={navigateTo} />}
    </div>
  );
}

// --- Additional Screens ---

const MythBusterScreen = ({ onBack }: { onBack: () => void }) => {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<{ status: string; explanation: string; claim: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const analyze = () => {
        if (!input.trim()) return;
        setLoading(true);
        setTimeout(() => {
            let res = { status: "Misleading", explanation: "Results usually require counting, checking, and official declaration.", claim: input };
            if (input.toLowerCase().includes("educated")) res = { status: "False", explanation: "Voting eligibility is based on law, not education levels.", claim: input };
            setResult(res);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen pt-20 px-8 pb-32 max-w-2xl mx-auto w-full">
            <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Return to Desk
            </button>
            <h1 className="text-4xl font-serif italic font-bold mb-4">Myth Processor</h1>
            <p className="text-muted mb-12">Submit hearsay or viral claims for non-partisan verification.</p>

            <div className="border border-border p-8 mb-12">
                <textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Enter a claim you've heard..."
                    className="w-full bg-paper border-none min-h-[120px] focus:ring-0 text-xl font-serif italic mb-6 resize-none"
                />
                <button 
                    onClick={analyze}
                    disabled={loading || !input.trim()}
                    className="w-full py-4 bg-ink text-white font-bold uppercase text-xs tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                >
                    {loading ? "Analyzing Source..." : "Cross-Reference Source"}
                </button>
            </div>

            {loading && (
                <div className="flex flex-col items-center gap-6 py-10">
                    <div className="w-12 h-12 border-4 border-ink border-t-transparent animate-spin" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Verifying with official sources...</p>
                </div>
            )}

            {result && !loading && (
                <div className="border border-border p-8 bg-[#FEF2F2]">
                    <div className="flex justify-between items-center mb-8 border-b border-red-200 pb-4">
                        <span className="pill bg-red-600 text-white">Verification Report</span>
                        <span className="text-[10px] font-black uppercase text-red-600 tracking-widest">{result.status}</span>
                    </div>
                    <h3 className="text-xl font-serif italic mb-6 leading-relaxed">"{result.claim}"</h3>
                    <div className="bg-white/50 p-6 text-sm leading-relaxed border border-red-200 italic">
                        <strong>The Fact:</strong> {result.explanation}
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button className="text-[10px] uppercase font-bold tracking-widest text-ink border-b border-ink">Learn More</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const QuizStartScreen = ({ onStart, onBack }: { onStart: () => void; onBack: () => void }) => (
    <div className="min-h-screen flex flex-col p-8 max-w-lg mx-auto w-full pt-20">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-16 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return
        </button>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-40 h-40 border-2 border-ink flex items-center justify-center mb-12 relative">
                <span className="material-symbols-outlined text-6xl">edit_note</span>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-ink text-white flex items-center justify-center font-serif italic text-xl">
                    5
                </div>
            </div>
            <h1 className="text-4xl font-serif italic font-bold mb-6">Competency Assessment</h1>
            <p className="text-muted leading-relaxed mb-12">An official evaluation of your current election readiness. Satisfactory completion earns the "Merit of Knowledge" badge.</p>
            
            <div className="w-full border-t border-b border-border py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Examination Length</span>
                    <span className="font-serif italic font-bold">5 Modules</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Accreditation value</span>
                    <span className="font-serif italic font-bold">+50 Readiness</span>
                </div>
            </div>
        </div>
        <button onClick={onStart} className="w-full py-6 bg-ink text-white font-bold uppercase text-xs tracking-[0.2em] hover:bg-black transition-colors mt-12">
            Begin Examination
        </button>
    </div>
);

const QuizQuestionScreen = ({ user, onComplete }: { user: UserProfile; onComplete: (s: number) => void }) => {
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const q = QUIZ_QUESTIONS[idx];

    const next = () => {
        const isCorrect = selected === q.correctIndex;
        const newScore = isCorrect ? score + 1 : score;
        if (idx < QUIZ_QUESTIONS.length - 1) {
            setScore(newScore);
            setIdx(idx + 1);
            setSelected(null);
        } else {
            onComplete(newScore);
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-8 max-w-2xl mx-auto w-full pt-20">
            <div className="flex justify-between items-center mb-16 border-b border-ink pb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Module {idx + 1} of {QUIZ_QUESTIONS.length}</span>
                <div className="h-1 flex-1 bg-border mx-8">
                    <div className="h-full bg-ink transition-all" style={{ width: `${((idx + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
                </div>
            </div>

            <div className="flex-1">
                <h2 className="text-3xl font-serif italic font-bold mb-12 leading-relaxed">{q.text}</h2>
                <div className="space-y-4">
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => setSelected(i)}
                            className={`w-full p-6 text-left border flex justify-between items-center transition-all ${
                                selected === i ? "border-ink bg-ink text-white" : "border-border bg-white hover:border-ink"
                            }`}
                        >
                            <span className="font-medium text-sm">{opt}</span>
                            <div className={`w-5 h-5 border ${selected === i ? "border-white bg-white" : "border-ink"}`}>
                                {selected === i && <div className="w-full h-full bg-ink border-2 border-white" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <button 
                onClick={next}
                disabled={selected === null}
                className="w-full py-6 bg-ink text-white font-bold uppercase text-xs tracking-widest mt-12 disabled:opacity-20"
            >
                {idx === QUIZ_QUESTIONS.length - 1 ? "Submit Evaluation" : "Next Module"}
            </button>
        </div>
    );
};

const QuizResultScreen = ({ user, onRetry, onHome }: { user: UserProfile; onRetry: () => void; onHome: () => void }) => (
    <div className="min-h-screen flex flex-col p-8 items-center justify-center text-center max-w-lg mx-auto">
        <div className="w-48 h-48 border-2 border-ink flex items-center justify-center mb-12">
            <span className="material-symbols-outlined text-7xl text-ink">workspace_premium</span>
        </div>
        <div className="space-y-4 mb-16">
            <h1 className="text-4xl font-serif italic font-bold">Certification Attained</h1>
            <p className="text-muted leading-relaxed">Your performance has been cross-referenced. You have successfully demonstrated baseline competency in the democratic process.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 w-full mb-16 border-t border-b border-border py-8">
            <div className="text-center">
                <div className="text-3xl font-serif italic font-bold text-ink">4 / 5</div>
                <div className="text-[10px] text-muted uppercase font-bold tracking-widest mt-1">Modules Cleared</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-serif italic font-bold text-ink">+50</div>
                <div className="text-[10px] text-muted uppercase font-bold tracking-widest mt-1">Readiness Gain</div>
            </div>
        </div>
        <div className="w-full space-y-4">
            <button onClick={onHome} className="w-full py-6 bg-ink text-white font-bold uppercase text-[10px] tracking-[0.2em]">Return to Desk</button>
            <button onClick={onRetry} className="w-full py-6 border border-ink text-ink font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-paper">Re-Examine</button>
        </div>
    </div>
);

const LessonDetailScreen = ({ onBack, onComplete }: { onBack: () => void; onComplete: (id: string) => void }) => {
    const l = LESSONS[0]; // Just showing first one for demo
    return (
        <div className="min-h-screen bg-white">
            <header className="fixed top-0 left-0 right-0 h-16 px-8 border-b border-border bg-white z-50 flex items-center justify-between">
                <button onClick={onBack} className="p-2 -ml-2 text-ink"><span className="material-symbols-outlined">arrow_back</span></button>
                <span className="font-serif italic font-bold text-sm truncate max-w-[200px]">{l.title}</span>
                <span className="text-[10px] font-black text-accent tracking-tighter">35% READ</span>
            </header>
            <main className="pt-24 pb-32 px-8 max-w-3xl mx-auto space-y-16">
                <div>
                   <span className="pill">Issue 01 • {l.category}</span>
                   <h1 className="text-5xl font-serif italic font-bold mt-8 mb-6">{l.title}</h1>
                   <p className="text-lg font-serif italic text-muted leading-relaxed">{l.description}</p>
                </div>
                
                <div className="space-y-16">
                    {l.sections.map((s, idx) => (
                        <div key={s.id} className="space-y-6">
                            <div className="flex items-center gap-6 border-b border-border pb-4">
                                <div className="w-10 h-10 border border-ink text-ink flex items-center justify-center font-bold text-xs">0{idx + 1}</div>
                                <h3 className="font-serif italic font-bold text-2xl">{s.title}</h3>
                            </div>
                            <p className="text-lg text-ink/90 leading-loose font-serif italic lg:pl-16">{s.content}</p>
                        </div>
                    ))}
                </div>

                <div className="p-12 border-2 border-ink flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 bg-ink text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-4xl">menu_book</span>
                    </div>
                    <div>
                        <h4 className="text-xl font-serif italic font-bold mb-2">Academic Support</h4>
                        <p className="text-sm text-muted leading-relaxed">Request a synthesized summary or detailed dialectic analysis of this chapter.</p>
                    </div>
                    <button className="px-8 py-3 bg-ink text-white font-bold uppercase text-[10px] tracking-widest ml-auto">Request Info</button>
                </div>
            </main>
            <div className="fixed bottom-0 left-0 right-0 p-8 bg-white border-t border-ink flex gap-4 max-w-3xl mx-auto md:ml-64">
                <button onClick={() => { onComplete(l.id); onBack(); }} className="flex-1 py-6 bg-ink text-white font-bold uppercase text-xs tracking-[0.3em] hover:bg-black transition-colors">
                    Acknowledge Module Completion
                </button>
            </div>
        </div>
    );
};

const TimelineDetailScreen = ({ onBack }: { onBack: () => void }) => (
    <div className="min-h-screen bg-paper pt-16">
        <header className="h-20 px-8 bg-white border-b border-ink flex items-center justify-between sticky top-0 z-50">
            <button onClick={onBack} className="p-2 -ml-2 text-ink uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Return
            </button>
            <span className="font-serif italic font-bold">Documentation Extract</span>
            <div className="w-12 h-12 border border-ink flex items-center justify-center">
                <span className="material-symbols-outlined text-xs">description</span>
            </div>
        </header>
        <main className="p-8 space-y-12 max-w-3xl mx-auto pb-32">
            <div className="aspect-[21/9] bg-ink flex items-center justify-center overflow-hidden relative border border-ink">
                <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-60 grayscale" alt="Process" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent p-10 flex flex-col justify-end">
                    <span className="pill bg-white text-ink mb-2">Reference Case 01</span>
                    <h1 className="text-4xl font-serif italic font-bold text-white leading-tight">Voter Registration Protocol</h1>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-12">
                    <section className="space-y-6">
                        <h3 className="text-2xl font-serif italic font-bold border-b border-ink pb-4">Standardized Requirements</h3>
                        <p className="text-lg font-serif italic text-muted leading-relaxed">
                            Registration is the administrative prerequisite for democratic participation. It ensures the integrity of the electoral roll and prevents duplicate entries.
                        </p>
                        <div className="space-y-4">
                            {[
                                { title: "Identity Verification", desc: "Government-issued identification documents required for authenticity." },
                                { title: "Residency Statement", desc: "Proof of domicile within the electoral district." },
                                { title: "Age Accreditation", desc: "Verification of minimum age requirement as per regional law." }
                            ].map((item, idx) => (
                                <div key={item.title} className="p-8 border border-border bg-white flex gap-8">
                                    <div className="text-accent font-serif italic text-3xl shrink-0">0{idx + 1}</div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-tight mb-1">{item.title}</h4>
                                        <p className="text-[11px] text-muted uppercase font-bold tracking-widest leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                <div className="space-y-8">
                    <div className="border border-ink p-6 bg-paper">
                        <h4 className="text-xs font-black uppercase tracking-widest text-ink mb-4">Official Deadlines</h4>
                        <div className="space-y-4 border-t border-ink pt-6">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-muted">Start Date</span>
                                <span className="text-ink">Oct 12, 2024</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-muted">Closure</span>
                                <span className="text-ink">Nov 15, 2024</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
);


const NotificationsScreen = ({ onBack }: { onBack: () => void }) => (
    <div className="min-h-screen pt-20 px-8 pb-32 max-w-2xl mx-auto w-full bg-paper">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1 w-fit">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return
        </button>
        <h1 className="text-4xl font-serif italic font-bold mb-4">Official Updates</h1>
        <p className="text-muted mb-12">Dispatch logs regarding your educational progress and accreditation status.</p>
        
        <div className="space-y-0 border border-border">
            {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`p-8 border-b border-border last:border-0 ${n.read ? "bg-paper/30 opacity-60" : "bg-white shadow-[inset_4px_0_0_0_#BC9F8B]"}`}>
                    <div className="flex gap-8">
                        <div className="w-10 h-10 border border-ink flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">{n.type === 'badge' ? "military_tech" : "school"}</span>
                        </div>
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-serif italic font-bold leading-none">{n.title}</h4>
                                <span className="text-[9px] text-muted uppercase font-bold tracking-widest">{n.date}</span>
                            </div>
                            <p className="text-sm text-ink/80 leading-relaxed mb-4">{n.message}</p>
                            <button className="text-[9px] uppercase font-black tracking-[0.2em] text-accent border-b border-accent">View Dispatch</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const SplashScreen = () => (
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

const LanguageScreen = ({ onNext }: { onNext: (l: Language) => void }) => {
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

const OnboardingScreen = ({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) => {
    return (
        <div className="min-h-screen flex flex-col p-8 max-w-lg mx-auto w-full bg-paper">
            <div className="flex justify-end pt-4 mb-12">
                <button onClick={onSkip} className="text-[10px] font-black uppercase tracking-widest text-muted border-b border-muted/30">Skip Briefing</button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-48 h-48 border border-ink flex items-center justify-center mb-16 relative">
                    <motion.div 
                        animate={{ opacity: [0.1, 0.2, 0.1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-[100px] text-ink">menu_book</span>
                    </motion.div>
                    <span className="material-symbols-outlined text-[64px] text-ink z-10">smart_toy</span>
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
                    className="w-full py-6 bg-ink text-white font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-black transition-colors"
                >
                    Next Chapter
                </button>
            </div>
        </div>
    );
};

const RoleSelectionScreen = ({ user, onBack, onSelect }: { user: UserProfile; onBack: () => void; onSelect: (r: UserRole) => void }) => {
    const roles: { id: UserRole; title: string; desc: string; icon: string }[] = [
        { id: "first-time-voter", title: "First-time voter", desc: "Step-by-step guidance on registration and understanding the ballot.", icon: "badge" },
        { id: "student", title: "Student", desc: "Academic resources, historical context, and structured learning paths.", icon: "school" },
        { id: "teacher", title: "Teacher", desc: "Syllabus planning, classroom prompts, and regional curriculum.", icon: "cast_for_education" },
        { id: "citizen", title: "General citizen", desc: "Overviews of current policies, local issues, and civic engagement.", icon: "groups" },
    ];

    return (
        <div className="min-h-screen px-8 py-16 flex flex-col max-w-2xl mx-auto w-full bg-paper">
            <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1 w-fit">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Return
            </button>
            <h1 className="text-4xl font-serif italic font-bold mb-4">Educational Identity</h1>
            <p className="text-muted mb-12">Select your perspective to calibrate the Guide's pedagogical focus.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {roles.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => onSelect(r.id)}
                        className={`p-8 border-2 text-left transition-all relative ${
                            user.role === r.id ? "border-ink bg-white shadow-xl" : "border-border bg-white/50 hover:border-muted"
                        }`}
                    >
                        {user.role === r.id && <span className="absolute top-4 right-4 material-symbols-outlined text-ink">verified</span>}
                        <div className={`w-12 h-12 border flex items-center justify-center mb-6 ${user.role === r.id ? "bg-ink text-white border-ink" : "bg-paper border-border text-muted"}`}>
                            <span className="material-symbols-outlined text-xl">{r.icon}</span>
                        </div>
                        <h3 className="text-xl font-serif italic font-bold mb-2">{r.title}</h3>
                        <p className="text-[11px] uppercase font-bold tracking-widest text-muted leading-relaxed">{r.desc}</p>
                    </button>
                ))}
            </div>
            <button 
                onClick={() => onSelect(user.role)}
                className="mt-16 w-full py-6 bg-ink text-white font-bold uppercase text-[10px] tracking-[0.3em]"
            >
                Continue to Archive
            </button>
        </div>
    );
};

const SignInScreen = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
    <div className="min-h-screen flex flex-col p-8 items-center justify-center bg-paper">
        <div className="w-full max-w-md bg-white p-12 border-2 border-ink shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] text-center">
            <div className="w-20 h-20 border-2 border-ink mx-auto flex items-center justify-center mb-10">
                <span className="material-symbols-outlined text-4xl text-ink">verified</span>
            </div>
            <h1 className="text-4xl font-serif italic font-bold mb-4">Credentials</h1>
            <p className="text-muted leading-relaxed mb-12">Initialize your education record to synchronize progress across modules.</p>
            
            <div className="space-y-4">
                <button onClick={onNext} className="w-full py-5 border border-ink flex items-center justify-center gap-4 bg-paper hover:bg-white transition-colors">
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Authorize via Google</span>
                </button>
                <button onClick={onNext} className="w-full py-5 bg-ink text-white flex items-center justify-center gap-4 hover:bg-black transition-colors">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Connect via Academic Email</span>
                </button>
            </div>
            
            <div className="mt-12 flex flex-col gap-6">
                <button onClick={onNext} className="text-[10px] font-black uppercase tracking-widest text-accent border-b border-accent pb-1 w-fit mx-auto">Proceed as Unverified Guest</button>
                <div className="h-[1px] w-full bg-border" />
                <p className="text-[9px] uppercase font-bold tracking-tighter text-muted">A project of the Non-Partisan Educational Initiative</p>
            </div>
        </div>
    </div>
);


// --- Dashboard & Main Hubs ---

const HomeDashboard = ({ user, onNavigate }: { user: UserProfile; onNavigate: (s: AppScreen) => void }) => {
    return (
        <div className="flex-1 flex flex-col pt-24 px-8 pb-32 max-w-5xl mx-auto w-full">
            <section className="mb-12">
                <h1 className="text-4xl font-serif italic font-bold mb-2">Hello, {user.name}</h1>
                <p className="text-muted">Explore your verified election education guide.</p>
            </section>

            <section className="hero-card mb-12">
                <span className="pill bg-white/20 text-white mb-6">Readiness Update</span>
                <h2 className="text-5xl font-serif italic mb-4 leading-tight">Will you be ready<br/>for the next ballot?</h2>
                <p className="text-white/70 mb-8 max-w-md">Complete your learning modules to ensure you can exercise your democratic rights with confidence.</p>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="flex-1 w-full bg-white/10 border border-white/20 p-4 flex justify-between items-center cursor-pointer" onClick={() => onNavigate(AppScreen.AI_GUIDE)}>
                        <span className="text-sm opacity-60">Ask Civic AI a question...</span>
                        <span className="text-[10px] opacity-40 font-mono">CMD K</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="stat-card">
                    <span className="pill mb-4">Learning Progress</span>
                    <div className="text-[80px] font-serif leading-none text-accent mb-2">{user.readinessScore}%</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-ink">Global Readiness Score</div>
                    <p className="text-sm text-muted mt-6 leading-relaxed">
                        You've completed {user.lessonsCompleted.length} of {LESSONS.length} essential modules.
                        You're {LESSONS.length - user.lessonsCompleted.length} steps away from becoming a Certified Citizen.
                    </p>
                </div>

                <div className="stat-card flex flex-col">
                    <span className="pill mb-4">Current Module</span>
                    <h3 className="text-3xl font-serif italic mb-4">The Power of Choice</h3>
                    <p className="text-sm text-muted mb-auto leading-relaxed">
                        Topic: How candidate manifestos shape public policy and your future.
                    </p>
                    <button 
                        onClick={() => onNavigate(AppScreen.LEARN)}
                        className="mt-8 py-4 bg-ink text-white font-bold text-sm tracking-widest uppercase hover:bg-black transition-colors"
                    >
                        Continue Journey
                    </button>
                </div>
            </div>

            <section className="mb-16">
                <div className="flex justify-between items-end mb-8 pb-2 border-b border-ink">
                    <h3 className="text-2xl font-serif italic">Myth vs. Fact</h3>
                    <button onClick={() => onNavigate(AppScreen.MYTH_BUSTER)} className="text-xs font-bold uppercase tracking-widest border-b border-accent text-accent">Verify Claims</button>
                </div>
                <div className="bg-[#FEF2F2] border-l-4 border-[#EF4444] p-8">
                    <span className="text-[10px] font-black uppercase text-[#EF4444] tracking-widest block mb-4">Misleading Claim</span>
                    <p className="text-lg font-serif mb-4 leading-relaxed italic">"Election results are determined by the first exit polls shown on television."</p>
                    <div className="bg-white/50 p-4 text-sm leading-relaxed border border-[#FEE2E2]">
                        <strong>The Fact:</strong> Exit polls are statistical estimates. Official results are only declared after every single vote is manually or digitally counted and verified by the commission.
                    </div>
                </div>
            </section>

            <section className="mb-16">
                <div className="flex justify-between items-end mb-8 pb-2 border-b border-ink">
                    <h3 className="text-2xl font-serif italic">Citizen Timeline</h3>
                    <button onClick={() => onNavigate(AppScreen.TIMELINE)} className="text-xs font-bold uppercase tracking-widest border-b border-accent text-accent">Full Journey</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {TIMELINE_STEPS.slice(0, 4).map((step, idx) => (
                        <div key={step.id} className="p-6 bg-white border border-border flex gap-4">
                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold text-xs border ${user.timelineStepsCompleted.includes(step.id) ? "bg-ink text-white border-ink" : "bg-paper border-border text-muted"}`}>
                                0{idx + 1}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                                <span className={`text-[10px] uppercase font-black tracking-tighter ${user.timelineStepsCompleted.includes(step.id) ? "text-green-600" : "text-muted"}`}>
                                    {user.timelineStepsCompleted.includes(step.id) ? "Completed" : "Locked"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const AIGuide = ({ user, onNavigate, onSaveAnswer }: { user: UserProfile; onNavigate: (s: AppScreen) => void; onSaveAnswer: (i: SavedItem) => void }) => {
    const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string; id: string }[]>([
        { role: "ai", text: `Welcome, ${user.name}. I am your dedicated Civic Assistant. How can I clarify today's election proceedings for you?`, id: "1" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { role: "user" as const, text: input, id: Date.now().toString() };
        setMessages([...messages, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            let aiResponse = "Regarding that aspect of the process: elections are conducted under strict legislative frameworks to ensure neutrality and public trust.";
            setMessages(prev => [...prev, { role: "ai", text: aiResponse, id: (Date.now() + 1).toString() }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="h-screen flex flex-col bg-white">
            <header className="p-8 border-b border-ink flex items-center justify-between sticky top-0 z-30 bg-white">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-ink text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">bot</span>
                    </div>
                    <div>
                        <h1 className="font-serif italic font-bold text-xl">Civic Assistant</h1>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted">Official Education Channel</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-48 max-w-4xl mx-auto w-full">
                {messages.map((m) => (
                    <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[80%] p-8 border ${
                            m.role === "user" 
                                ? "bg-ink text-white border-ink rounded-none" 
                                : "bg-paper text-ink border-border rounded-none"
                        }`}>
                            <p className={`text-lg leading-relaxed ${m.role === "ai" ? "font-serif italic" : "font-sans font-medium"}`}>
                                {m.text}
                            </p>
                            {m.role === "ai" && (
                                <div className="mt-8 pt-6 border-t border-border flex gap-4">
                                    <button className="text-[10px] uppercase font-bold tracking-widest text-accent border-b border-accent">Save to Records</button>
                                    <button className="text-[10px] uppercase font-bold tracking-widest text-muted">Share Fragment</button>
                                </div>
                            )}
                        </div>
                        <span className="mt-2 text-[9px] uppercase font-black text-muted tracking-widest">
                            {m.role === "ai" ? "Civic AI • Verified" : "Citizen Request"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-[80px] md:bottom-0 left-0 right-0 p-8 bg-white border-t border-ink max-w-4xl mx-auto md:ml-64">
                <div className="flex items-center gap-4 bg-paper border border-border p-2">
                    <input 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSend()}
                        placeholder="Inquiry for the Assistant..." 
                        className="bg-transparent border-none flex-1 px-4 py-3 outline-none text-sm italic" 
                    />
                    <button onClick={handleSend} className="px-8 py-3 bg-ink text-white font-bold uppercase text-xs tracking-widest">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

const TimelineScreen = ({ user, onNavigate, onStepComplete }: { user: UserProfile; onNavigate: (s: AppScreen) => void; onStepComplete: (id: string) => void }) => {
    return (
        <div className="flex-1 flex flex-col pt-20 px-8 pb-32 max-w-4xl mx-auto w-full">
            <h1 className="text-4xl font-serif italic font-bold mb-4">Election Roadmap</h1>
            <p className="text-muted mb-12">A chronological guide to the democratic process, from registration to the final count.</p>
            
            <div className="space-y-0">
                {TIMELINE_STEPS.map((step, idx) => {
                    const isCompleted = user.timelineStepsCompleted.includes(step.id);
                    const isNext = !isCompleted && (idx === 0 || user.timelineStepsCompleted.includes(TIMELINE_STEPS[idx - 1].id));
                    const isLocked = !isCompleted && !isNext;

                    return (
                        <div key={step.id} className={`flex gap-10 border-b border-border py-12 ${isLocked ? "opacity-30" : ""}`}>
                            <div className={`w-12 h-12 shrink-0 flex items-center justify-center font-bold border transition-colors ${
                                isCompleted ? "bg-ink text-white border-ink" : isNext ? "bg-accent text-white border-accent" : "bg-paper border-border text-muted"
                            }`}>
                                0{idx + 1}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-serif italic mb-2">{step.title}</h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-border ${isCompleted ? "text-green-600" : isNext ? "text-accent" : "text-muted"}`}>
                                        {isCompleted ? "Verified" : isNext ? "Active" : "Locked"}
                                    </span>
                                </div>
                                <p className="text-muted leading-relaxed mb-8 max-w-2xl">{step.description}</p>
                                {!isLocked && (
                                    <button 
                                        onClick={() => {
                                            if (isNext) onStepComplete(step.id);
                                            onNavigate(AppScreen.TIMELINE_DETAIL);
                                        }}
                                        className="inline-block py-2 border-b-2 border-ink font-bold text-xs uppercase tracking-widest hover:text-muted hover:border-muted transition-all"
                                    >
                                        {isCompleted ? "Review Records" : "Begin Documentation"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const LearnHub = ({ user, onNavigate }: { user: UserProfile; onNavigate: (s: AppScreen) => void }) => (
    <div className="flex-1 flex flex-col pt-20 px-8 pb-32 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-serif italic font-bold mb-4">Education Portal</h1>
        <p className="text-muted mb-12">Core curriculum for democratic participation.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
            {LESSONS.map(lesson => (
                <button 
                    key={lesson.id}
                    onClick={() => onNavigate(AppScreen.LESSON_DETAIL)}
                    className="p-8 border-r border-b border-border text-left hover:bg-white transition-colors group bg-paper/30"
                >
                    <div className="flex justify-between items-start mb-10">
                         <div className={`w-10 h-10 flex items-center justify-center font-bold text-xs border ${user.lessonsCompleted.includes(lesson.id) ? "bg-ink text-white border-ink" : "bg-white border-border text-muted"}`}>
                            {user.lessonsCompleted.includes(lesson.id) ? "✓" : "→"}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.lessonsCompleted.includes(lesson.id) ? "text-green-600" : "text-ink"}`}>
                            {user.lessonsCompleted.includes(lesson.id) ? "Passed" : lesson.difficulty}
                        </span>
                    </div>
                    <h4 className="text-xl font-serif italic mb-4 leading-snug group-hover:text-accent transition-colors">{lesson.title}</h4>
                    <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-muted">
                        <span>{lesson.timeEstimate}</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

const ProfileScreen = ({ user, onNavigate }: { user: UserProfile; onNavigate: (s: AppScreen) => void }) => (
    <div className="flex-1 flex flex-col pt-20 px-8 pb-32 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-8 mb-16">
            <div className="w-24 h-24 bg-ink text-white flex items-center justify-center text-4xl shrink-0">
                {user.name[0]}
            </div>
            <div>
                <h2 className="text-4xl font-serif italic font-bold">{user.name}</h2>
                <p className="text-muted text-[10px] uppercase tracking-[0.2em] font-bold mt-2">{user.role.replace("-", " ")}</p>
                <div className="flex gap-4 mt-4">
                    <button onClick={() => onNavigate(AppScreen.BADGES)} className="text-[10px] font-bold uppercase tracking-widest border-b border-accent text-accent">View Honors</button>
                </div>
            </div>
        </div>

        <section className="grid grid-cols-3 gap-0 border border-border mb-16">
            <div className="p-8 text-center border-r border-border">
                <div className="text-4xl font-serif text-accent mb-2">{user.lessonsCompleted.length}</div>
                <div className="text-[9px] text-muted uppercase font-black tracking-widest">Accreditations</div>
            </div>
            <div className="p-8 text-center border-r border-border">
                <div className="text-4xl font-serif text-accent mb-2">{user.badges.length}</div>
                <div className="text-[9px] text-muted uppercase font-black tracking-widest">Merits</div>
            </div>
            <div className="p-8 text-center">
                <div className="text-4xl font-serif text-accent mb-2">{user.readinessScore}%</div>
                <div className="text-[9px] text-muted uppercase font-black tracking-widest">Readiness</div>
            </div>
        </section>

        <div className="space-y-0 border-t border-border">
            {[
                { label: "Saved Materials", icon: "history_edu", screen: AppScreen.SAVED },
                { label: "Notifications", icon: "mail", screen: AppScreen.NOTIFICATIONS },
                { label: "Accessibility", icon: "settings_accessibility", screen: AppScreen.ACCESSIBILITY },
                { label: "Teacher Toolkit", icon: "auto_stories", screen: AppScreen.TEACHER_TOOLKIT },
                { label: "Privacy Commitment", icon: "verified_user", screen: AppScreen.PRIVACY_SAFETY },
            ].map(item => (
                <button 
                    key={item.label}
                    onClick={() => onNavigate(item.screen)}
                    className="w-full flex items-center justify-between py-6 border-b border-border group hover:pl-2 transition-all"
                >
                    <div className="flex items-center gap-6">
                        <span className="material-symbols-outlined text-muted group-hover:text-ink">{item.icon}</span>
                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-border group-hover:text-ink">arrow_forward_ios</span>
                </button>
            ))}
            <button className="w-full flex items-center gap-6 py-8 text-red-600 font-bold group">
                <span className="material-symbols-outlined">power_settings_new</span>
                <span className="text-sm uppercase tracking-widest">Terminate Session</span>
            </button>
        </div>
    </div>
);

const BadgesScreen = ({ user, onBack }: { user: UserProfile; onBack: () => void }) => (
    <div className="min-h-screen pt-20 px-8 pb-32 max-w-4xl mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1 w-fit">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return
        </button>
        <h1 className="text-4xl font-serif italic font-bold mb-4">Honors & Merits</h1>
        <p className="text-muted mb-12">An archive of your demonstrated civic competencies and research contributions.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {BADGES.map(badge => {
                const isEarned = user.badges.includes(badge.id);
                return (
                    <div key={badge.id} className={`p-8 border flex flex-col items-center text-center transition-all ${
                        isEarned ? "bg-white border-ink shadow-lg" : "bg-paper/30 border-border opacity-40 grayscale"
                    }`}>
                        <div className={`w-20 h-20 border flex items-center justify-center mb-6 ${
                            isEarned ? "bg-ink text-white border-ink" : "bg-paper border-border text-muted"
                        }`}>
                            <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
                        </div>
                        <h3 className="text-xl font-serif italic font-bold mb-2">{badge.title}</h3>
                        <p className="text-[10px] text-muted uppercase font-bold tracking-widest leading-relaxed">{badge.requirement}</p>
                        {isEarned && (
                            <div className="mt-8 pt-4 border-t border-border w-full">
                                <span className="text-[9px] font-black uppercase text-accent tracking-widest">Authenticated Record</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
);

const SavedItemsScreen = ({ user, onBack }: { user: UserProfile; onBack: () => void }) => (
    <div className="min-h-screen pt-20 px-8 pb-32 max-w-3xl mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1 w-fit">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return
        </button>
        <h1 className="text-4xl font-serif italic font-bold mb-4">Saved Records</h1>
        <p className="text-muted mb-12">Personal archives of essential civic data and AI clarifications.</p>

        {user.savedItems.length === 0 ? (
            <div className="border border-dashed border-border p-20 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl text-muted mb-6">history_edu</span>
                <h3 className="text-2xl font-serif italic mb-2">No Records Found</h3>
                <p className="text-muted max-w-sm mx-auto leading-relaxed underline decoration-accent/30 decoration-2 underline-offset-4">Your personal repository is currently empty. Bookmark essential findings while interacting with the AI Guide.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {user.savedItems.map(item => (
                    <div key={item.id} className="p-8 bg-white border border-border group hover:border-ink transition-colors flex items-center gap-8">
                        <div className="w-12 h-12 border border-ink flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">{item.type === "ai" ? "smart_toy" : "menu_book"}</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-serif italic font-bold">{item.title}</h4>
                            <div className="flex gap-4 mt-2">
                                <span className="text-[9px] text-muted uppercase font-bold tracking-widest">{item.date}</span>
                                <span className="text-[9px] text-accent uppercase font-bold tracking-widest">{item.category}</span>
                            </div>
                        </div>
                        <button className="text-red-900 opacity-20 hover:opacity-100 transition-opacity"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                ))}
            </div>
        )}
    </div>
);


const AccessibilityScreen = ({ onBack }: { onBack: () => void }) => (
    <div className="min-h-screen pt-20 px-8 pb-20 max-w-2xl mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1"><span className="material-symbols-outlined text-sm">arrow_back</span> Settings</button>
        <h2 className="text-4xl font-serif italic font-bold mb-8">Accessibility</h2>
        <div className="border border-border divide-y divide-border">
            {[
                { label: "Large Text", desc: "Increase font size for better readability", icon: "format_size" },
                { label: "High Contrast", desc: "Use high contrast colors for the UI", icon: "contrast" },
                { label: "Read Aloud", desc: "Automatically read AI responses", icon: "volume_up" },
                { label: "Reduce Animations", desc: "Minimize screen transitions", icon: "motion_photos_off" },
            ].map(it => (
                <div key={it.label} className="p-8 bg-white flex items-center justify-between hover:bg-paper transition-colors">
                    <div className="flex gap-6">
                        <span className="material-symbols-outlined text-muted">{it.icon}</span>
                        <div>
                            <h4 className="font-bold text-sm tracking-tight">{it.label}</h4>
                            <p className="text-[11px] text-muted uppercase font-bold tracking-widest mt-1">{it.desc}</p>
                        </div>
                    </div>
                    <div className="w-12 h-6 bg-border rounded-none relative border border-ink"><div className="absolute left-1 top-1 w-4 h-4 bg-ink" /></div>
                </div>
            ))}
        </div>
    </div>
);

const TeacherToolkitScreen = ({ onBack }: { onBack: () => void }) => (
    <div className="min-h-screen pt-20 px-8 pb-32 max-w-4xl mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return
        </button>
        <div className="p-12 border border-ink mb-12 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
                <h2 className="text-4xl font-serif italic font-bold mb-4">Classroom Archives</h2>
                <p className="text-muted leading-relaxed">Curated tools and academic resources designed for multi-user classroom environments.</p>
            </div>
            <div className="w-32 h-32 border-2 border-ink text-ink flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-5xl">inventory_2</span>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
                { title: "Syllabus Generator", icon: "auto_fix", desc: "Compose a comprehensive 45-min curriculum based on verifyable data." },
                { title: "Examination Creator", icon: "add_task", desc: "Initialize regional quizzes for verified student groups." },
                { title: "Dialectic Prompts", icon: "forum", desc: "Analytical questions to foster civil discourse in academic settings." },
                { title: "Printable Briefs", icon: "print", desc: "Hard-copy versions of current election roadmap steps." },
            ].map(it => (
                <button key={it.title} className="p-8 border border-border text-left group hover:border-ink transition-all flex flex-col h-full bg-paper/30">
                    <span className="material-symbols-outlined text-muted group-hover:text-ink mb-6">{it.icon}</span>
                    <h4 className="text-xl font-serif italic mb-2 tracking-tight">{it.title}</h4>
                    <p className="text-[11px] text-muted uppercase font-bold tracking-widest leading-relaxed mb-auto">{it.desc}</p>
                    <span className="mt-8 text-[10px] font-black uppercase text-accent tracking-widest border-b border-accent w-fit">Request Access</span>
                </button>
            ))}
        </div>
    </div>
);

const SearchScreen = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (s: AppScreen) => void }) => {
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


const PrivacySafetyScreen = ({ onBack }: { onBack: () => void }) => (
    <div className="min-h-screen pt-20 px-8 pb-20 max-w-2xl mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1"><span className="material-symbols-outlined text-sm">arrow_back</span> Records</button>
        <h2 className="text-4xl font-serif italic font-bold mb-8">Neutrality Audit</h2>
        <div className="space-y-12">
            <div className="p-8 border-2 border-ink space-y-6">
                <h3 className="text-2xl font-serif italic font-bold">The CivicPath AI Covenant</h3>
                <p className="text-lg font-serif italic text-muted leading-relaxed">
                    CivicPath AI is strictly an educational tool. We do not store political preferences, recommend candidates, or influence voting choices. Our data comes from official, non-partisan election commissions.
                </p>
                <div className="text-[10px] font-black uppercase tracking-widest p-2 bg-ink text-white inline-block">Verified Source Protocol</div>
            </div>
            <div className="grid grid-cols-1 gap-8 opacity-80">
                {[
                    { title: "Data Privacy", desc: "Your progress is stored locally or securely in your private cloud account. We never harvest identity data." },
                    { title: "AI Moderation", desc: "Our AI is restricted to election process facts only. Political opinions are strictly gated." },
                    { title: "Report Inaccuracy", desc: "Help us keep the guide accurate by reporting errors to our audit team." },
                ].map(it => (
                    <div key={it.title} className="space-y-2 pb-6 border-b border-border">
                        <h4 className="font-bold text-sm tracking-tight uppercase">{it.title}</h4>
                        <p className="text-sm text-muted leading-relaxed">{it.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
