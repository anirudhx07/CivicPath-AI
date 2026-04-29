import { useCallback, useEffect, useState } from "react";
import type { AuthUser } from "../services/authService";
import {
  getAuthErrorMessage,
  listenToAuthChanges,
  signInWithGoogle as signInWithGoogleService,
  signOutUser,
} from "../services/authService";
import { envStatus } from "../services/env";

export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isFirebaseConfigured: boolean;
  missingFirebaseKeys: string[];
  signInWithGoogle: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      (message) => {
        setError(message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const signedInUser = await signInWithGoogleService();
      setUser(signedInUser);
      return signedInUser;
    } catch (err) {
      setError(getAuthErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await signOutUser();
      setUser(null);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isFirebaseConfigured: envStatus.firebase.isConfigured,
    missingFirebaseKeys: envStatus.firebase.missingKeys,
    signInWithGoogle,
    signOut,
  };
}
