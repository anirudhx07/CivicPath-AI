import { firebaseConfigStatus } from "../services/firebase";

interface SignInScreenProps {
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  onGuest: () => void;
  onBack: () => void;
}

export const SignInScreen = ({
  loading,
  error,
  signInWithGoogle,
  onGuest,
}: SignInScreenProps) => {
  const showFirebaseSetup = !firebaseConfigStatus.isConfigured;

  return (
    <div className="min-h-screen flex flex-col p-8 items-center justify-center bg-paper">
      <div className="w-full max-w-md bg-white p-12 border-2 border-ink shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] text-center">
        <div className="w-20 h-20 border-2 border-ink mx-auto flex items-center justify-center mb-10">
          <span className="material-symbols-outlined text-4xl text-ink">verified</span>
        </div>
        <h1 className="text-4xl font-serif italic font-bold mb-4">Credentials</h1>
        <p className="text-muted leading-relaxed mb-12">
          Initialize your education record to synchronize progress across modules.
        </p>

        <div className="space-y-4">
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full py-5 border border-ink flex items-center justify-center gap-4 bg-paper hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {loading ? "Signing in with Google..." : "Authorize via Google"}
            </span>
          </button>
          <button
            type="button"
            disabled
            className="w-full py-5 bg-ink text-white flex items-center justify-center gap-4 hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            title="Academic email authentication is not enabled yet."
          >
            <span className="material-symbols-outlined text-sm">mail</span>
            <span className="text-[10px] font-black uppercase tracking-widest">
              Academic Email Not Enabled
            </span>
          </button>
        </div>

        {showFirebaseSetup && (
          <div className="mt-6 p-5 border border-border bg-paper text-left">
            <p className="text-xs font-bold text-ink mb-3">Firebase is not configured.</p>
            <p className="text-[11px] leading-relaxed text-muted">
              Missing keys: {firebaseConfigStatus.missingKeys.join(", ")}.
            </p>
            <p className="text-[11px] leading-relaxed text-muted mt-2">
              Create a .env file in the project root, copy values from .env.example, then restart
              npm run dev.
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-6 text-xs leading-relaxed text-red-600 font-bold">
            {error}
          </p>
        )}

        <div className="mt-12 flex flex-col gap-6">
          <button
            type="button"
            onClick={onGuest}
            className="text-[10px] font-black uppercase tracking-widest text-accent border-b border-accent pb-1 w-fit mx-auto"
          >
            Proceed as Unverified Guest
          </button>
          <div className="h-[1px] w-full bg-border" />
          <p className="text-[9px] uppercase font-bold tracking-tighter text-muted">
            A project of the Non-Partisan Educational Initiative
          </p>
        </div>
      </div>
    </div>
  );
};
