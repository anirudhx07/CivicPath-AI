import { useCallback, useState } from "react";
import type { AuthResult, LocalAuthUser } from "../services/localAuthService";
import {
  continueAsGuest as continueAsGuestService,
  createAccount as createAccountService,
  getCurrentUser,
  loginWithEmail as loginWithEmailService,
  logout as logoutService,
} from "../services/localAuthService";

export interface UseAuthReturn {
  user: LocalAuthUser | null;
  loading: boolean;
  error: string | null;
  createAccount: (name: string, email: string, password: string) => Promise<AuthResult>;
  loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
  continueAsGuest: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<LocalAuthUser | null>(() => getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAuthAction = useCallback(
    async (action: () => AuthResult): Promise<AuthResult> => {
      setLoading(true);
      setError(null);

      try {
        const result = action();

        if (result.ok === false) {
          setError(result.error);
        } else {
          setUser(result.user);
        }

        return result;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createAccount = useCallback(
    (name: string, email: string, password: string) =>
      runAuthAction(() => createAccountService(name, email, password)),
    [runAuthAction],
  );

  const loginWithEmail = useCallback(
    (email: string, password: string) =>
      runAuthAction(() => loginWithEmailService(email, password)),
    [runAuthAction],
  );

  const continueAsGuest = useCallback(
    () => runAuthAction(() => continueAsGuestService()),
    [runAuthAction],
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = logoutService();

      if (result.ok === false) {
        setError(result.error);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    createAccount,
    loginWithEmail,
    continueAsGuest,
    signOut,
  };
}
