import { useState, type FormEvent } from "react";

type AuthMode = "login" | "create" | "guest";

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

  const visibleError = localError ?? error;

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-8 py-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] items-center justify-center bg-paper">
      <div className="w-full max-w-md bg-white p-6 sm:p-10 border-2 border-ink shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] sm:shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-ink"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>

        <div className="text-center">
          <div className="w-20 h-20 border-2 border-ink mx-auto flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-4xl text-ink">account_circle</span>
          </div>
          <h1 className="text-4xl font-serif italic font-bold mb-4">Credentials</h1>
          <p className="text-muted leading-relaxed mb-8">
            Start a local CivicPath AI learning record on this device.
          </p>
        </div>

        <div className="grid grid-cols-3 border border-ink mb-8">
          {(["login", "create", "guest"] as AuthMode[]).map((nextMode) => (
            <button
              key={nextMode}
              type="button"
              aria-pressed={mode === nextMode}
              onClick={() => {
                setMode(nextMode);
                setLocalError(null);
              }}
              className={`min-h-12 px-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors ${
                mode === nextMode ? "bg-ink text-white" : "bg-paper text-ink hover:bg-white"
              }`}
            >
              {modeLabels[nextMode]}
            </button>
          ))}
        </div>

        {mode === "login" && (
          <form className="space-y-4" onSubmit={submitLogin}>
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="w-full border border-ink bg-paper px-4 py-4 text-sm outline-none focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="w-full border border-ink bg-paper px-4 py-4 text-sm outline-none focus:bg-white"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-ink text-white flex items-center justify-center gap-4 hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {loading ? "Logging In" : "Login"}
              </span>
            </button>
          </form>
        )}

        {mode === "create" && (
          <form className="space-y-4" onSubmit={submitCreateAccount}>
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                Full Name
              </span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="w-full border border-ink bg-paper px-4 py-4 text-sm outline-none focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="w-full border border-ink bg-paper px-4 py-4 text-sm outline-none focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="w-full border border-ink bg-paper px-4 py-4 text-sm outline-none focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                Confirm Password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                className="w-full border border-ink bg-paper px-4 py-4 text-sm outline-none focus:bg-white"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-ink text-white flex items-center justify-center gap-4 hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {loading ? "Creating Account" : "Create Account"}
              </span>
            </button>
          </form>
        )}

        {mode === "guest" && (
          <section className="space-y-5 text-center">
            <p className="text-sm leading-relaxed text-muted">
              Use CivicPath AI without creating an account. Your progress will be saved only on
              this device.
            </p>
            <button
              type="button"
              onClick={submitGuest}
              disabled={loading}
              className="w-full py-5 bg-ink text-white flex items-center justify-center gap-4 hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">person</span>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {loading ? "Starting Guest Mode" : "Continue as Guest"}
              </span>
            </button>
          </section>
        )}

        <button
          type="button"
          disabled
          className="mt-5 w-full py-4 border border-border text-muted flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">mail</span>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Academic email is not enabled in this prototype.
          </span>
        </button>

        {visibleError && (
          <p role="alert" className="mt-6 text-xs leading-relaxed text-red-600 font-bold">
            {visibleError}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-6 text-center">
          <div className="h-[1px] w-full bg-border" />
          <p className="text-[9px] uppercase font-bold tracking-tighter text-muted">
            A project of the Non-Partisan Educational Initiative
          </p>
        </div>
      </div>
    </div>
  );
};
