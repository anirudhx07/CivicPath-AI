import React from "react";
import { AppScreen } from "../types";
import { Home, ClipboardList, Bot, School, User, Bookmark, Bell, ShieldCheck, Accessibility } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate }) => {
  const items = [
    { screen: AppScreen.HOME, label: "Dashboard", icon: Home },
    { screen: AppScreen.TIMELINE, label: "Election Journey", icon: ClipboardList },
    { screen: AppScreen.AI_GUIDE, label: "Assistant", icon: Bot },
    { screen: AppScreen.LEARN, label: "Knowledge Hub", icon: School },
    { screen: AppScreen.SAVED, label: "Saved Items", icon: Bookmark },
    { screen: AppScreen.NOTIFICATIONS, label: "Updates", icon: Bell },
    { screen: AppScreen.PROFILE, label: "Settings", icon: User },
  ];

  const bottomItems = [
    { screen: AppScreen.ACCESSIBILITY, label: "Accessibility", icon: Accessibility },
    { screen: AppScreen.PRIVACY_SAFETY, label: "Audit & Safety", icon: ShieldCheck },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-paper border-r border-ink p-8">
      <div className="flex items-center gap-3 mb-12 py-4 border-b-2 border-ink">
        <h1 className="text-2xl font-serif italic font-bold tracking-tight text-ink leading-none">CivicPath<br/>AI</h1>
      </div>

      <nav className="flex-grow space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={cn(
                "w-full flex items-center gap-4 py-3 border-b border-transparent transition-all text-left group",
                isActive 
                  ? "text-ink border-ink font-bold" 
                  : "text-muted hover:text-ink hover:pl-2"
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive && "text-accent")} />
              <span className="text-xs uppercase font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-ink mt-auto">
        <div className="mb-8">
            <button className="w-full py-3 bg-accent text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-[4px_4px_0_0_#1E1E1E]">Digital Submission</button>
        </div>
        <div className="space-y-3">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className="w-full flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-muted hover:text-ink transition-colors"
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
