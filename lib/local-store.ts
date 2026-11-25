"use client";

import { useSyncExternalStore } from "react";

/**
 * A tiny store backed by localStorage, read through useSyncExternalStore.
 * The server has no localStorage, so `useValue()` returns null until the browser has hydrated;
 * callers render nothing state-dependent until then, which avoids a flash of the wrong content.
 */
export function createLocalStore<T>(key: string, fallback: T, sanitise: (raw: unknown) => T) {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  function get(): T {
    if (cache === undefined) {
      try {
        const raw = window.localStorage.getItem(key);
        cache = raw === null ? fallback : sanitise(JSON.parse(raw));
      } catch {
        cache = fallback; // private mode, blocked storage or bad JSON
      }
    }
    return cache;
  }

  function set(next: T) {
    cache = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage unavailable: keep working in memory for this visit.
    }
    for (const listener of listeners) listener();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    // Keep other tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      cache = undefined;
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useValue(): T | null {
    return useSyncExternalStore(subscribe, get, () => null);
  }

  return { get, set, useValue };
}
