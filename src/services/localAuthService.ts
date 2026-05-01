import type { Language, UserRole } from "../types";

const USERS_KEY = "civicpath_users";
const CURRENT_USER_KEY = "civicpath_current_user";

export interface LocalAuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  language: Language;
  isGuest: boolean;
  createdAt: string;
}

export type AuthResult<T = LocalAuthUser> =
  | { ok: true; user: T }
  | { ok: false; error: string };

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readUsers(): LocalAuthUser[] {
  if (!hasStorage()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as LocalAuthUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: LocalAuthUser[]): boolean {
  if (!hasStorage()) {
    return false;
  }

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch {
    return false;
  }
}

function writeCurrentUser(user: LocalAuthUser): boolean {
  if (!hasStorage()) {
    return false;
  }

  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return true;
  } catch {
    return false;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function validateAccountInput(name: string, email: string, password: string): string | null {
  if (!name.trim()) {
    return "Please enter your full name.";
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return "Please enter your email address.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return "Please enter a valid email address.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return null;
}

// Prototype-only local authentication. Do not use for production security.
export function createAccount(
  name: string,
  email: string,
  password: string,
): AuthResult {
  const validationError = validateAccountInput(name, email, password);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const normalizedEmail = normalizeEmail(email);
  const users = readUsers();
  const emailExists = users.some((user) => normalizeEmail(user.email) === normalizedEmail);

  if (emailExists) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const user: LocalAuthUser = {
    id: createId(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "first-time-voter",
    language: "en",
    isGuest: false,
    createdAt: new Date().toISOString(),
  };

  if (!writeUsers([...users, user]) || !writeCurrentUser(user)) {
    return {
      ok: false,
      error: "Unable to save this account on this device. Please check browser storage.",
    };
  }

  return { ok: true, user };
}

export function loginWithEmail(email: string, password: string): AuthResult {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return { ok: false, error: "Please enter both email and password." };
  }

  const user = readUsers().find(
    (candidate) =>
      normalizeEmail(candidate.email) === normalizedEmail && candidate.password === password,
  );

  if (!user) {
    return { ok: false, error: "Email or password is incorrect." };
  }

  if (!writeCurrentUser(user)) {
    return {
      ok: false,
      error: "Unable to start your session on this device. Please check browser storage.",
    };
  }

  return { ok: true, user };
}

export function continueAsGuest(): AuthResult {
  const guestUser: LocalAuthUser = {
    id: "guest",
    name: "Guest Learner",
    email: "",
    password: "",
    role: "first-time-voter",
    language: "en",
    isGuest: true,
    createdAt: new Date().toISOString(),
  };

  if (!writeCurrentUser(guestUser)) {
    return {
      ok: false,
      error: "Unable to start guest mode on this device. Please check browser storage.",
    };
  }

  return { ok: true, user: guestUser };
}

export function getCurrentUser(): LocalAuthUser | null {
  if (!hasStorage()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as LocalAuthUser) : null;
  } catch {
    return null;
  }
}

export function logout(): { ok: true } | { ok: false; error: string } {
  if (!hasStorage()) {
    return { ok: false, error: "Browser storage is unavailable." };
  }

  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    return { ok: true };
  } catch {
    return { ok: false, error: "Unable to end this session. Please try again." };
  }
}

export function updateCurrentUser(updates: Partial<LocalAuthUser>): AuthResult {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { ok: false, error: "No active local session was found." };
  }

  const updatedUser: LocalAuthUser = {
    ...currentUser,
    ...updates,
    id: currentUser.id,
    email: updates.email !== undefined ? normalizeEmail(updates.email) : currentUser.email,
    isGuest: currentUser.isGuest,
    createdAt: currentUser.createdAt,
  };

  if (!writeCurrentUser(updatedUser)) {
    return {
      ok: false,
      error: "Unable to update this session on this device.",
    };
  }

  if (!updatedUser.isGuest) {
    const users = readUsers();
    const nextUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));

    if (!writeUsers(nextUsers)) {
      return {
        ok: false,
        error: "Unable to update this account on this device.",
      };
    }
  }

  return { ok: true, user: updatedUser };
}

export function getAllUsers(): LocalAuthUser[] {
  return readUsers();
}
