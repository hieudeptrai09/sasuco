export function generateId(): string {
  return crypto.randomUUID();
}

export function readCollection<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export function writeCollection<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

export function readValue<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeValue<T>(key: string, value: T | null): void {
  if (typeof window === "undefined") return;
  if (value === null) {
    window.localStorage.removeItem(key);
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}
