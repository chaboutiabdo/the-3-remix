/**
 * Tiny TTL-backed localStorage cache for instant-paint reads
 * (e.g. last viewed list, user prefs). Safe in SSR.
 */
type Entry<T> = { v: T; e: number };

const PREFIX = "psy.cache:";

export function cacheGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Entry<T>;
    if (parsed.e && parsed.e < Date.now()) {
      window.localStorage.removeItem(PREFIX + key);
      return null;
    }
    return parsed.v;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, value: T, ttlMs = 5 * 60_000): void {
  if (typeof window === "undefined") return;
  try {
    const entry: Entry<T> = { v: value, e: Date.now() + ttlMs };
    window.localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function cacheDel(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}
