import React from "react";
import { AppScreen } from "../types";
import { Home, ClipboardList, Bot, School, User } from "lucide-react";
import { cn } from "../lib/utils";

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { screen: AppScreen.HOME, label: "Home", icon: Home },
    { screen: AppScreen.TIMELINE, label: "Timeline", icon: ClipboardList },
    { screen: AppScreen.AI_GUIDE, label: "AI Guide", icon: Bot },
    { screen: AppScreen.LEARN, label: "Learn", icon: School },
    { screen: AppScreen.PROFILE, label: "Profile", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-paper border-t border-ink z-50 flex justify-between items-center px-2 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] h-[var(--mobile-bottom-nav-height)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.screen;
        return (
          <button
            key={tab.screen}
            onClick={() => onNavigate(tab.screen)}
            className={cn(
              "min-w-11 min-h-14 flex-1 max-w-[4.5rem] flex flex-col items-center justify-center transition-all px-1 py-1 border-t-2 border-transparent",
              isActive ? "text-accent border-accent" : "text-muted"
            )}
          >
            <Icon size={18} strokeWidth={isActive ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tight mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
