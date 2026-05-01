import React from "react";
import { Bot, ClipboardList, Home, School, User } from "lucide-react";
import { AppScreen } from "../types";
import { cn } from "../lib/utils";

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { screen: AppScreen.HOME, label: "Home", icon: Home },
    { screen: AppScreen.TIMELINE, label: "Timeline", icon: ClipboardList },
    { screen: AppScreen.AI_GUIDE, label: "AI Guide", icon: Bot, elevated: true },
    { screen: AppScreen.LEARN, label: "Learn", icon: School },
    { screen: AppScreen.PROFILE, label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-[var(--mobile-bottom-nav-height)] items-start justify-between rounded-t-[1.75rem] border border-border bg-white/95 px-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.screen;

        return (
          <button
            key={tab.screen}
            onClick={() => onNavigate(tab.screen)}
            className={cn(
              "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-xs font-bold transition",
              isActive ? "text-accent" : "text-muted",
              tab.elevated && "-mt-5",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-2xl transition",
                tab.elevated
                  ? "h-14 w-14 bg-accent text-white shadow-lg shadow-blue-500/25"
                  : isActive
                    ? "bg-soft-blue text-accent"
                    : "bg-transparent",
              )}
            >
              <Icon size={tab.elevated ? 22 : 19} strokeWidth={isActive || tab.elevated ? 2.7 : 2} />
            </span>
            <span className={cn("leading-none", tab.elevated && "text-[11px]")}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
