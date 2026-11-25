"use client";

// User data lives in this browser for now. It moves to Supabase (CLAUDE.md 9.1) once the
// project and Row Level Security are set up; see docs/decisions.md D-03.

import { INGREDIENTS_BY_ID } from "@/lib/data";
import { createLocalStore } from "@/lib/local-store";
import type { Diet, Fridge } from "@/lib/types";

const DIETS: readonly Diet[] = ["vegan", "vegetarian", "pescatarian", "halal"];

export const fridgeStore = createLocalStore<Fridge>("cooly:fridge:v1", {}, (raw) => {
  // Drop anything that isn't a known ingredient with a positive amount.
  const fridge: Fridge = {};
  if (raw && typeof raw === "object") {
    for (const [id, q] of Object.entries(raw)) {
      if (INGREDIENTS_BY_ID.has(id) && typeof q === "number" && q > 0) fridge[id] = q;
    }
  }
  return fridge;
});

export const dietStore = createLocalStore<Diet | null>("cooly:diet:v1", null, (raw) =>
  DIETS.includes(raw as Diet) ? (raw as Diet) : null,
);

export function addToFridge(id: string, quantity: number) {
  fridgeStore.set({ ...fridgeStore.get(), [id]: quantity });
}

export function removeFromFridge(id: string) {
  const next = { ...fridgeStore.get() };
  delete next[id];
  fridgeStore.set(next);
}
