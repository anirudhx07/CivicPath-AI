import { ArrowLeft, Bell, BookOpen, Medal, SearchCheck, Sparkles } from "lucide-react";
import { AppScreen } from "../types";
import { NOTIFICATIONS } from "../data/notifications";
import type { Notification } from "../types";

interface NotificationsScreenProps {
  onBack: () => void;
  onNavigate: (screen: AppScreen) => void;
}

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "badge":
      return Medal;
    case "myth":
      return SearchCheck;
    case "quiz":
      return Sparkles;
    case "lesson":
      return BookOpen;
    case "system":
    default:
      return Bell;
  }
}

export const NotificationsScreen = ({ onBack, onNavigate }: NotificationsScreenProps) => (
  <div className="screen-shell screen-shell-md min-h-screen">
    <button onClick={onBack} className="ghost-button mb-6">
      <ArrowLeft size={17} />
      Back
    </button>
    <section className="mb-6">
      <p className="page-eyebrow">Updates</p>
      <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Notifications</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Learning reminders, badge updates, and product safety notes for your CivicPath session.
      </p>
    </section>

    {NOTIFICATIONS.length === 0 ? (
      <div className="screen-card p-10 text-center">
        <Bell className="mx-auto text-muted" size={40} />
        <h2 className="mt-4 text-xl font-black text-ink">No notifications</h2>
        <p className="mt-2 text-sm text-muted">You are all caught up.</p>
      </div>
    ) : (
      <div className="space-y-3">
        {NOTIFICATIONS.map((notification) => {
          const Icon = getNotificationIcon(notification.type);

          return (
            <article
              key={notification.id}
              className={`screen-card p-5 sm:p-6 ${
                notification.read ? "bg-white/75" : "border-blue-200 bg-white shadow-md"
              }`}
            >
              <div className="flex gap-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    notification.read ? "bg-paper text-muted" : "bg-soft-blue text-accent"
                  }`}
                >
                  <Icon size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {!notification.read && (
                          <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-label="Unread" />
                        )}
                        <h2 className="text-lg font-black leading-tight text-ink">
                          {notification.title}
                        </h2>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{notification.message}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-muted">{notification.date}</span>
                  </div>
                  <button
                    onClick={() => notification.link && onNavigate(notification.link)}
                    disabled={!notification.link}
                    className="secondary-button mt-4 min-h-12 rounded-full px-3 py-2 text-xs disabled:opacity-40"
                  >
                    {notification.link ? "Open" : "No link"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    )}
  </div>
);
