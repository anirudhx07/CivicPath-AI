import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { useAppState } from "../hooks/useAppState";
import { useAuth } from "../hooks/useAuth";
import { shouldShowNav } from "./navigation";
import { renderScreen } from "./routes";

export default function App() {
  const state = useAppState();
  const auth = useAuth();
  const { currentScreen, history, setAuthenticatedUser } = state;
  const showNav = shouldShowNav(currentScreen);

  useEffect(() => {
    if (auth.user?.isAuthenticated) {
      setAuthenticatedUser(auth.user);
    }
  }, [auth.user, setAuthenticatedUser]);

  return (
    <div className="min-h-screen bg-paper flex text-ink font-sans selection:bg-accent/20">
      {showNav && <Sidebar currentScreen={currentScreen} onNavigate={state.navigateTo} />}

      <main className="flex-1 relative flex flex-col min-w-0">
        {showNav && (
          <Header
            currentScreen={currentScreen}
            onNavigate={state.navigateTo}
            onBack={history.length > 0 ? state.goBack : undefined}
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
            {renderScreen(state, auth)}
          </motion.div>
        </AnimatePresence>
      </main>

      {showNav && <BottomNav currentScreen={currentScreen} onNavigate={state.navigateTo} />}
    </div>
  );
}
