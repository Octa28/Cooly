"use client";

// User data lives in this browser for now. It moves to Supabase (CLAUDE.md 9.1) once the
// project and Row Level Security are set up; see docs/decisions.md D-03.

import { INGREDIENTS_BY_ID } from "@/lib/data";
import { createLocalStore } from "@/lib/local-store";
import { ANY_PRICE, type PriceRange, SORT_OPTIONS, type SortKey } from "@/lib/recommender/ranking";
import type { AllergenId, Constraints, Diet, Equipment, Fridge } from "@/lib/types";

export const DIETS: readonly { id: Diet; label: string }[] = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "halal", label: "Halal" },
  { id: "pescatarian", label: "Pescatarian" },
];

export const ALLERGENS: readonly { id: AllergenId; label: string }[] = [
  { id: "gluten", label: "Gluten" },
  { id: "milk", label: "Milk" },
  { id: "eggs", label: "Eggs" },
  { id: "peanuts", label: "Peanuts" },
  { id: "nuts", label: "Tree nuts" },
  { id: "soybeans", label: "Soy" },
  { id: "fish", label: "Fish" },
  { id: "crustaceans", label: "Crustaceans" },
  { id: "molluscs", label: "Molluscs" },
  { id: "sesame", label: "Sesame" },
  { id: "mustard", label: "Mustard" },
  { id: "celery", label: "Celery" },
  { id: "sulphites", label: "Sulphites" },
  { id: "lupin", label: "Lupin" },
];

export const EQUIPMENT: readonly { id: Equipment; label: string }[] = [
  { id: "stove", label: "Stove" },
  { id: "oven", label: "Oven" },
  { id: "microwave", label: "Microwave" },
  { id: "air-fryer", label: "Air fryer" },
  { id: "blender", label: "Blender" },
  { id: "kettle", label: "Kettle" },
];

export const NO_CONSTRAINTS: Constraints = { allergens: [], diet: null, equipment: null };

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

export const constraintsStore = createLocalStore<Constraints>("cooly:constraints:v1", NO_CONSTRAINTS, (raw) => {
  const r = (raw ?? {}) as Partial<Record<keyof Constraints, unknown>>;
  const allergens = Array.isArray(r.allergens) ? r.allergens.filter((a) => ALLERGENS.some((x) => x.id === a)) : [];
  const diet = DIETS.some((d) => d.id === r.diet) ? (r.diet as Diet) : null;
  const equipment = Array.isArray(r.equipment)
    ? (r.equipment.filter((e) => EQUIPMENT.some((x) => x.id === e)) as Equipment[])
    : null;
  return { allergens: allergens as AllergenId[], diet, equipment: equipment?.length ? equipment : null };
});

export const sortStore = createLocalStore<SortKey>("cooly:sort:v1", "recommended", (raw) =>
  SORT_OPTIONS.some((o) => o.id === raw) ? (raw as SortKey) : "recommended",
);

export const priceRangeStore = createLocalStore<PriceRange>("cooly:price-range:v1", ANY_PRICE, (raw) => {
  const r = (raw ?? {}) as Partial<Record<keyof PriceRange, unknown>>;
  const minCents = typeof r.minCents === "number" && r.minCents >= 0 ? Math.round(r.minCents) : 0;
  const maxCents = typeof r.maxCents === "number" && r.maxCents >= minCents ? Math.round(r.maxCents) : null;
  return { minCents, maxCents };
});

/** How many filters are on, for the "Filters · 2" label. */
export function activeFilterCount(c: Constraints): number {
  return c.allergens.length + (c.diet ? 1 : 0) + (c.equipment ? 1 : 0);
}

export function addToFridge(id: string, quantity: number) {
  fridgeStore.set({ ...fridgeStore.get(), [id]: quantity });
}

export function removeFromFridge(id: string) {
  const next = { ...fridgeStore.get() };
  delete next[id];
  fridgeStore.set(next);
}
