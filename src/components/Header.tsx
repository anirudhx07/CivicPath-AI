import React from "react";
import { Bell, User, ChevronLeft } from "lucide-react";
import { AppScreen } from "../types";
import { cn } from "../lib/utils";

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  showProfile?: boolean;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBack, 
  currentScreen, 
  onNavigate, 
  showProfile = true, 
  showNotifications = true 
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-paper border-b border-ink h-16 md:hidden">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-4">
          {onBack ? (
            <button onClick={onBack} className="p-1 -ml-1 border border-ink hover:bg-white transition-colors">
              <ChevronLeft size={20} />
            </button>
          ) : (
            showProfile && (
              <button 
                onClick={() => onNavigate(AppScreen.PROFILE)}
                className="w-10 h-10 border border-ink flex items-center justify-center bg-white shadow-[2px_2px_0_0_#1E1E1E]"
              >
                <User size={18} className="text-ink" />
              </button>
            )
          )}
          <h1 className="text-md font-serif italic font-bold text-ink truncate max-w-[180px]">
            {title || "CivicPath AI"}
          </h1>
        </div>

        {showNotifications && (
          <button 
            onClick={() => onNavigate(AppScreen.NOTIFICATIONS)}
            className="w-10 h-10 flex items-center justify-center text-ink border border-ink bg-white shadow-[2px_2px_0_0_#1E1E1E]"
          >
            <Bell size={18} />
          </button>
        )}
      </div>
    </header>
  );
};
