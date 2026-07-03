import type { AuthUser } from "../types/user";
import { STORAGE_KEYS } from "../constants/storage-keys";
import { ensureSeedData } from "./seed";
import { readValue, writeValue } from "./storage";
import { createUser, findUserByEmail, getUser, toAuthUser } from "./users-service";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
export type AuthResult = { ok: true } | { ok: false; error: string };

export interface AuthSnapshot {
  status: AuthStatus;
  user: AuthUser | null;
}

interface Session {
  userId: string;
}

const SERVER_SNAPSHOT: AuthSnapshot = { status: "loading", user: null };

let cachedSnapshot: AuthSnapshot = SERVER_SNAPSHOT;
let seeded = false;
const listeners = new Set<() => void>();

function computeSnapshot(): AuthSnapshot {
  if (!seeded) {
    ensureSeedData();
    seeded = true;
  }
  const session = readValue<Session>(STORAGE_KEYS.session);
  const found = session ? getUser(session.userId) : undefined;
  if (found) {
    return { status: "authenticated", user: toAuthUser(found) };
  }
  return { status: "unauthenticated", user: null };
}

function notify() {
  cachedSnapshot = computeSnapshot();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    cachedSnapshot = computeSnapshot();
  }
  listeners.add(listener);
  listener();
  return () => listeners.delete(listener);
}

export function getSnapshot(): AuthSnapshot {
  return cachedSnapshot;
}

export function getServerSnapshot(): AuthSnapshot {
  return SERVER_SNAPSHOT;
}

export function login(email: string, password: string): AuthResult {
  const found = findUserByEmail(email);
  if (!found || found.password !== password) {
    return { ok: false, error: "Email hoặc mật khẩu không đúng." };
  }
  writeValue<Session>(STORAGE_KEYS.session, { userId: found.id });
  notify();
  return { ok: true };
}

export function logout(): void {
  writeValue<Session>(STORAGE_KEYS.session, null);
  notify();
}

export function registerStudent(
  name: string,
  email: string,
  password: string
): AuthResult {
  if (findUserByEmail(email)) {
    return { ok: false, error: "Email này đã được sử dụng." };
  }
  const created = createUser({ name, email, password, role: "student" });
  writeValue<Session>(STORAGE_KEYS.session, { userId: created.id });
  notify();
  return { ok: true };
}
