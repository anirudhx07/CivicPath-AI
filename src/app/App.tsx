import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { DevSetupBanner } from "../components/DevSetupBanner";
import { useAppState } from "../hooks/useAppState";
import { useAuth } from "../hooks/useAuth";
import { shouldShowNav } from "./navigation";
import { renderScreen } from "./routes";

export default function App() {
  const state = useAppState();
  const auth = useAuth();
  const { currentScreen, history, setAuthenticatedUser } = state;
  const { accessibilitySettings } = state.user;
  const showNav = shouldShowNav(currentScreen);
  const appClasses = [
    "min-h-screen bg-paper flex text-ink font-sans selection:bg-accent/20 overflow-x-hidden",
    accessibilitySettings.largeText ? "a11y-large-text" : "",
    accessibilitySettings.highContrast ? "a11y-high-contrast" : "",
    accessibilitySettings.reduceAnimations ? "a11y-reduce-motion" : "",
    accessibilitySettings.simpleLanguage ? "a11y-simple-language" : "",
    accessibilitySettings.dyslexiaFriendlyFont ? "a11y-dyslexia-font" : "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (auth.user?.isAuthenticated) {
      setAuthenticatedUser(auth.user);
    }
  }, [auth.user, setAuthenticatedUser]);

  return (
    <div className={appClasses}>
      {showNav && <Sidebar currentScreen={currentScreen} onNavigate={state.navigateTo} />}

      <main className="flex-1 relative flex flex-col min-w-0 overflow-x-hidden">
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
            initial={accessibilitySettings.reduceAnimations ? false : { opacity: 0, scale: 0.98 }}
            animate={accessibilitySettings.reduceAnimations ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={accessibilitySettings.reduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
            transition={{ duration: accessibilitySettings.reduceAnimations ? 0 : 0.2 }}
            className="flex-1 flex flex-col min-w-0 overflow-x-hidden"
          >
            {renderScreen(state, auth)}
          </motion.div>
        </AnimatePresence>
      </main>

      {showNav && <BottomNav currentScreen={currentScreen} onNavigate={state.navigateTo} />}
      <DevSetupBanner />
    </div>
  );
}
