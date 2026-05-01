import React from "react";
import {
  Accessibility,
  Bell,
  BookOpen,
  Bookmark,
  Bot,
  ClipboardList,
  Home,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppScreen } from "../types";
import type { UserProfile } from "../types";
import { cn } from "../lib/utils";

interface SidebarProps {
  currentScreen: AppScreen;
  user: UserProfile;
  onNavigate: (screen: AppScreen) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, user, onNavigate }) => {
  const items = [
    { screen: AppScreen.HOME, label: "Dashboard", icon: Home },
    { screen: AppScreen.TIMELINE, label: "Election Journey", icon: ClipboardList },
    { screen: AppScreen.AI_GUIDE, label: "Assistant", icon: Bot },
    { screen: AppScreen.LEARN, label: "Knowledge Hub", icon: BookOpen },
    { screen: AppScreen.SAVED, label: "Saved Items", icon: Bookmark },
    { screen: AppScreen.NOTIFICATIONS, label: "Updates", icon: Bell },
    { screen: AppScreen.PROFILE, label: "Settings", icon: Settings },
  ];

  const bottomItems = [
    { screen: AppScreen.ACCESSIBILITY, label: "Accessibility", icon: Accessibility },
    { screen: AppScreen.PRIVACY_SAFETY, label: "Audit & Safety", icon: ShieldCheck },
  ];

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="hidden md:flex sticky top-0 h-dvh w-[88px] shrink-0 flex-col border-r border-border bg-white/95 px-3 py-5 shadow-[12px_0_35px_rgba(15,23,42,0.04)] lg:w-[260px] lg:px-4">
      <button
        type="button"
        onClick={() => onNavigate(AppScreen.HOME)}
        className="mb-6 flex min-h-14 items-center gap-3 rounded-3xl px-3 text-left transition hover:bg-soft-blue"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-indigo text-white shadow-md">
          <Sparkles size={20} />
        </span>
        <span className="hidden min-w-0 lg:block">
          <span className="block text-lg font-black leading-tight text-ink">CivicPath AI</span>
          <span className="block text-xs font-semibold text-muted">Neutral civic learning</span>
        </span>
      </button>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.screen;

          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition",
                isActive
                  ? "bg-soft-blue text-accent shadow-sm"
                  : "text-muted hover:bg-slate-50 hover:text-ink",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
                  isActive ? "bg-white text-accent" : "bg-slate-100 text-muted group-hover:text-accent",
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.6 : 2.1} />
              </span>
              <span className={cn("hidden truncate lg:block", isActive ? "font-extrabold" : "font-semibold")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 space-y-4 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => onNavigate(AppScreen.PRIVACY_SAFETY)}
          className="flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-ink to-indigo p-4 text-left text-white shadow-lg transition hover:-translate-y-0.5 lg:justify-between"
        >
          <span className="hidden lg:block">
            <span className="block text-sm font-extrabold">Submission</span>
            <span className="block text-xs text-white/70">Trust & safety brief</span>
          </span>
          <Send size={18} />
        </button>

        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.screen;

            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition",
                  isActive ? "bg-soft-blue text-accent" : "text-muted hover:bg-slate-50 hover:text-ink",
                )}
              >
                <Icon size={17} />
                <span className="hidden lg:block">{item.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onNavigate(AppScreen.PROFILE)}
          className="flex w-full items-center gap-3 rounded-3xl border border-border bg-paper p-3 text-left transition hover:border-accent hover:bg-soft-blue"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-accent text-sm font-black text-white">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.name} avatar`}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              initials
            )}
          </span>
          <span className="hidden min-w-0 lg:block">
            <span className="block truncate text-sm font-extrabold text-ink">{user.name}</span>
            <span className="block truncate text-xs font-semibold text-muted">
              {user.isGuest ? "Guest mode" : user.email}
            </span>
          </span>
        </button>
      </div>
    </aside>
  );
};
