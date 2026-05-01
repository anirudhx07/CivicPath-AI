import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  UserPlus,
} from "lucide-react";

type AuthMode = "login" | "create" | "guest";

const DEMO_STORAGE_KEYS = new Set([
  "civicpath_users",
  "civicpath_current_user",
  "civicpath-user-state",
  "civicpath-ai-guide-draft",
]);
const DEMO_PROGRESS_PREFIX = "civicpath_progress_";

interface SignInScreenProps {
  loading: boolean;
  error: string | null;
  onLogin: (email: string, password: string) => Promise<string | null>;
  onCreateAccount: (name: string, email: string, password: string) => Promise<string | null>;
  onGuest: () => Promise<string | null>;
  onBack: () => void;
}

const modeLabels: Record<AuthMode, string> = {
  login: "Login",
  create: "Create Account",
  guest: "Guest",
};

function isDemoStorageKey(key: string): boolean {
  return DEMO_STORAGE_KEYS.has(key) || key.startsWith(DEMO_PROGRESS_PREFIX);
}

function clearDemoStorage(storage: Storage): void {
  const keysToRemove: string[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key && isDemoStorageKey(key)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => storage.removeItem(key));
}

function AuthField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted">
          {icon}
        </span>
        {children}
      </span>
    </label>
  );
}

export const SignInScreen = ({
  loading,
  error,
  onLogin,
  onCreateAccount,
  onGuest,
  onBack,
}: SignInScreenProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    const message = await onLogin(email, password);
    setLocalError(message);
  };

  const submitCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const message = await onCreateAccount(name, email, password);
    setLocalError(message);
  };

  const submitGuest = async () => {
    setLocalError(null);
    const message = await onGuest();
    setLocalError(message);
  };

  const resetDemoData = () => {
    const shouldReset = window.confirm(
      "Reset all local CivicPath demo accounts and progress on this device?",
    );

    if (!shouldReset) {
      return;
    }

    try {
      clearDemoStorage(window.localStorage);
    } catch {
      // Continue with session storage cleanup and reload.
    }

    try {
      clearDemoStorage(window.sessionStorage);
    } catch {
      // Reload even if storage cleanup is partially blocked.
    }

    window.location.reload();
  };

  const visibleError = localError ?? error;

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_34%),linear-gradient(135deg,#EFF6FF_0%,#F8FAFC_45%,#FFFFFF_100%)] px-4 py-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,440px)]">
          <section className="hidden min-w-0 lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-bold text-accent shadow-sm">
              <Sparkles size={16} />
              Civic AI learning workspace
            </div>
            <h1 className="mt-6 max-w-2xl text-5xl font-black leading-tight text-ink">
              Build election confidence with a neutral AI guide.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              Ask civic questions, follow the timeline, complete lessons, and keep your prototype
              progress saved locally on this device.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {["Local records", "Guest mode", "Neutral guidance"].map((item) => (
                <div key={item} className="rounded-3xl border border-border bg-white/80 p-4 shadow-sm">
                  <ShieldCheck className="mb-3 text-accent" size={20} />
                  <p className="text-sm font-extrabold text-ink">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="soft-panel mx-auto w-full max-w-md p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="ghost-button px-3"
                aria-label="Back"
              >
                <ArrowLeft size={17} />
                Back
              </button>
              <button
                type="button"
                onClick={resetDemoData}
                className="min-h-12 rounded-full px-3 py-2 text-xs font-bold text-muted transition hover:bg-red-50 hover:text-error"
              >
                Reset demo data
              </button>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-accent to-indigo text-white shadow-lg shadow-blue-500/20">
                <Sparkles size={28} />
              </div>
              <h1 className="text-3xl font-black text-ink sm:text-4xl">Welcome to CivicPath AI</h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
                Create a local learning record or continue as guest.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 rounded-2xl border border-border bg-paper p-1">
              {(["login", "create", "guest"] as AuthMode[]).map((nextMode) => (
                <button
                  key={nextMode}
                  type="button"
                  aria-pressed={mode === nextMode}
                  onClick={() => {
                    setMode(nextMode);
                    setLocalError(null);
                  }}
                  className={`rounded-xl px-2 py-3 text-xs font-extrabold transition ${
                    mode === nextMode
                      ? "bg-white text-accent shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {modeLabels[nextMode]}
                </button>
              ))}
            </div>

            {mode === "login" && (
              <form className="mt-6 space-y-4" onSubmit={submitLogin}>
                <AuthField label="Email" icon={<Mail size={18} />}>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="modern-input pl-12"
                    placeholder="you@example.com"
                  />
                </AuthField>
                <AuthField label="Password" icon={<LockKeyhole size={18} />}>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    className="modern-input pl-12"
                    placeholder="Enter your password"
                  />
                </AuthField>
                <button type="submit" disabled={loading} className="primary-button w-full">
                  <LogIn size={18} />
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            )}

            {mode === "create" && (
              <form className="mt-6 space-y-4" onSubmit={submitCreateAccount}>
                <AuthField label="Full name" icon={<UserRound size={18} />}>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    className="modern-input pl-12"
                    placeholder="Your name"
                  />
                </AuthField>
                <AuthField label="Email" icon={<Mail size={18} />}>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="modern-input pl-12"
                    placeholder="you@example.com"
                  />
                </AuthField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AuthField label="Password" icon={<LockKeyhole size={18} />}>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="new-password"
                      className="modern-input pl-12"
                      placeholder="Password"
                    />
                  </AuthField>
                  <AuthField label="Confirm" icon={<LockKeyhole size={18} />}>
                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                      className="modern-input pl-12"
                      placeholder="Repeat password"
                    />
                  </AuthField>
                </div>
                <button type="submit" disabled={loading} className="primary-button w-full">
                  <UserPlus size={18} />
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}

            {mode === "guest" && (
              <section className="mt-6 space-y-5">
                <div className="rounded-3xl border border-blue-100 bg-soft-blue p-5 text-center">
                  <UserRound className="mx-auto mb-3 text-accent" size={28} />
                  <h2 className="text-lg font-black text-ink">Continue without an account</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Explore the full prototype with local progress on this device only.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={submitGuest}
                  disabled={loading}
                  className="primary-button w-full"
                >
                  <UserRound size={18} />
                  {loading ? "Starting guest mode..." : "Continue as Guest"}
                </button>
              </section>
            )}

            {visibleError && (
              <p
                role="alert"
                className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold leading-6 text-error"
              >
                {visibleError}
              </p>
            )}

            <p className="mt-6 rounded-2xl bg-paper p-4 text-center text-xs font-semibold leading-5 text-muted">
              Prototype account data is saved locally on this device.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
