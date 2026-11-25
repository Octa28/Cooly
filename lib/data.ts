import ingredientsJson from "@/data/ingredients.json";
import recipesJson from "@/data/recipes.json";
import staplesJson from "@/data/staples.json";
import type { Ingredient, Recipe } from "@/lib/types";

export const INGREDIENTS = ingredientsJson as Ingredient[];
export const RECIPES = recipesJson as Recipe[];

/** Default "basics I always have" (CLAUDE.md 9.4). Editable in Settings later. */
export const DEFAULT_STAPLES: ReadonlySet<string> = new Set(staplesJson);

export const INGREDIENTS_BY_ID: ReadonlyMap<string, Ingredient> = new Map(INGREDIENTS.map((i) => [i.id, i]));

export function getIngredient(id: string): Ingredient {
  const ingredient = INGREDIENTS_BY_ID.get(id);
  if (!ingredient) throw new Error(`Unknown ingredient "${id}"`);
  return ingredient;
}

export function getRecipe(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}
