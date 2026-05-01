import type { ReactNode } from "react";
import { AppScreen } from "../types";
import type { UseAppStateReturn } from "../hooks/useAppState";
import type { UseAuthReturn } from "../hooks/useAuth";

// Screen imports
import { SplashScreen } from "../screens/SplashScreen";
import { LanguageScreen } from "../screens/LanguageScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { RoleSelectionScreen } from "../screens/RoleSelectionScreen";
import { SignInScreen } from "../screens/SignInScreen";
import { HomeDashboard } from "../screens/HomeDashboard";
import { AIGuideScreen } from "../screens/AIGuideScreen";
import { TimelineScreen } from "../screens/TimelineScreen";
import { TimelineDetailScreen } from "../screens/TimelineDetailScreen";
import { LearnHub } from "../screens/LearnHub";
import { LessonDetailScreen } from "../screens/LessonDetailScreen";
import { QuizStartScreen } from "../screens/QuizStartScreen";
import { QuizQuestionScreen } from "../screens/QuizQuestionScreen";
import { QuizResultScreen } from "../screens/QuizResultScreen";
import { QuizReviewScreen } from "../screens/QuizStartScreen";
import { MythBusterScreen } from "../screens/MythBusterScreen";
import { SavedItemsScreen } from "../screens/SavedItemsScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { BadgesScreen } from "../screens/BadgesScreen";
import { AccessibilityScreen } from "../screens/AccessibilityScreen";
import { TeacherToolkitScreen } from "../screens/TeacherToolkitScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { PrivacySafetyScreen } from "../screens/PrivacySafetyScreen";

/**
 * Maps the current screen to its component, wiring props from app state.
 */
