"use client";

import { useSyncExternalStore } from "react";
import { todayISO } from "@/lib/recommender/pricing";

const noSubscribe = () => () => {};

/**
 * Today's date (YYYY-MM-DD) in the browser, or null while rendering on the server.
 * Reading the clock during prerender would freeze the build date into the page, so Next.js forbids it.
 */
export function useToday(): string | null {
  return useSyncExternalStore(noSubscribe, todayISO, () => null);
}
