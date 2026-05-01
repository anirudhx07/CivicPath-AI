import React from "react";
import { Bell, ChevronLeft, Sparkles } from "lucide-react";
import { AppScreen } from "../types";
import type { UserProfile } from "../types";

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  currentScreen: AppScreen;
  user: UserProfile;
  onNavigate: (screen: AppScreen) => void;
  showProfile?: boolean;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  currentScreen,
  user,
  onNavigate,
  showProfile = true,
  showNotifications = true,
}) => {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="fixed left-0 right-0 top-0 z-40 min-h-[var(--mobile-header-height)] border-b border-border bg-white/90 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-white text-ink shadow-sm transition hover:border-accent hover:text-accent"
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            showProfile && (
              <button
                onClick={() => onNavigate(AppScreen.PROFILE)}
                className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-accent text-sm font-black text-white shadow-sm"
                aria-label="Open profile"
              >
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
              </button>
            )
          )}
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[11px] font-bold text-accent">
              <Sparkles size={13} />
              CivicPath AI
            </p>
            <h1 className="truncate text-base font-extrabold text-ink">
              {title || (currentScreen === AppScreen.HOME ? "Dashboard" : "Learning Workspace")}
            </h1>
          </div>
        </div>

        {showNotifications && (
          <button
            onClick={() => onNavigate(AppScreen.NOTIFICATIONS)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-white text-ink shadow-sm transition hover:border-accent hover:text-accent"
            aria-label="Open updates"
          >
            <Bell size={18} />
          </button>
        )}
      </div>
    </header>
  );
};
