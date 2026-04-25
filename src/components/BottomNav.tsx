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

  const mainScreens = [AppScreen.HOME, AppScreen.TIMELINE, AppScreen.AI_GUIDE, AppScreen.LEARN, AppScreen.PROFILE];
  if (!mainScreens.includes(currentScreen) && currentScreen !== AppScreen.SAVED && currentScreen !== AppScreen.NOTIFICATIONS) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-paper border-t border-ink z-50 flex justify-around items-center px-4 pb-4 pt-3 h-20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.screen;
        return (
          <button
            key={tab.screen}
            onClick={() => onNavigate(tab.screen)}
            className={cn(
              "flex flex-col items-center justify-center transition-all px-3 py-1 border-t-2 border-transparent",
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