export function renderScreen(
  state: UseAppStateReturn,
  auth: UseAuthReturn,
): ReactNode {
  const {
    currentScreen,
    user,
    selectedLesson,
    selectedTimelineStep,
    latestQuizScore,
    navigateTo,
    goBack,
    setLanguage,
    setRole,
    updateProgress,
    updateAccessibilitySettings,
    setAuthenticatedUser,
    setGuestUser,
    resetSession,
    openLesson,
    openTimelineStep,
    startQuiz,
    completeQuiz,
    saveItem,
    deleteItem,
  } = state;

  switch (currentScreen) {
    case AppScreen.SPLASH:
      return <SplashScreen reduceAnimations={user.accessibilitySettings.reduceAnimations} />;

    case AppScreen.LANGUAGE:
      return (
        <LanguageScreen
          onNext={(lang) => {
            setLanguage(lang);
            navigateTo(AppScreen.ONBOARDING);
          }}
        />
      );

    case AppScreen.ONBOARDING:
      return (
        <OnboardingScreen
          onNext={() => navigateTo(AppScreen.ROLE_SELECTION)}
          onSkip={() => navigateTo(AppScreen.SIGN_IN)}
          reduceAnimations={user.accessibilitySettings.reduceAnimations}
        />
      );

    case AppScreen.ROLE_SELECTION:
      return (
        <RoleSelectionScreen
          user={user}
          onSelect={(role) => {
            setRole(role);
            navigateTo(AppScreen.SIGN_IN);
          }}
          onBack={goBack}
        />
      );

    case AppScreen.SIGN_IN:
      return (
        <SignInScreen
          loading={auth.loading}
          error={auth.error}
          onLogin={async (email, password) => {
            const result = await auth.loginWithEmail(email, password);

            if (result.ok === false) {
              return result.error;
            }

            if (result.ok) {
              setAuthenticatedUser(result.user);
              return null;
            }
          }}
          onCreateAccount={async (name, email, password) => {
            const result = await auth.createAccount(name, email, password);

            if (result.ok === false) {
              return result.error;
            }

            if (result.ok) {
              setAuthenticatedUser(result.user, {
                role: user.role,
                language: user.language,
              });
              return null;
            }
          }}
          onGuest={async () => {
            const result = await auth.continueAsGuest();

            if (result.ok === false) {
              return result.error;
            }

            if (result.ok) {
              setGuestUser(result.user, {
                role: user.role,
                language: user.language,
              });
              return null;
            }
          }}
          onBack={goBack}
        />
      );

    case AppScreen.HOME:
      return <HomeDashboard user={user} onNavigate={navigateTo} />;

    case AppScreen.AI_GUIDE:
      return (
        <AIGuideScreen
          user={user}
          onNavigate={navigateTo}
          onSaveAnswer={saveItem}
          onStartQuiz={startQuiz}
          accessibilitySettings={user.accessibilitySettings}
        />
      );

    case AppScreen.TIMELINE:
      return <TimelineScreen user={user} onOpenStep={openTimelineStep} />;

    case AppScreen.LEARN:
      return <LearnHub user={user} onOpenLesson={openLesson} />;

    case AppScreen.PROFILE:
      return (
        <ProfileScreen
          user={user}
          onNavigate={navigateTo}
          onSignOut={async () => {
            await auth.signOut();
            resetSession();
          }}
          authError={auth.error ?? state.persistenceError}
          signOutLoading={auth.loading}
        />
      );

    case AppScreen.BADGES:
      return <BadgesScreen user={user} onBack={goBack} />;

    case AppScreen.SAVED:
      return <SavedItemsScreen user={user} onBack={goBack} onDelete={deleteItem} />;

    case AppScreen.NOTIFICATIONS:
      return <NotificationsScreen onBack={goBack} onNavigate={navigateTo} />;

    case AppScreen.MYTH_BUSTER:
      return (
        <MythBusterScreen
          onBack={goBack}
          onAskFollowUp={(question) => {
            try {
              sessionStorage.setItem("civicpath-ai-guide-draft", question);
            } catch {
              // The AI Guide still opens if session storage is unavailable.
            }
            navigateTo(AppScreen.AI_GUIDE);
          }}
          onSaveMyth={saveItem}
          savedItems={user.savedItems}
        />
      );

    case AppScreen.QUIZ_START:
      return (
        <QuizStartScreen
          onStart={startQuiz}
          onBack={goBack}
        />
      );

    case AppScreen.QUIZ_QUESTION:
      return (
        <QuizQuestionScreen
          activeQuiz={state.activeQuiz}
          accessibilitySettings={user.accessibilitySettings}
          onComplete={completeQuiz}
        />
      );

    case AppScreen.QUIZ_RESULT:
      return (
        <QuizResultScreen
          user={user}
          score={latestQuizScore}
          total={state.latestQuizTotal}
          onRetry={() => navigateTo(AppScreen.QUIZ_START)}
          onHome={() => navigateTo(AppScreen.HOME)}
          onReview={() => navigateTo(AppScreen.QUIZ_REVIEW)}
        />
      );

    case AppScreen.QUIZ_REVIEW:
      return (
        <QuizReviewScreen
          answers={state.latestQuizReview}
          onBack={goBack}
          onHome={() => navigateTo(AppScreen.HOME)}
        />
      );

    case AppScreen.LESSON_DETAIL:
      return (
        <LessonDetailScreen
          lesson={selectedLesson}
          accessibilitySettings={user.accessibilitySettings}
          onBack={goBack}
          onAskAI={(question) => {
            try {
              sessionStorage.setItem("civicpath-ai-guide-draft", question);
            } catch {
              // The AI Guide still opens if session storage is unavailable.
            }
            navigateTo(AppScreen.AI_GUIDE);
          }}
          onTakeQuiz={() => navigateTo(AppScreen.QUIZ_START)}
          onComplete={(id) =>
            updateProgress(
              Array.from(new Set([...user.lessonsCompleted, id])),
              user.timelineStepsCompleted,
              user.quizzesCompleted,
            )
          }
        />
      );

    case AppScreen.TIMELINE_DETAIL:
      return <TimelineDetailScreen step={selectedTimelineStep} onBack={goBack} />;

    case AppScreen.ACCESSIBILITY:
      return (
        <AccessibilityScreen
          settings={user.accessibilitySettings}
          onChange={updateAccessibilitySettings}
          onBack={goBack}
        />
      );

    case AppScreen.TEACHER_TOOLKIT:
      return <TeacherToolkitScreen onBack={goBack} />;

    case AppScreen.SEARCH:
      return (
        <SearchScreen
          onBack={goBack}
          onNavigate={navigateTo}
          onOpenLesson={openLesson}
          onOpenTimelineStep={(stepId) => openTimelineStep(stepId, false)}
        />
      );

    case AppScreen.PRIVACY_SAFETY:
      return <PrivacySafetyScreen onBack={goBack} />;

    default:
      return (
        <div className="p-10 text-center pt-24 space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-slate-300">
            <span className="material-symbols-outlined text-4xl">construction</span>
          </div>
          <h3 className="font-bold">Under Construction</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            This educational module is currently being verified for accuracy. Check back soon!
          </p>
          <button
            onClick={() => navigateTo(AppScreen.HOME)}
            className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold text-sm"
          >
            Go Home
          </button>
        </div>
      );
  }
}
